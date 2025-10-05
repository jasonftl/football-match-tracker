// Date: 2025-10-05
// Player Setup component for Football Match Tracker
// Manages team player configuration

import React from 'react';
import { Play, UserPlus, Trash2 } from 'lucide-react';

const PlayerSetup = ({ 
  teamName, 
  players, 
  setPlayers, 
  showNumbers, 
  setShowNumbers, 
  onPlayersComplete 
}) => {
  
  // Handle player name change
  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  // Handle player number change
  const handlePlayerNumberChange = (index, number) => {
    const newPlayers = [...players];
    newPlayers[index].number = parseInt(number) || 0;
    setPlayers(newPlayers);
  };

  // Add new player
  const handleAddPlayer = () => {
    const newNumber = players.length > 0 ? Math.max(...players.map(p => p.number)) + 1 : 1;
    setPlayers([...players, { number: newNumber, name: '' }]);
  };

  // Remove player
  const handleRemovePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">
        {teamName} Players
      </h2>

      {/* Show Numbers Toggle */}
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

      {/* Player List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {players.map((player, index) => (
          <div key={index} className="flex gap-2 items-center bg-gray-700 p-3 rounded-lg">
            {showNumbers && (
              <input
                type="number"
                value={player.number}
                onChange={(e) => handlePlayerNumberChange(index, e.target.value)}
                className="w-16 p-2 bg-gray-600 border border-gray-500 text-gray-100 rounded text-center"
                min="1"
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

      {/* Add Player Button */}
      <button
        onClick={handleAddPlayer}
        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
      >
        <UserPlus size={20} />
        Add Player
      </button>

      {/* Continue Button */}
      <button
        onClick={onPlayersComplete}
        className="btn-primary w-full"
      >
        <Play size={20} />
        Proceed to Match Tracker
      </button>
    </div>
  );
};

export default PlayerSetup;