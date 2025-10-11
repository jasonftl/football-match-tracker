// Date: 2025-10-06
// Football Match Tracker - Main Component (Refactored for V2)
// Uses modular components for better maintainability

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Download, Edit2, Trash2, Save, X, Play, Users, Info, Sparkles } from 'lucide-react';
import MatchSetup from './MatchSetup';
import PlayerSetup from './PlayerSetup';
import Timer from './Timer';
import Modal from './Modal';
import SubstitutionModal from './SubstitutionModal';
import GoalScorerModal from './GoalScorerModal';
import AboutModal from './AboutModal';
import UserAgreementModal from './UserAgreementModal';
import { AGE_GROUPS } from '../constants/ageGroups';
import {
  formatTime,
  calculateMatchMinute,
  getCurrentTimestamp,
  getPeriods,
  getElapsedSeconds,
  getCumulativeTimeFromRealTime
} from '../utils/helpers';

const MatchTracker = () => {
  // State for modals
  const [showMissedGoalConfirm, setShowMissedGoalConfirm] = useState(false);
  const [missedGoalTeam, setMissedGoalTeam] = useState(null);
  const [missedGoalPeriod, setMissedGoalPeriod] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showEndPeriodConfirm, setShowEndPeriodConfirm] = useState(false);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showGoalScorerModal, setShowGoalScorerModal] = useState(false);
  const [pendingGoalTeam, setPendingGoalTeam] = useState(null);
  const [pendingGoalPeriod, setPendingGoalPeriod] = useState(null);

  // State for user agreement (first-run)
  const [showUserAgreement, setShowUserAgreement] = useState(() => {
    const accepted = localStorage.getItem('userAgreementAccepted');
    return accepted !== 'true'; // Show if not accepted
  });

  // State for match configuration
  const [ageGroup, setAgeGroup] = useState('U7');
  const [homeTeam, setHomeTeam] = useState('Caterham Pumas');
  const [awayTeam, setAwayTeam] = useState('Opposition');
  const [setupComplete, setSetupComplete] = useState(false);
  const [playersConfigured, setPlayersConfigured] = useState(false);
  const [matchStarted, setMatchStarted] = useState(false);
  const [useQuarters, setUseQuarters] = useState(true);
  const [periodLength, setPeriodLength] = useState(10);
  const [isHome, setIsHome] = useState(true);
  const [customPeriods, setCustomPeriods] = useState(null);
  const [isManager, setIsManager] = useState(true);

  // State for player management
  const [players, setPlayers] = useState([]);
  const [showNumbers, setShowNumbers] = useState(true);

  // State for timing
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [periodStartTimestamp, setPeriodStartTimestamp] = useState(null);
  const [periodStarted, setPeriodStarted] = useState(false);
  const timerRef = useRef(null);

  // State for recorded events
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showCopied, setShowCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // State for debug mode and AI report
  const [debugMode, setDebugMode] = useState(() => {
    const saved = localStorage.getItem('debugMode');
    return saved === 'true';
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAICopied, setShowAICopied] = useState(false);
  const [aiError, setAIError] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('footballMatchData');
    const savedPlayers = localStorage.getItem('footballPlayers');

    if (savedData) {
      const data = JSON.parse(savedData);
      setAgeGroup(data.ageGroup || 'U12');
      if (data.homeTeam) setHomeTeam(data.homeTeam);
      if (data.awayTeam) setAwayTeam(data.awayTeam);
      setSetupComplete(data.setupComplete || false);
      setPlayersConfigured(data.playersConfigured || false);
      setMatchStarted(data.matchStarted || false);
      setCurrentPeriod(data.currentPeriod || null);
      setPeriodStartTimestamp(data.periodStartTimestamp || null);
      setEvents(data.events || []);
      setUseQuarters(data.useQuarters !== undefined ? data.useQuarters : false);
      setPeriodLength(data.periodLength || 30);
      setIsHome(data.isHome !== undefined ? data.isHome : true);
      setPeriodStarted(data.periodStarted || false);
      setShowNumbers(data.showNumbers !== undefined ? data.showNumbers : true);
      setCustomPeriods(data.customPeriods || null);
      setIsManager(data.isManager !== undefined ? data.isManager : true);
    }

    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const data = {
      ageGroup,
      homeTeam,
      awayTeam,
      setupComplete,
      playersConfigured,
      matchStarted,
      currentPeriod,
      periodStartTimestamp,
      events,
      useQuarters,
      periodLength,
      isHome,
      periodStarted,
      showNumbers,
      customPeriods,
      isManager,
    };
    localStorage.setItem('footballMatchData', JSON.stringify(data));
  }, [ageGroup, homeTeam, awayTeam, setupComplete, playersConfigured, matchStarted, currentPeriod, periodStartTimestamp, events, useQuarters, periodLength, isHome, periodStarted, showNumbers, customPeriods, isManager]);

  // Save players to localStorage
  useEffect(() => {
    localStorage.setItem('footballPlayers', JSON.stringify(players));
  }, [players]);

  // Listen for debug mode changes
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('debugMode');
      setDebugMode(saved === 'true');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Timer effect - checks elapsed time every second and auto-ends period
  useEffect(() => {
    if (currentPeriod && periodStartTimestamp) {
      timerRef.current = setInterval(() => {
        const elapsedSeconds = getElapsedSeconds(periodStartTimestamp);
        const periodLengthInSeconds = periodLength * 60;

        // Auto-end period when time is up
        if (elapsedSeconds >= periodLengthInSeconds) {
          clearInterval(timerRef.current);
          handleEndPeriod();
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentPeriod, periodStartTimestamp, periodLength]);

  // Get selected age group
  const selectedAgeGroup = AGE_GROUPS.find(ag => ag.value === ageGroup);

  // Setup handlers
  const handleSetupComplete = () => {
    if (!homeTeam || !awayTeam) {
      alert('Please enter both team names before continuing.');
      return;
    }

    // If Referee mode, skip player setup and go straight to match
    if (!isManager) {
      setSetupComplete(true);
      setPlayersConfigured(true);
      setMatchStarted(true);
      return;
    }

    // Manager mode: Initialize players if not already done
    if (players.length === 0 && selectedAgeGroup) {
      const defaultPlayers = [];
      for (let i = 1; i <= selectedAgeGroup.defaultPlayerCount; i++) {
        defaultPlayers.push({ number: i, name: '', isSub: false });
      }
      setPlayers(defaultPlayers);
    }

    setSetupComplete(true);
  };

  const handlePlayersComplete = () => {
    setPlayersConfigured(true);
    setMatchStarted(true);
  };

  const handleBackToSetup = () => {
    setSetupComplete(false);
  };

  // Period handlers
  const handleStartPeriod = (period) => {
    const startTime = Date.now();
    setCurrentPeriod(period);
    setPeriodStartTimestamp(startTime);
    setPeriodStarted(true);

    let previousMinutes = 0;
    if (period === 'Q2') previousMinutes = periodLength;
    else if (period === 'Q3') previousMinutes = periodLength * 2;
    else if (period === 'Q4') previousMinutes = periodLength * 3;
    else if (period === 'H2') previousMinutes = periodLength;

    const cumulativeStartTime = previousMinutes * 60;

    const periodEvent = {
      id: Date.now() + Math.random(),
      type: 'period_start',
      period: period,
      timestamp: getCurrentTimestamp(),
      timerValue: formatTime(cumulativeStartTime),
      description: `${period} Start`,
    };
    setEvents((prevEvents) => [...prevEvents, periodEvent]);
  };

  const handleEndPeriod = () => {
    let previousMinutes = 0;
    if (currentPeriod === 'Q2') previousMinutes = periodLength;
    else if (currentPeriod === 'Q3') previousMinutes = periodLength * 2;
    else if (currentPeriod === 'Q4') previousMinutes = periodLength * 3;
    else if (currentPeriod === 'H2') previousMinutes = periodLength;

    const cumulativeEndTime = (previousMinutes * 60) + (periodLength * 60);

    const periodEndEvent = {
      id: Date.now() + Math.random(),
      type: 'period_end',
      period: currentPeriod,
      timestamp: getCurrentTimestamp(),
      timerValue: formatTime(cumulativeEndTime),
      description: `${currentPeriod} End`,
    };

    setEvents((prevEvents) => {
      const alreadyExists = prevEvents.some(
        e => e.type === 'period_end' && e.period === currentPeriod
      );
      if (alreadyExists) {
        return prevEvents;
      }
      return [...prevEvents, periodEndEvent];
    });

    const periods = getPeriods(useQuarters, customPeriods);
    const currentIndex = periods.indexOf(currentPeriod);
    if (currentIndex < periods.length - 1) {
      setCurrentPeriod(null);
      setPeriodStartTimestamp(null);
    } else {
      const matchEndEvent = {
        id: Date.now() + Math.random(),
        type: 'match_end',
        timestamp: getCurrentTimestamp(),
        timerValue: formatTime(cumulativeEndTime),
        description: 'Match End',
      };
      setEvents((prevEvents) => {
        const matchEndExists = prevEvents.some(e => e.type === 'match_end');
        if (matchEndExists) {
          return prevEvents;
        }
        return [...prevEvents, matchEndEvent];
      });
      setCurrentPeriod(null);
      setPeriodStartTimestamp(null);
    }
  };

  const handleEndPeriodClick = () => {
    setShowEndPeriodConfirm(true);
  };

  const confirmEndPeriod = () => {
    handleEndPeriod();
    setShowEndPeriodConfirm(false);
  };

  const cancelEndPeriod = () => {
    setShowEndPeriodConfirm(false);
  };

  // Goal handlers
  const handleRecordGoal = (team, targetPeriod = null, scorerInfo = null) => {
    const periodToUse = targetPeriod || currentPeriod;

    let previousMinutes = 0;
    if (periodToUse === 'Q2') previousMinutes = periodLength;
    else if (periodToUse === 'Q3') previousMinutes = periodLength * 2;
    else if (periodToUse === 'Q4') previousMinutes = periodLength * 3;
    else if (periodToUse === 'H2') previousMinutes = periodLength;

    // Calculate elapsed time from real-time timestamp
    const elapsedSeconds = periodStartTimestamp ? getElapsedSeconds(periodStartTimestamp) : 0;
    const cumulativeTime = (previousMinutes * 60) + elapsedSeconds;

    const goalEvent = {
      id: Date.now() + Math.random(),
      type: 'goal',
      team: team,
      period: periodToUse,
      timestamp: getCurrentTimestamp(),
      timerValue: formatTime(cumulativeTime),
      description: `Goal - ${team}`,
      playerNumber: scorerInfo?.playerNumber || null,
      playerName: scorerInfo?.playerName || null,
      isPenalty: scorerInfo?.isPenalty || false,
    };

    const periodEndIndex = events.findIndex(
      e => e.type === 'period_end' && e.period === periodToUse
    );

    if (periodEndIndex !== -1) {
      let previousMinutesForMissed = 0;
      if (periodToUse === 'Q2') previousMinutesForMissed = periodLength;
      else if (periodToUse === 'Q3') previousMinutesForMissed = periodLength * 2;
      else if (periodToUse === 'Q4') previousMinutesForMissed = periodLength * 3;
      else if (periodToUse === 'H2') previousMinutesForMissed = periodLength;

      const cumulativeEndTime = (previousMinutesForMissed * 60) + (periodLength * 60);
      goalEvent.timerValue = formatTime(cumulativeEndTime);

      const periodStartEvent = events.find(
        e => e.type === 'period_start' && e.period === periodToUse
      );

      if (periodStartEvent) {
        const startTimeParts = periodStartEvent.timestamp.split(':');
        const startHours = parseInt(startTimeParts[0]);
        const startMinutes = parseInt(startTimeParts[1]);
        const startSeconds = parseInt(startTimeParts[2]);
        const startTotalSeconds = (startHours * 3600) + (startMinutes * 60) + startSeconds;

        const endTotalSeconds = startTotalSeconds + (periodLength * 60);
        const endHours = Math.floor(endTotalSeconds / 3600) % 24;
        const endMinutes = Math.floor((endTotalSeconds % 3600) / 60);
        const endSeconds = endTotalSeconds % 60;

        goalEvent.timestamp = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:${endSeconds.toString().padStart(2, '0')}`;
      }

      const newEvents = [...events];
      newEvents.splice(periodEndIndex, 0, goalEvent);
      setEvents(newEvents);
    } else {
      setEvents((prevEvents) => [...prevEvents, goalEvent]);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setEditForm({ ...event, isPenalty: event.isPenalty || false });
  };

  const handleSaveEdit = () => {
    const editedEventData = { ...editForm };
    const originalEvent = events.find(e => e.id === editingEventId);

    if (originalEvent && editedEventData.timerValue !== originalEvent.timerValue) {
      const periodStartEvent = events.find(
        e => e.type === 'period_start' && e.period === editedEventData.period
      );

      if (periodStartEvent) {
        const startTimeParts = periodStartEvent.timestamp.split(':');
        const startHours = parseInt(startTimeParts[0]);
        const startMinutes = parseInt(startTimeParts[1]);
        const startSeconds = parseInt(startTimeParts[2]);
        const startTotalSeconds = (startHours * 3600) + (startMinutes * 60) + startSeconds;

        const timerParts = editedEventData.timerValue.split(':');
        const timerMinutes = parseInt(timerParts[0]) || 0;
        const timerSeconds = parseInt(timerParts[1]) || 0;
        const elapsedSeconds = (timerMinutes * 60) + timerSeconds;

        const newTotalSeconds = startTotalSeconds + elapsedSeconds;
        const newHours = Math.floor(newTotalSeconds / 3600) % 24;
        const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
        const newSeconds = newTotalSeconds % 60;

        editedEventData.timestamp = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
      }
    }

    setEvents(prevEvents => {
      const newEvents = prevEvents.map((event) => {
        if (event.id === editingEventId) {
          return {
            id: editedEventData.id,
            type: editedEventData.type,
            team: editedEventData.team,
            period: editedEventData.period,
            timestamp: editedEventData.timestamp,
            timerValue: editedEventData.timerValue,
            description: editedEventData.description,
            playerNumber: editedEventData.playerNumber,
            playerName: editedEventData.playerName,
            isPenalty: editedEventData.isPenalty === true,
          };
        }
        return event;
      });
      return newEvents;
    });

    setRefreshKey(prev => prev + 1);
    setEditingEventId(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setEditForm({});
  };

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete));
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  // Missed goal handlers
  const handleMissedGoalClick = (team, period) => {
    setMissedGoalTeam(team);
    setMissedGoalPeriod(period);
    setShowMissedGoalConfirm(true);
  };

  const confirmMissedGoal = () => {
    handleRecordGoal(missedGoalTeam, missedGoalPeriod);
    setShowMissedGoalConfirm(false);
    setMissedGoalTeam(null);
    setMissedGoalPeriod(null);
  };

  const cancelMissedGoal = () => {
    setShowMissedGoalConfirm(false);
    setMissedGoalTeam(null);
    setMissedGoalPeriod(null);
  };

  // Goal scorer modal handlers
  const handleGoalClick = (team) => {
    const userTeam = isHome ? homeTeam : awayTeam;

    // If Referee mode, always record directly without showing modal
    if (!isManager) {
      handleRecordGoal(team);
      return;
    }

    // Manager mode: If it's the user's team, show scorer selection modal
    if (team === userTeam) {
      setPendingGoalTeam(team);
      setPendingGoalPeriod(currentPeriod);
      setShowGoalScorerModal(true);
    } else {
      // Opposition goal - record directly
      handleRecordGoal(team);
    }
  };

  const handleGoalScorerSelect = (scorerInfo) => {
    if (scorerInfo) {
      // Record goal with scorer info
      handleRecordGoal(pendingGoalTeam, pendingGoalPeriod, scorerInfo);
    } else {
      // No scorer selected - record without scorer
      handleRecordGoal(pendingGoalTeam, pendingGoalPeriod, null);
    }

    // Close modal and reset state
    setShowGoalScorerModal(false);
    setPendingGoalTeam(null);
    setPendingGoalPeriod(null);
  };

  const handleCloseGoalScorerModal = () => {
    setShowGoalScorerModal(false);
    setPendingGoalTeam(null);
    setPendingGoalPeriod(null);
  };

  // Export handler
  const handleExport = () => {
    const homeGoals = events.filter(e => e.type === 'goal' && e.team === homeTeam);
    const awayGoals = events.filter(e => e.type === 'goal' && e.team === awayTeam);

    let exportText = `${homeTeam} ${homeGoals.length}–${awayGoals.length} ${awayTeam}\n\n`;

    // Helper function to convert timerValue (MM:SS) to seconds
    const timeToSeconds = (timerValue) => {
      const parts = timerValue.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    };

    // Get match end time (in seconds)
    const matchEndEvent = events.find(e => e.type === 'match_end');
    const matchEndSeconds = matchEndEvent ? timeToSeconds(matchEndEvent.timerValue) :
      (events.filter(e => e.type === 'period_end').length * periodLength * 60);

    // Determine if player started match based on substitution events
    const didPlayerStart = (playerNumber) => {
      const subEvents = events
        .filter(e => e.type === 'substitution' && e.playerNumber === playerNumber)
        .sort((a, b) => timeToSeconds(a.timerValue) - timeToSeconds(b.timerValue));

      if (subEvents.length === 0) {
        // No sub events - assume they started if they have any events
        return true;
      }

      // If first event is SUB OFF, they started on the pitch
      return subEvents[0].subType === 'off';
    };

    // Calculate time on pitch for each player
    const calculatePlayerMinutes = (playerNumber) => {
      const player = players.find(p => p.number === playerNumber);
      if (!player) return 0;

      // Get all substitution events for this player
      const subEvents = events
        .filter(e => e.type === 'substitution' && e.playerNumber === playerNumber)
        .sort((a, b) => timeToSeconds(a.timerValue) - timeToSeconds(b.timerValue));

      let totalSeconds = 0;
      let currentlyOn = didPlayerStart(playerNumber); // Check if player started
      let onTime = 0;

      if (currentlyOn) {
        onTime = 0; // Started at match start
      }

      // Process each substitution event
      subEvents.forEach(event => {
        const eventTime = timeToSeconds(event.timerValue);

        if (event.subType === 'on') {
          currentlyOn = true;
          onTime = eventTime;
        } else if (event.subType === 'off') {
          if (currentlyOn) {
            totalSeconds += eventTime - onTime;
            currentlyOn = false;
          }
        }
      });

      // If still on at match end, add remaining time
      if (currentlyOn) {
        totalSeconds += matchEndSeconds - onTime;
      }

      return Math.round(totalSeconds / 60); // Convert to minutes
    };

    // Determine initial starting lineup and substitutes based on substitution events
    const determineInitialStatus = (playerNumber) => {
      const playerSubEvents = events
        .filter(e => e.type === 'substitution' && e.playerNumber === playerNumber)
        .sort((a, b) => timeToSeconds(a.timerValue) - timeToSeconds(b.timerValue));

      if (playerSubEvents.length === 0) {
        // No substitution events - check if they have playing time
        const minutes = calculatePlayerMinutes(playerNumber);
        return minutes > 0 ? 'starting' : 'unused';
      }

      // Check first substitution event
      const firstEvent = playerSubEvents[0];
      if (firstEvent.subType === 'off') {
        return 'starting'; // Was on pitch to be subbed off
      } else {
        return 'substitute'; // First event was coming on
      }
    };

    // Get goals for a specific player
    const getPlayerGoals = (playerNumber) => {
      const userTeam = isHome ? homeTeam : awayTeam;
      return events.filter(e =>
        e.type === 'goal' &&
        e.team === userTeam &&
        e.playerNumber === playerNumber
      );
    };

    // Format goal stats for a player
    const formatPlayerGoalStats = (playerNumber) => {
      const playerGoals = getPlayerGoals(playerNumber);
      if (playerGoals.length === 0) return '';

      const goalMinutes = playerGoals.map(g => {
        const minute = calculateMatchMinute(g.timerValue, g.period, periodLength);
        return g.isPenalty ? `${minute}'(pen)` : `${minute}'`;
      });

      const goalCount = playerGoals.length;
      const goalText = goalCount === 1 ? 'goal' : 'goals';
      return ` (${goalCount} ${goalText} @ ${goalMinutes.join(', ')})`;
    };

    // Separate players by their initial status
    const startingPlayers = [];
    const substitutePlayers = [];

    players.forEach(player => {
      const status = determineInitialStatus(player.number);
      if (status === 'starting') {
        startingPlayers.push(player);
      } else if (status === 'substitute' || status === 'unused') {
        substitutePlayers.push(player);
      }
    });

    // Add Starting Lineup (Manager mode only)
    if (isManager && startingPlayers.length > 0) {
      exportText += 'Starting Lineup:\n';
      startingPlayers.forEach(player => {
        const minutes = calculatePlayerMinutes(player.number);
        const playerName = player.name || `Player ${player.number}`;
        const numberPrefix = showNumbers && player.number ? `#${player.number} ` : '';
        const goalStats = formatPlayerGoalStats(player.number);

        if (minutes > 0) {
          exportText += `${numberPrefix}${playerName} (played ${minutes}')${goalStats}\n`;
        } else {
          exportText += `${numberPrefix}${playerName}${goalStats}\n`;
        }
      });
      exportText += '\n';
    }

    // Add Substitutes (Manager mode only)
    if (isManager && substitutePlayers.length > 0) {
      exportText += 'Substitutes:\n';
      substitutePlayers.forEach(player => {
        const minutes = calculatePlayerMinutes(player.number);
        const playerName = player.name || `Player ${player.number}`;
        const numberPrefix = showNumbers && player.number ? `#${player.number} ` : '';
        const goalStats = formatPlayerGoalStats(player.number);

        if (minutes > 0) {
          exportText += `${numberPrefix}${playerName} (played ${minutes}')${goalStats}\n`;
        } else {
          exportText += `${numberPrefix}${playerName}${goalStats}\n`;
        }
      });
      exportText += '\n';
    }

    // Add Match Events
    events.forEach(event => {
      if (event.type === 'period_start' || event.type === 'period_end') {
        exportText += `${event.description} - ${event.timestamp} [${event.timerValue}]\n`;
      } else if (event.type === 'goal') {
        let goalLine = `${event.description}`;

        // Show player name if available (look up from players array if needed)
        if (event.playerNumber) {
          let playerName = event.playerName;

          // If playerName is missing but we have playerNumber, look it up
          if (!playerName) {
            const player = players.find(p => p.number === event.playerNumber);
            playerName = player ? (player.name || `Player ${player.number}`) : null;
          }

          if (playerName) {
            goalLine += ` (${showNumbers && event.playerNumber ? `#${event.playerNumber} ` : ''}${playerName})`;
          }
        }

        if (event.isPenalty) {
          goalLine += ` (Penalty)`;
        }
        goalLine += ` - ${event.timestamp} [${event.timerValue}]`;
        exportText += goalLine + '\n';
      } else if (event.type === 'substitution') {
        exportText += `${event.description} - ${event.timestamp} [${event.timerValue}]\n`;
      } else if (event.type === 'match_end') {
        exportText += `${event.description} - ${event.timestamp} [${event.timerValue}]\n`;
      }
    });

    navigator.clipboard.writeText(exportText).then(() => {
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 3000);
    }).catch(() => {
      alert('Failed to copy to clipboard. Please try again.');
    });
  };

  // AI Report handler
  const handleGenerateAIReport = async () => {
    // Generate match data first (reuse export logic)
    const homeGoals = events.filter(e => e.type === 'goal' && e.team === homeTeam);
    const awayGoals = events.filter(e => e.type === 'goal' && e.team === awayTeam);

    let exportText = `${homeTeam} ${homeGoals.length}–${awayGoals.length} ${awayTeam}\n\n`;

    // Helper function to convert timerValue (MM:SS) to seconds
    const timeToSeconds = (timerValue) => {
      const parts = timerValue.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    };

    // Get match end time (in seconds)
    const matchEndEvent = events.find(e => e.type === 'match_end');
    const matchEndSeconds = matchEndEvent ? timeToSeconds(matchEndEvent.timerValue) :
      (events.filter(e => e.type === 'period_end').length * periodLength * 60);

    // Similar logic to export (abbreviated for AI input)
    events.forEach(event => {
      if (event.type === 'period_start' || event.type === 'period_end') {
        exportText += `${event.description} - ${event.timestamp} [${event.timerValue}]\n`;
      } else if (event.type === 'goal') {
        let goalLine = `${event.description}`;
        if (event.playerNumber) {
          let playerName = event.playerName;
          if (!playerName) {
            const player = players.find(p => p.number === event.playerNumber);
            playerName = player ? (player.name || `Player ${player.number}`) : null;
          }
          if (playerName) {
            goalLine += ` (${showNumbers && event.playerNumber ? `#${event.playerNumber} ` : ''}${playerName})`;
          }
        }
        if (event.isPenalty) {
          goalLine += ` (Penalty)`;
        }
        goalLine += ` - ${event.timestamp} [${event.timerValue}]`;
        exportText += goalLine + '\n';
      } else if (event.type === 'substitution') {
        exportText += `${event.description} - ${event.timestamp} [${event.timerValue}]\n`;
      } else if (event.type === 'match_end') {
        exportText += `${event.description} - ${event.timestamp} [${event.timerValue}]\n`;
      }
    });

    // Call AI API
    setIsGeneratingAI(true);
    setAIError(null);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchData: exportText
        })
      });

      // Capture full response for debugging
      const responseText = await response.text();
      let errorData = null;

      if (!response.ok) {
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          // Response wasn't JSON
          errorData = { error: 'Non-JSON response', response: responseText };
        }

        const errorMessage = `API Error (${response.status}): ${errorData.error || 'Unknown error'}` +
          (errorData.details ? `\nDetails: ${errorData.details}` : '') +
          (errorData.message ? `\nMessage: ${errorData.message}` : '');

        throw new Error(errorMessage);
      }

      // Parse successful response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse response: ${responseText}`);
      }

      const report = data.report;

      if (!report) {
        throw new Error(`No report in response. Full response: ${responseText}`);
      }

      // Copy report to clipboard
      await navigator.clipboard.writeText(report);

      setShowAICopied(true);
      setTimeout(() => {
        setShowAICopied(false);
      }, 3000);

    } catch (error) {
      console.error('Error generating AI report:', error);

      // Copy error details to clipboard for debugging
      const errorDetails = `AI Report Generation Error\n\n` +
        `Error: ${error.message || 'Unknown error'}\n` +
        `Stack: ${error.stack || 'No stack trace'}\n` +
        `Time: ${new Date().toISOString()}\n\n` +
        `Match Data Sent:\n${exportText}`;

      navigator.clipboard.writeText(errorDetails).catch(() => {
        // If clipboard fails, at least show the error
        console.error('Failed to copy error to clipboard');
      });

      setAIError(error.message || 'Failed to generate AI report');
      setShowAICopied(true); // Show "Copied!" to indicate error was copied
      setTimeout(() => {
        setAIError(null);
        setShowAICopied(false);
      }, 5000);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Substitution handlers
  const handleOpenSubstitutions = () => {
    setShowSubstitutionModal(true);
  };

  const handleCloseSubstitutions = () => {
    setShowSubstitutionModal(false);
  };

  const handleCompleteSubstitutions = (updatedPlayers, changes) => {
    // Update player statuses
    setPlayers(updatedPlayers);

    // Calculate cumulative time for substitution event
    let cumulativeTime = 0;
    let periodForSub = currentPeriod;

    if (currentPeriod && periodStartTimestamp) {
      // During a period - calculate cumulative time from real-time
      let previousMinutes = 0;
      if (currentPeriod === 'Q2') previousMinutes = periodLength;
      else if (currentPeriod === 'Q3') previousMinutes = periodLength * 2;
      else if (currentPeriod === 'Q4') previousMinutes = periodLength * 3;
      else if (currentPeriod === 'H2') previousMinutes = periodLength;
      else if (currentPeriod === 'P1') previousMinutes = 0;

      const elapsedSeconds = getElapsedSeconds(periodStartTimestamp);
      cumulativeTime = (previousMinutes * 60) + elapsedSeconds;
    } else {
      // Between periods - find the last completed period and use its end time
      const completedPeriods = events.filter(e => e.type === 'period_end');
      if (completedPeriods.length > 0) {
        const lastPeriodEnd = completedPeriods[completedPeriods.length - 1];
        periodForSub = lastPeriodEnd.period;

        // Parse the timerValue from the period end event
        const timerParts = lastPeriodEnd.timerValue.split(':');
        cumulativeTime = (parseInt(timerParts[0]) * 60) + parseInt(timerParts[1]);
      }
    }

    // Create substitution events
    changes.forEach((change) => {
      const substitutionEvent = {
        id: Date.now() + Math.random(), // Ensure unique IDs
        type: 'substitution',
        period: periodForSub,
        timestamp: getCurrentTimestamp(),
        timerValue: formatTime(cumulativeTime),
        description: change.from === 'starting'
          ? `SUB OFF: ${showNumbers && change.player.number ? `#${change.player.number} ` : ''}${change.player.name || `Player ${change.player.number}`}`
          : `SUB ON: ${showNumbers && change.player.number ? `#${change.player.number} ` : ''}${change.player.name || `Player ${change.player.number}`}`,
        playerNumber: change.player.number,
        playerName: change.player.name,
        subType: change.from === 'starting' ? 'off' : 'on'
      };

      setEvents((prevEvents) => [...prevEvents, substitutionEvent]);
    });

    setShowSubstitutionModal(false);
  };

  // Reset handler
  const handleResetMatch = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    const savedSettings = {
      ageGroup,
      homeTeam,
      awayTeam,
      useQuarters,
      periodLength,
      isHome,
      showNumbers,
      customPeriods,
      isManager,
    };

    setSetupComplete(false);
    setPlayersConfigured(false);
    setMatchStarted(false);
    setCurrentPeriod(null);
    setPeriodStartTimestamp(null);
    setEvents([]);
    setPeriodStarted(false);

    localStorage.setItem('footballMatchData', JSON.stringify({
      ...savedSettings,
      setupComplete: false,
      playersConfigured: false,
      matchStarted: false,
      currentPeriod: null,
      periodStartTimestamp: null,
      events: [],
      periodStarted: false,
    }));

    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  // User agreement handler
  const handleAcceptUserAgreement = () => {
    localStorage.setItem('userAgreementAccepted', 'true');
    setShowUserAgreement(false);
  };

  // Helper to get next period
  const getNextPeriod = () => {
    const periods = getPeriods(useQuarters, customPeriods);
    const completedPeriods = events
      .filter(e => e.type === 'period_end')
      .map(e => e.period);

    for (let period of periods) {
      if (!completedPeriods.includes(period)) {
        return period;
      }
    }
    return null;
  };

  const nextPeriod = getNextPeriod();
  const homeGoals = events.filter(e => e.type === 'goal' && e.team === homeTeam);
  const awayGoals = events.filter(e => e.type === 'goal' && e.team === awayTeam);

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        {/* Header with About button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
            Football Match Tracker
          </h1>
          <button
            onClick={() => setShowAbout(true)}
            className="text-gray-400 hover:text-orange-500 transition duration-200"
            title="About"
          >
            <Info size={24} />
          </button>
        </div>

        {/* Match Setup Screen */}
        {!setupComplete && (
          <MatchSetup
            isManager={isManager}
            setIsManager={setIsManager}
            isHome={isHome}
            setIsHome={setIsHome}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            homeTeam={homeTeam}
            setHomeTeam={setHomeTeam}
            awayTeam={awayTeam}
            setAwayTeam={setAwayTeam}
            useQuarters={useQuarters}
            setUseQuarters={setUseQuarters}
            periodLength={periodLength}
            setPeriodLength={setPeriodLength}
            customPeriods={customPeriods}
            setCustomPeriods={setCustomPeriods}
            onSetupComplete={handleSetupComplete}
          />
        )}

        {/* Player Setup Screen */}
        {setupComplete && !playersConfigured && (
          <PlayerSetup
            teamName={isHome ? homeTeam : awayTeam}
            players={players}
            setPlayers={setPlayers}
            showNumbers={showNumbers}
            setShowNumbers={setShowNumbers}
            ageGroup={ageGroup}
            onPlayersComplete={handlePlayersComplete}
            onBack={handleBackToSetup}
          />
        )}

        {/* Match Tracker Screen */}
        {matchStarted && (
          <>
            {/* Match Summary */}
            <div className="bg-gray-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6" key={`summary-${refreshKey}`}>
              <div className="text-center">
                <div className="flex justify-center items-center mb-2">
                  <span className="text-sm sm:text-lg font-bold text-gray-100 text-right flex-1 truncate">{homeTeam}</span>
                  <span className="text-base sm:text-lg font-bold text-orange-500 px-2 whitespace-nowrap">{homeGoals.length}–{awayGoals.length}</span>
                  <span className="text-sm sm:text-lg font-bold text-gray-100 text-left flex-1 truncate">{awayTeam}</span>
                </div>
                <div className="flex justify-center items-start font-mono text-xs sm:text-sm text-gray-400">
                  <span className="text-right flex-1">
                    {homeGoals.length > 0 && `(${homeGoals.map(g => {
                      const minute = calculateMatchMinute(g.timerValue, g.period, periodLength);
                      return g.isPenalty ? `${minute}'(pen)` : `${minute}'`;
                    }).join(', ')})`}
                  </span>
                  <span className="px-4" style={{minWidth: '60px'}}></span>
                  <span className="text-left flex-1">
                    {awayGoals.length > 0 && `(${awayGoals.map(g => {
                      const minute = calculateMatchMinute(g.timerValue, g.period, periodLength);
                      return g.isPenalty ? `${minute}'(pen)` : `${minute}'`;
                    }).join(', ')})`}
                  </span>
                </div>
              </div>
            </div>

            {/* Timer Component */}
            {currentPeriod && periodStartTimestamp && (
              <Timer
                currentPeriod={currentPeriod}
                periodLength={periodLength}
                periodStartTimestamp={periodStartTimestamp}
                onEndPeriod={handleEndPeriodClick}
              />
            )}

            {/* Start Next Period */}
            {!currentPeriod && nextPeriod && (
              <div className="mb-6">
                <button
                  onClick={() => handleStartPeriod(nextPeriod)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Start {nextPeriod}
                </button>

                {events.some(e => e.type === 'period_end') && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-400 mb-3 text-center">
                      Add missed goal from previous period:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          const completedPeriods = events
                            .filter(e => e.type === 'period_end')
                            .map(e => e.period);
                          const lastPeriod = completedPeriods[completedPeriods.length - 1];
                          handleMissedGoalClick(homeTeam, lastPeriod);
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Goal {homeTeam}
                      </button>
                      <button
                        onClick={() => {
                          const completedPeriods = events
                            .filter(e => e.type === 'period_end')
                            .map(e => e.period);
                          const lastPeriod = completedPeriods[completedPeriods.length - 1];
                          handleMissedGoalClick(awayTeam, lastPeriod);
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Goal {awayTeam}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Full Time Banner */}
            {!currentPeriod && !nextPeriod && events.some(e => e.type === 'match_end') && (
              <div className="mb-6">
                <div className="bg-orange-600 text-white font-bold text-2xl py-6 px-6 rounded-lg text-center mb-6">
                  FULL TIME
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-3 text-center">
                    Add missed goal from previous period:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const completedPeriods = events
                          .filter(e => e.type === 'period_end')
                          .map(e => e.period);
                        const lastPeriod = completedPeriods[completedPeriods.length - 1];
                        handleMissedGoalClick(homeTeam, lastPeriod);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Goal {homeTeam}
                    </button>
                    <button
                      onClick={() => {
                        const completedPeriods = events
                          .filter(e => e.type === 'period_end')
                          .map(e => e.period);
                        const lastPeriod = completedPeriods[completedPeriods.length - 1];
                        handleMissedGoalClick(awayTeam, lastPeriod);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Goal {awayTeam}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Goal Buttons */}
            {periodStarted && currentPeriod && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => handleGoalClick(homeTeam)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Goal {homeTeam}
                </button>
                <button
                  onClick={() => handleGoalClick(awayTeam)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Goal {awayTeam}
                </button>
              </div>
            )}

            {/* Substitution Button - Available after first period starts until match ends (Manager mode only) */}
            {isManager && matchStarted && !events.some(e => e.type === 'match_end') && (
              <div className="mb-6">
                <button
                  onClick={handleOpenSubstitutions}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  Substitutes
                </button>
              </div>
            )}

            {/* Match Events */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-orange-500 mb-4">Match Events</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No events recorded yet</p>
                )}

                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-700 p-3 rounded-lg flex items-center justify-between"
                  >
                    {editingEventId === event.id ? (
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2 items-center">
                          <span className="font-medium text-gray-100 flex-1">{editForm.description}</span>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                          <label className="text-sm text-gray-400 whitespace-nowrap">Elapsed Time:</label>
                          <input
                            type="text"
                            value={editForm.timerValue}
                            onChange={(e) =>
                              setEditForm({ ...editForm, timerValue: e.target.value })
                            }
                            placeholder="MM:SS"
                            pattern="[0-9]{2}:[0-9]{2}"
                            className="w-24 p-2 bg-gray-600 border border-gray-500 text-gray-100 rounded"
                          />
                          {event.type === 'goal' && (
                            <>
                              <label className="text-sm text-gray-400 whitespace-nowrap">Player:</label>
                              <select
                                value={editForm.playerNumber || ''}
                                onChange={(e) => {
                                  const selectedPlayer = players.find(p => p.number === parseInt(e.target.value));
                                  setEditForm({
                                    ...editForm,
                                    playerNumber: selectedPlayer ? selectedPlayer.number : null,
                                    playerName: selectedPlayer ? selectedPlayer.name : null
                                  });
                                }}
                                className="p-2 bg-gray-600 border border-gray-500 text-gray-100 rounded"
                              >
                                <option value="">None</option>
                                {players.map((player) => (
                                  <option key={player.number} value={player.number}>
                                    {showNumbers ? `#${player.number} ` : ''}{player.name || `Player ${player.number}`}
                                  </option>
                                ))}
                              </select>
                              <label className="text-sm text-gray-400 whitespace-nowrap flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={editForm.isPenalty === true}
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, isPenalty: e.target.checked });
                                  }}
                                  className="w-4 h-4"
                                />
                                Penalty
                              </label>
                            </>
                          )}
                          <button
                            onClick={handleSaveEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="font-medium text-gray-100">
                            {event.type === 'goal' && event.playerName ? (
                              <>
                                {event.description} - {showNumbers && event.playerNumber ? `#${event.playerNumber} ` : ''}{event.playerName}
                                {event.isPenalty && (
                                  <span className="text-yellow-400 ml-2">(Penalty)</span>
                                )}
                              </>
                            ) : (
                              <>
                                {event.description}
                                {event.type === 'goal' && event.isPenalty && (
                                  <span className="text-yellow-400 ml-2">(Penalty)</span>
                                )}
                              </>
                            )}
                          </p>
                          <p className="text-sm text-gray-400">
                            {event.timestamp} [{event.timerValue}]
                          </p>
                        </div>
                        {event.type === 'goal' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* AI Report Button (Debug Mode Only) */}
              {debugMode && (
                <button
                  onClick={handleGenerateAIReport}
                  disabled={!events.some(e => e.type === 'match_end') || isGeneratingAI}
                  className={`w-full font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                    !events.some(e => e.type === 'match_end') || isGeneratingAI
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Sparkles size={20} />
                  {isGeneratingAI
                    ? 'Generating AI Report...'
                    : showAICopied
                    ? 'AI Report Copied!'
                    : aiError
                    ? `Error: ${aiError}`
                    : 'AI Report to Clipboard'}
                </button>
              )}

              {/* Regular Export and Reset Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  {showCopied ? 'Copied!' : 'Match Data to Clipboard'}
                </button>
                <button
                  onClick={handleResetMatch}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Reset Match
                </button>
              </div>
            </div>
          </>
        )}

        {/* Modals */}
        <Modal
          isOpen={showResetConfirm}
          title="Reset Match?"
          message="Are you sure you want to reset the match? All match data will be cleared. Your player squad list will be preserved."
          confirmText="Reset"
          cancelText="Cancel"
          confirmStyle="danger"
          onConfirm={confirmReset}
          onCancel={cancelReset}
        />

        <Modal
          isOpen={showDeleteConfirm}
          title="Delete Event?"
          message="Are you sure you want to delete this event?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmStyle="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />

        <Modal
          isOpen={showMissedGoalConfirm}
          title="Add Missed Goal?"
          message={
            <>
              Add a goal for <strong className="text-orange-500">{missedGoalTeam}</strong> to {missedGoalPeriod}?
              <br />
              <span className="text-sm text-gray-400">
                (Will be recorded at end of period)
              </span>
            </>
          }
          confirmText="Add Goal"
          cancelText="Cancel"
          confirmStyle="warning"
          onConfirm={confirmMissedGoal}
          onCancel={cancelMissedGoal}
        />

        <Modal
          isOpen={showEndPeriodConfirm}
          title={`End ${currentPeriod}?`}
          message={`Are you sure you want to end ${currentPeriod}?`}
          confirmText="End Period"
          cancelText="Cancel"
          confirmStyle="danger"
          onConfirm={confirmEndPeriod}
          onCancel={cancelEndPeriod}
        />

        <SubstitutionModal
          isOpen={showSubstitutionModal}
          players={players}
          showNumbers={showNumbers}
          ageGroup={ageGroup}
          homeGoals={homeGoals.length}
          awayGoals={awayGoals.length}
          onClose={handleCloseSubstitutions}
          onComplete={handleCompleteSubstitutions}
        />

        {/* Goal Scorer Modal */}
        <GoalScorerModal
          isOpen={showGoalScorerModal}
          players={players}
          showNumbers={showNumbers}
          onClose={handleCloseGoalScorerModal}
          onSelectScorer={handleGoalScorerSelect}
        />

        {/* About Modal */}
        <AboutModal
          isOpen={showAbout}
          onClose={() => setShowAbout(false)}
        />

        {/* User Agreement Modal - First Run */}
        <UserAgreementModal
          isOpen={showUserAgreement}
          onAccept={handleAcceptUserAgreement}
        />
      </div>
    </div>
  );
};

export default MatchTracker;
