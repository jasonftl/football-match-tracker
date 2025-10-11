// Date: 2025-10-07
// Substitution Modal component for Football Match Tracker
// Manages player substitutions during a match

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';
import { AGE_GROUPS } from '../constants/ageGroups';

const SubstitutionModal = ({
  isOpen,
  players,
  showNumbers,
  ageGroup,
  homeGoals,
  awayGoals,
  isHome,
  onClose,
  onComplete
}) => {

  // Local state for player statuses (working copy)
  const [workingPlayers, setWorkingPlayers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize working copy when modal opens
  useEffect(() => {
    if (isOpen) {
      setWorkingPlayers(players.map(p => ({ ...p })));
      setShowConfirmation(false);
    }
  }, [isOpen, players]);

  if (!isOpen) return null;

  // Toggle player status
  const handleTogglePlayer = (index) => {
    const newPlayers = [...workingPlayers];
    newPlayers[index].isSub = !newPlayers[index].isSub;
    setWorkingPlayers(newPlayers);
  };

  // Get starting and substitute players
  const startingPlayers = workingPlayers.filter(p => !p.isSub);
  const substitutePlayers = workingPlayers.filter(p => p.isSub);

  // Get age group config
  const selectedAgeGroup = AGE_GROUPS.find(ag => ag.value === ageGroup);
  const defaultPlayerCount = selectedAgeGroup?.defaultPlayerCount || 11;

  // Check if power play is allowed (U7-U10 only)
  const powerPlayAllowed = ['U7', 'U8', 'U9', 'U10'].includes(ageGroup);

  // Calculate goal difference from user's perspective
  // (positive = we're winning, negative = we're losing)
  const goalDifference = isHome ? (homeGoals - awayGoals) : (awayGoals - homeGoals);

  // Calculate power play bonus
  let powerPlayBonus = 0;
  if (powerPlayAllowed && goalDifference < 0) {
    // We're losing
    const goalsDown = Math.abs(goalDifference);
    if (goalsDown >= 6) {
      powerPlayBonus = 2;
    } else if (goalsDown >= 4) {
      powerPlayBonus = 1;
    }
  }

  // Total allowed players
  const totalAllowed = defaultPlayerCount + powerPlayBonus;

  // Check if player count is correct
  const showCaution = startingPlayers.length !== totalAllowed;

  // Calculate changes
  const getChanges = () => {
    const changes = [];

    workingPlayers.forEach((wp, index) => {
      const originalPlayer = players[index];
      if (originalPlayer.isSub !== wp.isSub) {
        changes.push({
          player: wp,
          from: originalPlayer.isSub ? 'sub' : 'starting',
          to: wp.isSub ? 'sub' : 'starting'
        });
      }
    });

    return changes;
  };

  const changes = getChanges();
  const hasChanges = changes.length > 0;

  // Handle complete substitutes click
  const handleCompleteClick = () => {
    if (!hasChanges) {
      onClose();
      return;
    }
    setShowConfirmation(true);
  };

  // Handle confirm
  const handleConfirm = () => {
    onComplete(workingPlayers, changes);
    setShowConfirmation(false);
  };

  // Handle edit (go back to main view)
  const handleEdit = () => {
    setShowConfirmation(false);
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-4xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">

        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-orange-500">
                Manage Substitutions
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 p-2"
              >
                <X size={20} className="sm:hidden" />
                <X size={24} className="hidden sm:block" />
              </button>
            </div>

            {/* Header Row */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 mb-3">
              <h4 className="text-xs sm:text-lg font-bold text-green-500 text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span>
                  Playing ({startingPlayers.length}/{defaultPlayerCount}
                  {powerPlayBonus > 0 && ` + ${powerPlayBonus}`})
                </span>
                {showCaution && <AlertTriangle size={16} className="sm:hidden text-yellow-500" />}
                {showCaution && <AlertTriangle size={20} className="hidden sm:block text-yellow-500" />}
              </h4>
              <div className="w-10 sm:w-14"></div>
              <h4 className="text-xs sm:text-lg font-bold text-red-500 text-center">
                Subs ({substitutePlayers.length})
              </h4>
            </div>

            {/* Player Rows */}
            <div className="space-y-2 max-h-96 overflow-y-auto mb-4 sm:mb-6">
              {workingPlayers.map((player, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
                  {/* Left - Starting Player or Empty */}
                  <div>
                    {!player.isSub ? (
                      <div className="bg-gray-700 p-2 sm:p-3 rounded-lg">
                        <span className="text-xs sm:text-base text-gray-100 truncate block">
                          {showNumbers && player.number ? `#${player.number} ` : ''}
                          {player.name || `Player ${player.number}`}
                        </span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>

                  {/* Center - Toggle */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleTogglePlayer(index)}
                      className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors ${
                        player.isSub ? 'bg-red-600' : 'bg-green-600'
                      }`}
                      title={player.isSub ? 'Move to Starting' : 'Move to Substitutes'}
                    >
                      <span
                        className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform flex items-center justify-center ${
                          player.isSub ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                        }`}
                      >
                        <RefreshCw size={10} className="sm:hidden text-gray-800" />
                        <RefreshCw size={12} className="hidden sm:block text-gray-800" />
                      </span>
                    </button>
                  </div>

                  {/* Right - Substitute Player or Empty */}
                  <div>
                    {player.isSub ? (
                      <div className="bg-gray-700 p-2 sm:p-3 rounded-lg">
                        <span className="text-xs sm:text-base text-gray-100 truncate block">
                          {showNumbers && player.number ? `#${player.number} ` : ''}
                          {player.name || `Player ${player.number}`}
                        </span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg transition duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteClick}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg transition duration-200 text-sm sm:text-base"
              >
                Complete
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation View */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-orange-500">
                Confirm Substitutions
              </h3>
            </div>

            {/* Changes Summary */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-300 mb-3">Changes:</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-700 p-4 rounded-lg">
                {changes.map((change, index) => (
                  <div key={index} className="text-gray-100 text-sm">
                    {change.from === 'starting' ? (
                      <span>
                        <span className="text-red-400">OFF:</span>{' '}
                        {showNumbers && change.player.number ? `#${change.player.number} ` : ''}
                        {change.player.name || `Player ${change.player.number}`}
                      </span>
                    ) : (
                      <span>
                        <span className="text-green-400">ON:</span>{' '}
                        {showNumbers && change.player.number ? `#${change.player.number} ` : ''}
                        {change.player.name || `Player ${change.player.number}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Player Count Summary */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="bg-green-900 bg-opacity-30 border border-green-600 p-3 rounded-lg text-center">
                <p className="text-green-500 font-bold text-lg flex items-center justify-center gap-2">
                  <span>
                    {startingPlayers.length}/{defaultPlayerCount}
                    {powerPlayBonus > 0 && ` + ${powerPlayBonus}`}
                  </span>
                  {showCaution && <AlertTriangle size={18} className="text-yellow-500" />}
                </p>
                <p className="text-gray-300 text-sm">
                  Playing{powerPlayBonus > 0 && ' (with power play)'}
                </p>
              </div>
              <div className="bg-red-900 bg-opacity-30 border border-red-600 p-3 rounded-lg text-center">
                <p className="text-red-500 font-bold text-lg">{substitutePlayers.length}</p>
                <p className="text-gray-300 text-sm">Substitutes</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition duration-200 text-sm sm:text-base"
              >
                Confirm
              </button>
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition duration-200 text-sm sm:text-base"
              >
                Edit
              </button>
              <button
                onClick={handleCancelConfirmation}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubstitutionModal;
