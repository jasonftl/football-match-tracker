// Date: 2025-10-07
// Match Setup component for Football Match Tracker
// Handles team selection and match configuration

import React, { useState, useEffect } from 'react';
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
  customPeriods,
  setCustomPeriods,
  onSetupComplete
}) => {

  // Local state for custom format
  const [isCustomFormat, setIsCustomFormat] = useState(customPeriods !== null);
  const [localCustomPeriods, setLocalCustomPeriods] = useState(customPeriods || 2);

  // Get selected age group details
  const selectedAgeGroup = AGE_GROUPS.find(ag => ag.value === ageGroup);

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
      // Reset custom format when age group changes
      setIsCustomFormat(false);
    }
  };

  // Handle format change
  const handleFormatChange = (value) => {
    if (value === 'custom') {
      setIsCustomFormat(true);
      // Default to 2 periods when switching to custom
      const defaultPeriods = 2;
      setLocalCustomPeriods(defaultPeriods);
      setCustomPeriods(defaultPeriods);
      if (selectedAgeGroup) {
        setPeriodLength(selectedAgeGroup.totalTime / defaultPeriods);
        setUseQuarters(false);
      }
    } else {
      setIsCustomFormat(false);
      setCustomPeriods(null); // Clear custom periods
      const newUseQuarters = value === 'quarters';
      setUseQuarters(newUseQuarters);
      if (selectedAgeGroup) {
        if (newUseQuarters) {
          setPeriodLength(selectedAgeGroup.totalTime / 4);
        } else {
          setPeriodLength(selectedAgeGroup.totalTime / 2);
        }
      }
    }
  };

  // Handle custom periods change
  const handleCustomPeriodsChange = (numPeriods) => {
    setLocalCustomPeriods(numPeriods);
    setCustomPeriods(numPeriods);
    if (selectedAgeGroup) {
      setPeriodLength(selectedAgeGroup.totalTime / numPeriods);
    }
    // Update useQuarters based on periods
    setUseQuarters(numPeriods === 4);
  };

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

      {/* Age Group and Match Format */}
      <div className="grid grid-cols-2 gap-2">
        {/* Age Group Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Age
          </label>
          <select
            value={ageGroup}
            onChange={(e) => handleAgeGroupChange(e.target.value)}
            className="input-field"
          >
            {AGE_GROUPS.map((ag) => (
              <option key={ag.value} value={ag.value}>
                {ag.label}
              </option>
            ))}
          </select>
        </div>

        {/* Match Format */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Format
          </label>
          <select
            value={isCustomFormat ? 'custom' : (useQuarters ? 'quarters' : 'halves')}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="input-field"
          >
            {selectedAgeGroup && (
              <>
                {/* Show quarters option for U12 and below */}
                {!['U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'Adult'].includes(selectedAgeGroup.value) && (
                  <option value="quarters">
                    4 × {selectedAgeGroup.totalTime / 4} min
                  </option>
                )}
                {/* Always show halves option */}
                <option value="halves">
                  2 × {selectedAgeGroup.totalTime / 2} min
                </option>
                {/* Always show custom option */}
                <option value="custom">
                  Custom
                </option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Custom Format Options */}
      {isCustomFormat && (
        <div className="grid grid-cols-2 gap-2">
          {/* Periods */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Periods
            </label>
            <select
              value={localCustomPeriods}
              onChange={(e) => handleCustomPeriodsChange(parseInt(e.target.value))}
              className="input-field"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          {/* Period Length */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Period Length (min)
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
          </div>
        </div>
      )}

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