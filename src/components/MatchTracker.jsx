// Date: 2025-10-05
// Football Match Tracker for Association Football (Soccer)
// Supports U7 to U18 age groups with quarters for younger ages
// Dark mode with Caterham Pumas colours (dark orange and royal blue)

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Download, Edit2, Trash2, Save, X, UserPlus } from 'lucide-react';

const FootballMatchTracker = () => {
  // Age group configuration - determines default quarters/halves and period length
  const ageGroups = [
    { value: 'U7', label: 'U7', defaultQuarters: true, defaultPeriodLength: 10, totalTime: 40, defaultPlayerCount: 5 },
    { value: 'U8', label: 'U8', defaultQuarters: true, defaultPeriodLength: 10, totalTime: 40, defaultPlayerCount: 5 },
    { value: 'U9', label: 'U9', defaultQuarters: true, defaultPeriodLength: 12.5, totalTime: 50, defaultPlayerCount: 7 },
    { value: 'U10', label: 'U10', defaultQuarters: true, defaultPeriodLength: 12.5, totalTime: 50, defaultPlayerCount: 7 },
    { value: 'U11', label: 'U11', defaultQuarters: false, defaultPeriodLength: 30, totalTime: 60, defaultPlayerCount: 9 },
    { value: 'U12', label: 'U12', defaultQuarters: false, defaultPeriodLength: 30, totalTime: 60, defaultPlayerCount: 9 },
    { value: 'U13', label: 'U13', defaultQuarters: false, defaultPeriodLength: 35, totalTime: 70, defaultPlayerCount: 11 },
    { value: 'U14', label: 'U14', defaultQuarters: false, defaultPeriodLength: 35, totalTime: 70, defaultPlayerCount: 11 },
    { value: 'U15', label: 'U15', defaultQuarters: false, defaultPeriodLength: 40, totalTime: 80, defaultPlayerCount: 11 },
    { value: 'U16', label: 'U16', defaultQuarters: false, defaultPeriodLength: 40, totalTime: 80, defaultPlayerCount: 11 },
    { value: 'U17', label: 'U17', defaultQuarters: false, defaultPeriodLength: 45, totalTime: 90, defaultPlayerCount: 11 },
    { value: 'U18', label: 'U18', defaultQuarters: false, defaultPeriodLength: 45, totalTime: 90, defaultPlayerCount: 11 },
    { value: 'Adult', label: 'Adult', defaultQuarters: false, defaultPeriodLength: 45, totalTime: 90, defaultPlayerCount: 11 },
  ];

  // State for missed goal confirmation
  const [showMissedGoalConfirm, setShowMissedGoalConfirm] = useState(false);
  const [missedGoalTeam, setMissedGoalTeam] = useState(null);
  const [missedGoalPeriod, setMissedGoalPeriod] = useState(null);

  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // State for confirmation dialogue
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  // State for player management
  const [players, setPlayers] = useState([]);
  const [showNumbers, setShowNumbers] = useState(true);

  // State for timing
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [periodStarted, setPeriodStarted] = useState(false);
  const timerRef = useRef(null);

  // State for recorded events
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showCopied, setShowCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render key

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
      setElapsedTime(data.elapsedTime || 0);
      setEvents(data.events || []);
      setUseQuarters(data.useQuarters !== undefined ? data.useQuarters : false);
      setPeriodLength(data.periodLength || 30);
      setIsHome(data.isHome !== undefined ? data.isHome : true);
      setPeriodStarted(data.periodStarted || false);
      setShowNumbers(data.showNumbers !== undefined ? data.showNumbers : true);
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
      elapsedTime,
      events,
      useQuarters,
      periodLength,
      isHome,
      periodStarted,
      showNumbers,
    };
    localStorage.setItem('footballMatchData', JSON.stringify(data));
  }, [ageGroup, homeTeam, awayTeam, setupComplete, playersConfigured, matchStarted, currentPeriod, elapsedTime, events, useQuarters, periodLength, isHome, periodStarted, showNumbers]);

  // Save players to localStorage
  useEffect(() => {
    localStorage.setItem('footballPlayers', JSON.stringify(players));
  }, [players]);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          const periodLengthInSeconds = periodLength * 60;
          if (newTime >= periodLengthInSeconds) {
            setIsRunning(false);
            handleEndPeriod();
            return periodLengthInSeconds;
          }
          return newTime;
        });
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
  }, [isRunning, periodLength]);

  // Helper functions
  const calculateMatchMinute = (timerValue, period) => {
    const timeParts = timerValue.split(':');
    const minutes = parseInt(timeParts[0]);
    const seconds = parseInt(timeParts[1]);
    const elapsedSeconds = (minutes * 60) + seconds;
    const periodMinute = elapsedSeconds > 0 ? Math.floor(elapsedSeconds / 60) + 1 : 1;
    
    let previousMinutes = 0;
    if (period === 'Q2') previousMinutes = periodLength;
    else if (period === 'Q3') previousMinutes = periodLength * 2;
    else if (period === 'Q4') previousMinutes = periodLength * 3;
    else if (period === 'H2') previousMinutes = periodLength;
    
    let matchMinute = previousMinutes + periodMinute;
    const maxMinuteForPeriod = previousMinutes + periodLength;
    if (matchMinute > maxMinuteForPeriod) {
      matchMinute = maxMinuteForPeriod;
    }
    return matchMinute;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleToggleHomeAway = (home) => {
    setIsHome(home);
    if (home) {
      setHomeTeam('Caterham Pumas');
      setAwayTeam('Opposition');
    } else {
      setHomeTeam('Opposition');
      setAwayTeam('Caterham Pumas');
    }
  };

  const handleAgeGroupChange = (newAgeGroup) => {
    setAgeGroup(newAgeGroup);
    const selectedGroup = ageGroups.find(ag => ag.value === newAgeGroup);
    if (selectedGroup) {
      setUseQuarters(selectedGroup.defaultQuarters);
      setPeriodLength(selectedGroup.defaultPeriodLength);
    }
  };

  const selectedAgeGroup = ageGroups.find(ag => ag.value === ageGroup);
  
  const getPeriods = () => {
    if (useQuarters) {
      return ['Q1', 'Q2', 'Q3', 'Q4'];
    } else {
      return ['H1', 'H2'];
    }
  };

  // Setup complete - move to player configuration
  const handleSetupComplete = () => {
    if (!homeTeam || !awayTeam) {
      alert('Please enter both team names before continuing.');
      return;
    }
    
    // Initialize players if not already done
    if (players.length === 0 && selectedAgeGroup) {
      const defaultPlayers = [];
      for (let i = 1; i <= selectedAgeGroup.defaultPlayerCount; i++) {
        defaultPlayers.push({ number: i, name: '' });
      }
      setPlayers(defaultPlayers);
    }
    
    setSetupComplete(true);
  };

  // Player management functions
  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handlePlayerNumberChange = (index, number) => {
    const newPlayers = [...players];
    newPlayers[index].number = parseInt(number) || 0;
    setPlayers(newPlayers);
  };

  const handleAddPlayer = () => {
    const newNumber = players.length > 0 ? Math.max(...players.map(p => p.number)) + 1 : 1;
    setPlayers([...players, { number: newNumber, name: '' }]);
  };

  const handleRemovePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handlePlayersComplete = () => {
    setPlayersConfigured(true);
    setMatchStarted(true);
  };

  const handleStartPeriod = (period) => {
    setCurrentPeriod(period);
    setIsRunning(true);
    setElapsedTime(0);
    setPeriodStarted(true);

    let previousMinutes = 0;
    if (period === 'Q2') previousMinutes = periodLength;
    else if (period === 'Q3') previousMinutes = periodLength * 2;
    else if (period === 'Q4') previousMinutes = periodLength * 3;
    else if (period === 'H2') previousMinutes = periodLength;

    const cumulativeStartTime = previousMinutes * 60;

    const periodEvent = {
      id: Date.now(),
      type: 'period_start',
      period: period,
      timestamp: getCurrentTimestamp(),
      timerValue: formatTime(cumulativeStartTime),
      description: `${period} Start`,
    };
    setEvents((prevEvents) => [...prevEvents, periodEvent]);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleEndPeriod = () => {
    setIsRunning(false);

    let previousMinutes = 0;
    if (currentPeriod === 'Q2') previousMinutes = periodLength;
    else if (currentPeriod === 'Q3') previousMinutes = periodLength * 2;
    else if (currentPeriod === 'Q4') previousMinutes = periodLength * 3;
    else if (currentPeriod === 'H2') previousMinutes = periodLength;

    const cumulativeEndTime = (previousMinutes * 60) + (periodLength * 60);

    const periodEndEvent = {
      id: Date.now(),
      type: 'period_end',
      period: currentPeriod,
      timestamp: getCurrentTimestamp(),
      timerValue: formatTime(cumulativeEndTime),
      description: `${currentPeriod} End`,
    };

    // Check if this period end event already exists
    setEvents((prevEvents) => {
      const alreadyExists = prevEvents.some(
        e => e.type === 'period_end' && e.period === currentPeriod
      );
      if (alreadyExists) {
        return prevEvents;
      }
      return [...prevEvents, periodEndEvent];
    });
    
    const periods = getPeriods();
    const currentIndex = periods.indexOf(currentPeriod);
    if (currentIndex < periods.length - 1) {
      setCurrentPeriod(null);
    } else {
      const matchEndEvent = {
        id: Date.now() + 1,
        type: 'match_end',
        timestamp: getCurrentTimestamp(),
        timerValue: formatTime(cumulativeEndTime),
        description: 'Match End',
      };
      setEvents((prevEvents) => [...prevEvents, matchEndEvent]);
      setCurrentPeriod(null);
    }
    
    setElapsedTime(0);
  };

  const handleRecordGoal = (team, targetPeriod = null) => {
    const periodToUse = targetPeriod || currentPeriod;

    let previousMinutes = 0;
    if (periodToUse === 'Q2') previousMinutes = periodLength;
    else if (periodToUse === 'Q3') previousMinutes = periodLength * 2;
    else if (periodToUse === 'Q4') previousMinutes = periodLength * 3;
    else if (periodToUse === 'H2') previousMinutes = periodLength;

    const cumulativeTime = (previousMinutes * 60) + elapsedTime;

    const goalEvent = {
      id: Date.now(),
      type: 'goal',
      team: team,
      period: periodToUse,
      timestamp: getCurrentTimestamp(),
      timerValue: formatTime(cumulativeTime),
      description: `Goal - ${team}`,
      playerNumber: null,
      playerName: null,
      isPenalty: false,
    };
    
    const periodEndIndex = events.findIndex(
      e => e.type === 'period_end' && e.period === periodToUse
    );
    
    if (periodEndIndex !== -1) {
      // Missed goal - record at end of period with cumulative time
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
    // Ensure isPenalty exists on the event, default to false if not present
    setEditForm({ ...event, isPenalty: event.isPenalty || false });
  };

  const handleSaveEdit = () => {
    const editedEventData = { ...editForm }; // Store the edited data
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
    
    // Use functional update to ensure we get the latest state
    setEvents(prevEvents => {
      const newEvents = prevEvents.map((event) => {
        if (event.id === editingEventId) {
          // Return a brand new object with all properties
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
            isPenalty: editedEventData.isPenalty === true, // Ensure it's explicitly true or false
          };
        }
        return event;
      });
      return newEvents;
    });
    
    // Force a re-render
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

  const handleExport = () => {
    const homeGoals = events.filter(e => e.type === 'goal' && e.team === homeTeam);
    const awayGoals = events.filter(e => e.type === 'goal' && e.team === awayTeam);

    let exportText = `${homeTeam} ${homeGoals.length}–${awayGoals.length} ${awayTeam}\n\n`;

    events.forEach(event => {
      if (event.type === 'period_start' || event.type === 'period_end') {
        exportText += `${event.description} - ${event.timestamp} [${event.timerValue}]\n`;
      } else if (event.type === 'goal') {
        let goalLine = `${event.description}`;
        if (event.playerName) {
          goalLine += ` (${showNumbers && event.playerNumber ? `#${event.playerNumber} ` : ''}${event.playerName})`;
        }
        if (event.isPenalty) {
          goalLine += ` (Penalty)`;
        }
        goalLine += ` - ${event.timestamp} [${event.timerValue}]`;
        exportText += goalLine + '\n';
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

  const handleResetMatch = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    // Save settings to preserve them
    const savedSettings = {
      ageGroup,
      homeTeam,
      awayTeam,
      useQuarters,
      periodLength,
      isHome,
      showNumbers,
    };

    setSetupComplete(false);
    setPlayersConfigured(false);
    setMatchStarted(false);
    setCurrentPeriod(null);
    setIsRunning(false);
    setElapsedTime(0);
    setEvents([]);
    setPeriodStarted(false);

    // Restore the saved settings immediately after reset
    localStorage.setItem('footballMatchData', JSON.stringify({
      ...savedSettings,
      setupComplete: false,
      playersConfigured: false,
      matchStarted: false,
      currentPeriod: null,
      elapsedTime: 0,
      events: [],
      periodStarted: false,
    }));

    // Note: Players, age group, team names, format, and period length are NOT reset - they persist across matches
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const getNextPeriod = () => {
    const periods = getPeriods();
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

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Football Match Tracker
        </h1>

        {/* Match Setup Screen */}
        {!setupComplete && (
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleHomeAway(true)}
                  className={`flex-1 font-bold py-3 px-6 rounded-lg transition duration-200 ${
                    isHome
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleToggleHomeAway(false)}
                  className={`flex-1 font-bold py-3 px-6 rounded-lg transition duration-200 ${
                    !isHome
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Away
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => handleAgeGroupChange(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ageGroups.map((ag) => (
                    <option key={ag.value} value={ag.value}>
                      {ag.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Format
                </label>
                <select
                  value={`${periodLength}-${useQuarters ? 'quarters' : 'halves'}`}
                  onChange={(e) => {
                    const [length, format] = e.target.value.split('-');
                    setPeriodLength(parseFloat(length));
                    setUseQuarters(format === 'quarters');
                  }}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {(() => {
                    const selectedGroup = ageGroups.find(ag => ag.value === ageGroup);
                    if (!selectedGroup) return null;

                    // For U13 and above, only show halves
                    if (['U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'Adult'].includes(ageGroup)) {
                      const halfLength = selectedGroup.totalTime / 2;
                      return <option value={`${halfLength}-halves`}>{halfLength} min halves</option>;
                    }

                    // For U12 and below, show both quarters and halves options
                    const quarterLength = selectedGroup.totalTime / 4;
                    const halfLength = selectedGroup.totalTime / 2;
                    return (
                      <>
                        <option value={`${quarterLength}-quarters`}>{quarterLength} min quarters</option>
                        <option value={`${halfLength}-halves`}>{halfLength} min halves</option>
                      </>
                    );
                  })()}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Home Team
              </label>
              <input
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Enter home team name"
                className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Away Team
              </label>
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Enter away team name"
                className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSetupComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <Play size={20} />
              Continue to Player Setup
            </button>
          </div>
        )}

        {/* Player Configuration Screen */}
        {setupComplete && !playersConfigured && (
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {isHome ? homeTeam : awayTeam} Players
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-300">
                Show Player Numbers
              </label>
              <button
                onClick={() => setShowNumbers(!showNumbers)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showNumbers ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showNumbers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {players.map((player, index) => (
                <div key={index} className="flex gap-1 items-center bg-gray-700 p-2 rounded-lg">
                  {showNumbers && (
                    <input
                      type="number"
                      value={player.number}
                      onChange={(e) => handlePlayerNumberChange(index, e.target.value)}
                      className="w-12 p-2 bg-gray-600 border border-gray-500 text-gray-100 rounded text-center text-sm"
                      min="1"
                    />
                  )}
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder="Player name"
                    className="flex-1 p-2 bg-gray-600 border border-gray-500 text-gray-100 rounded text-sm"
                  />
                  <button
                    onClick={() => handleRemovePlayer(index)}
                    className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddPlayer}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Add Player
            </button>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setSetupComplete(false)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Back
              </button>
              <button
                onClick={handlePlayersComplete}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <Play size={20} />
                Proceed to Match Tracker
              </button>
            </div>
          </div>
        )}

        {/* Match Tracker Screen */}
        {matchStarted && (
          <>
            <div className="bg-gray-700 p-4 rounded-lg mb-6" key={`summary-${refreshKey}`}>
              <div className="text-center">
                {(() => {
                  const homeGoals = events.filter(e => e.type === 'goal' && e.team === homeTeam);
                  const awayGoals = events.filter(e => e.type === 'goal' && e.team === awayTeam);
                  const homeGoalTimes = homeGoals.map(g => {
                    const minute = calculateMatchMinute(g.timerValue, g.period);
                    return g.isPenalty ? `${minute}'(pen)` : `${minute}'`;
                  }).join(', ');
                  const awayGoalTimes = awayGoals.map(g => {
                    const minute = calculateMatchMinute(g.timerValue, g.period);
                    return g.isPenalty ? `${minute}'(pen)` : `${minute}'`;
                  }).join(', ');
                  
                  return (
                    <>
                      <div className="flex justify-center items-center mb-2">
                        <span className="text-lg font-bold text-gray-100 text-right flex-1">{homeTeam}</span>
                        <span className="text-lg font-bold text-orange-500 px-2">{homeGoals.length}–{awayGoals.length}</span>
                        <span className="text-lg font-bold text-gray-100 text-left flex-1">{awayTeam}</span>
                      </div>
                      <div className="flex justify-center items-start font-mono text-sm text-gray-400">
                        <span className="text-right flex-1">
                          {homeGoalTimes && `(${homeGoalTimes})`}
                        </span>
                        <span className="px-4" style={{minWidth: '60px'}}></span>
                        <span className="text-left flex-1">
                          {awayGoalTimes && `(${awayGoalTimes})`}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {currentPeriod && (
              <div className="bg-gray-700 p-6 rounded-lg mb-6 text-center">
                <p className="text-lg text-gray-300 mb-2">
                  {currentPeriod.startsWith('Q') ? `Quarter ${currentPeriod.substring(1)}` : `Half ${currentPeriod.substring(1)}`} ({periodLength} minutes)
                </p>
                <p className="text-5xl font-bold text-orange-500 mb-4">
                  {(() => {
                    let previousMinutes = 0;
                    if (currentPeriod === 'Q2') previousMinutes = periodLength;
                    else if (currentPeriod === 'Q3') previousMinutes = periodLength * 2;
                    else if (currentPeriod === 'Q4') previousMinutes = periodLength * 3;
                    else if (currentPeriod === 'H2') previousMinutes = periodLength;
                    
                    const totalSeconds = (previousMinutes * 60) + elapsedTime;
                    return formatTime(totalSeconds);
                  })()}
                </p>
                
                <div className="gap-2 justify-center mb-4 hidden">
                  <button
                    onClick={() => setElapsedTime(prev => Math.min(prev + 10, periodLength * 60))}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
                  >
                    +10 sec
                  </button>
                  <button
                    onClick={() => setElapsedTime(prev => Math.min(prev + 60, periodLength * 60))}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
                  >
                    +1 min
                  </button>
                  <button
                    onClick={() => setElapsedTime(prev => Math.min(prev + 300, periodLength * 60))}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
                  >
                    +5 min
                  </button>
                </div>
                
                <div className="flex gap-3 justify-center">
                  {!isRunning ? (
                    <button
                      onClick={handleResume}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
                    >
                      <Play size={20} />
                      {elapsedTime > 0 ? 'Restart' : 'Start'}
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
                    >
                      <Pause size={20} />
                      Pause
                    </button>
                  )}
                  
                  <button
                    onClick={handleEndPeriod}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
                  >
                    <Square size={20} />
                    End {currentPeriod}
                  </button>
                </div>
              </div>
            )}

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

            {periodStarted && currentPeriod && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleRecordGoal(homeTeam)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Goal {homeTeam}
                </button>
                <button
                  onClick={() => handleRecordGoal(awayTeam)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Goal {awayTeam}
                </button>
              </div>
            )}

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
                            {event.description}
                            {event.type === 'goal' && event.playerName && (
                              <span className="text-gray-400 ml-2">
                                ({showNumbers && event.playerNumber ? `#${event.playerNumber} ` : ''}{event.playerName})
                              </span>
                            )}
                            {event.type === 'goal' && event.isPenalty && (
                              <span className="text-yellow-400 ml-2">(Penalty)</span>
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
          </>
        )}

        {/* Modals */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-700">
              <h3 className="text-lg font-bold text-orange-500 mb-4">Reset Match?</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to reset the match? All data will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelReset}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-700">
              <h3 className="text-lg font-bold text-orange-500 mb-4">Delete Event?</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this event?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showMissedGoalConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-700">
              <h3 className="text-lg font-bold text-orange-500 mb-4">Add Missed Goal?</h3>
              <p className="text-gray-300 mb-6">
                Add a goal for <strong className="text-orange-500">{missedGoalTeam}</strong> to {missedGoalPeriod}?
                <br />
                <span className="text-sm text-gray-400">
                  (Will be recorded at end of period)
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelMissedGoal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMissedGoal}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FootballMatchTracker;