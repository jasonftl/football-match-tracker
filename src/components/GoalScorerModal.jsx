// Date: 2025-10-09
// Goal Scorer Selection Modal component for Football Match Tracker
// Allows selecting which player scored a goal

import React, { useState } from 'react';
import { X, Target } from 'lucide-react';

const GoalScorerModal = ({
  isOpen,
  players,
  showNumbers,
  onClose,
  onSelectScorer
}) => {

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPenalty, setIsPenalty] = useState(false);

  if (!isOpen) return null;

  // Handle player selection
  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedPlayer) {
      onSelectScorer({
        playerNumber: selectedPlayer.number,
        playerName: selectedPlayer.name,
        isPenalty
      });
      // Reset state
      setSelectedPlayer(null);
      setIsPenalty(false);
    }
  };

  // Handle no scorer
  const handleNoScorer = () => {
    onSelectScorer(null);
    setSelectedPlayer(null);
    setIsPenalty(false);
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedPlayer(null);
    setIsPenalty(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Target size={24} />
            Who Scored?
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-200 p-2"
          >
            <X size={20} className="sm:hidden" />
            <X size={24} className="hidden sm:block" />
          </button>
        </div>

        {/* Player List */}
        <div className="space-y-2 max-h-96 overflow-y-auto mb-4 sm:mb-6">
          {players.map((player, index) => {
            const isSubstitute = player.isSub;
            const isSelected = selectedPlayer?.number === player.number;

            return (
              <button
                key={index}
                onClick={() => handlePlayerClick(player)}
                className={`w-full p-3 rounded-lg transition duration-200 text-left ${
                  isSelected
                    ? 'bg-orange-600 border-2 border-orange-400'
                    : isSubstitute
                    ? 'bg-gray-700 opacity-50 border border-gray-600'
                    : 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                }`}
              >
                <span className={`text-sm sm:text-base ${isSelected ? 'text-white font-bold' : 'text-gray-100'}`}>
                  {showNumbers && player.number ? `#${player.number} ` : ''}
                  {player.name || `Player ${player.number}`}
                  {isSubstitute && <span className="text-xs text-gray-400 ml-2">(Sub)</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* Penalty Checkbox - Only shown when a player is selected */}
        {selectedPlayer && (
          <div className="mb-4 sm:mb-6 bg-gray-700 p-3 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPenalty}
                onChange={(e) => setIsPenalty(e.target.checked)}
                className="w-5 h-5 text-orange-600 bg-gray-600 border-gray-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm sm:text-base text-gray-100">
                Penalty Goal
              </span>
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            onClick={handleNoScorer}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition duration-200 text-xs sm:text-base"
          >
            No Scorer
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition duration-200 text-xs sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPlayer}
            className={`font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition duration-200 text-xs sm:text-base ${
              selectedPlayer
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalScorerModal;
