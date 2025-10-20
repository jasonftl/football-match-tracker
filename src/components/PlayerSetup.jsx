// Date: 2025-10-07
// Player Setup component for Football Match Tracker
// Manages team player configuration

import React, { useState, useEffect, useRef } from 'react';
import { Play, UserPlus, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { AGE_GROUPS } from '../constants/ageGroups';
import Modal from './Modal';

const PlayerSetup = ({
  teamName,
  players,
  setPlayers,
  showNumbers,
  setShowNumbers,
  ageGroup,
  onPlayersComplete,
}) => {

  // State for reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  // Ref for player list container
  const playerListRef = useRef(null);

  // Get selected age group details
  const selectedAgeGroup = AGE_GROUPS.find(ag => ag.value === ageGroup);

  // Calculate player counts
  const startingPlayerCount = players.filter(p => !p.isSub).length;
  const substitutePlayerCount = players.filter(p => p.isSub).length;
  const showCaution = selectedAgeGroup && startingPlayerCount !== selectedAgeGroup.defaultPlayerCount;

  // Ensure minimum player count for age group
  useEffect(() => {
    if (selectedAgeGroup && players.length < selectedAgeGroup.defaultPlayerCount) {
      const newPlayers = [...players];
      const currentMaxNumber = players.length > 0 ? Math.max(...players.map(p => p.number)) : 0;

      // Add missing players
      for (let i = players.length; i < selectedAgeGroup.defaultPlayerCount; i++) {
        newPlayers.push({
          number: currentMaxNumber + (i - players.length + 1),
          name: '',
          isSub: false
        });
      }
      setPlayers(newPlayers);
    }
  }, [ageGroup, selectedAgeGroup]);

  // Scroll to bottom when new player is added
  useEffect(() => {
    if (shouldScrollToBottom && playerListRef.current) {
      playerListRef.current.scrollTop = playerListRef.current.scrollHeight;
      setShouldScrollToBottom(false);
    }
  }, [players, shouldScrollToBottom]);

  
  // Handle player name change
  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  // Handle player number change
  const handlePlayerNumberChange = (index, number) => {
    const newPlayers = [...players];
    newPlayers[index].number = parseInt(number) || '';
    setPlayers(newPlayers);
  };

  // Handle sub checkbox change
  const handleSubChange = (index, isSub) => {
    const newPlayers = [...players];
    newPlayers[index].isSub = isSub;
    setPlayers(newPlayers);
  };

  // Add new player
  const handleAddPlayer = () => {
    const newNumber = players.length > 0 ? Math.max(...players.map(p => p.number)) + 1 : 1;

    // Count current starting players
    const startingPlayerCount = players.filter(p => !p.isSub).length;

    // If we already have max starting players, new player should be a sub
    const shouldBeSub = selectedAgeGroup && startingPlayerCount >= selectedAgeGroup.defaultPlayerCount;

    setPlayers([...players, { number: newNumber, name: '', isSub: shouldBeSub }]);
    setShouldScrollToBottom(true);
  };

  // Remove player
  const handleRemovePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  // Handle reset players click
  const handleResetPlayersClick = () => {
    setShowResetConfirm(true);
  };

  // Confirm reset players
  const confirmResetPlayers = () => {
    if (selectedAgeGroup) {
      const resetPlayers = [];
      for (let i = 1; i <= selectedAgeGroup.defaultPlayerCount; i++) {
        resetPlayers.push({ number: i, name: '', isSub: false });
      }
      setPlayers(resetPlayers);
    }
    setShowResetConfirm(false);
  };

  // Cancel reset players
  const cancelResetPlayers = () => {
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4">
        {teamName} Players
      </h2>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddPlayer}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />
          Add
        </button>

        <button
          onClick={handleResetPlayersClick}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Reset
        </button>

        <button
          onClick={onPlayersComplete}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <Play size={20} />
          Proceed
        </button>
      </div>

      {/* Player List Header with Show Numbers Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
        {/* Left: Sub Toggle Explanation */}
        <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
          <span>
            <span className="text-green-500">Green = Starting ({startingPlayerCount})</span> | <span className="text-red-500">Red = Sub ({substitutePlayerCount})</span>
          </span>
          {showCaution && <AlertTriangle size={16} className="text-yellow-500" />}
        </div>

        {/* Right: Show Numbers Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <label className="text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">
            Show Numbers
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
      </div>

      {/* Player List */}
      <div ref={playerListRef} className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="flex gap-2 items-center bg-gray-700 p-3 rounded-lg">
            {/* Sub Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => handleSubChange(index, !player.isSub)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  player.isSub ? 'bg-red-600' : 'bg-green-600'
                }`}
                title={player.isSub ? 'Substitute' : 'Starting'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    player.isSub ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {showNumbers && (
              <input
                type="number"
                value={player.number}
                onChange={(e) => handlePlayerNumberChange(index, e.target.value)}
                className="w-16 p-2 bg-gray-600 border border-gray-500 text-gray-100 rounded text-center"
                placeholder="#"
              />
            )}
            <input
              type="text"
              value={player.name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder="Player name"
              className="flex-1 p-2 bg-gray-600 border border-gray-500 text-gray-100 rounded"
            />
            <button
              onClick={() => handleRemovePlayer(index)}
              className="text-red-400 hover:text-red-300 p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        title="Reset Players?"
        message={
          <>
            Are you sure you want to reset all players?
            <br />
            <span className="text-sm text-gray-400 mt-2 block">
              This will:
              <ul className="list-disc ml-5 mt-1">
                <li>Clear all player names</li>
                <li>Reset to exactly {selectedAgeGroup?.defaultPlayerCount} players for {ageGroup}</li>
                <li>Mark all players as starting (green)</li>
              </ul>
            </span>
          </>
        }
        confirmText="Reset"
        cancelText="Cancel"
        confirmStyle="warning"
        onConfirm={confirmResetPlayers}
        onCancel={cancelResetPlayers}
      />
    </div>
  );
};

export default PlayerSetup;