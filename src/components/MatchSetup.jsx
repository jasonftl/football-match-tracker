// Date: 2025-10-05
// Match Setup component for Football Match Tracker
// Handles team selection and match configuration

import React from 'react';
import { Play } from 'lucide-react';
import { AGE_GROUPS } from '../constants/ageGroups';

const MatchSetup = ({ 
  isHome, 
  setIsHome, 
  ageGroup, 
  setAgeGroup,
  homeTeam,
  setHomeTeam,
  awayTeam,
  setAwayTeam,
  useQuarters,
  setUseQuarters,
  periodLength,
  setPeriodLength,
  onSetupComplete 
}) => {
  
  // Handle home/away toggle
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

  // Handle age group change
  const handleAgeGroupChange = (newAgeGroup) => {
    setAgeGroup(newAgeGroup);
    const selectedGroup = AGE_GROUPS.find(ag => ag.value === newAgeGroup);
    if (selectedGroup) {
      setUseQuarters(selectedGroup.defaultQuarters);
      setPeriodLength(selectedGroup.defaultPeriodLength);
    }
  };

  // Get selected age group details
  const selectedAgeGroup = AGE_GROUPS.find(ag => ag.value === ageGroup);

  return (
    <div className="space-y-4 mb-6">
      {/* Home/Away Toggle */}
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

      {/* Age Group Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Age Group
        </label>
        <select
          value={ageGroup}
          onChange={(e) => handleAgeGroupChange(e.target.value)}
          className="input-field"
        >
          {AGE_GROUPS.map((ag) => (
            <option key={ag.value} value={ag.value}>
              {ag.label} - {ag.totalTime} min ({ag.defaultQuarters ? '4 × ' + ag.defaultPeriodLength + ' min quarters' : '2 × ' + ag.defaultPeriodLength + ' min halves'})
            </option>
          ))}
        </select>
      </div>

      {/* Match Format */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Match Format
        </label>
        <select
          value={useQuarters ? 'quarters' : 'halves'}
          onChange={(e) => {
            const newUseQuarters = e.target.value === 'quarters';
            setUseQuarters(newUseQuarters);
            if (selectedAgeGroup) {
              if (newUseQuarters) {
                setPeriodLength(selectedAgeGroup.totalTime / 4);
              } else {
                setPeriodLength(selectedAgeGroup.totalTime / 2);
              }
            }
          }}
          className="input-field"
        >
          <option value="quarters">Quarters (4 periods)</option>
          <option value="halves">Halves (2 periods)</option>
        </select>
      </div>

      {/* Period Length */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Period Length (minutes)
        </label>
        <input
          type="number"
          value={periodLength}
          onChange={(e) => setPeriodLength(parseFloat(e.target.value) || 0)}
          step="0.5"
          min="1"
          max="90"
          className="input-field"
        />
        <p className="text-sm text-gray-400 mt-1">
          Total match time: {useQuarters ? periodLength * 4 : periodLength * 2} minutes
        </p>
      </div>

      {/* Home Team Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Home Team
        </label>
        <input
          type="text"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          placeholder="Enter home team name"
          className="input-field"
        />
      </div>

      {/* Away Team Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Away Team
        </label>
        <input
          type="text"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          placeholder="Enter away team name"
          className="input-field"
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={onSetupComplete}
        className="btn-primary w-full"
      >
        <Play size={20} />
        Continue to Player Setup
      </button>
    </div>
  );
};

export default MatchSetup;