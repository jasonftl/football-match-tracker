// Date: 2025-10-07
// Match Setup component for Football Match Tracker
// Handles team selection and match configuration

import React, { useState, useEffect } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { AGE_GROUPS } from '../constants/ageGroups';

const MatchSetup = ({
  isManager,
  setIsManager,
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

  // Debug mode state
  const [debugMode, setDebugMode] = useState(() => {
    const saved = localStorage.getItem('debugMode');
    return saved === 'true';
  });

  // Test API state
  const [testApiKey, setTestApiKey] = useState('');
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Listen for debug mode changes
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('debugMode');
      setDebugMode(saved === 'true');
    }, 500);
    return () => clearInterval(interval);
  }, []);

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

  // Test API function (local testing only)
  const handleTestAPI = async () => {
    if (!testApiKey.trim()) {
      alert('Please paste your OpenRouter API key');
      return;
    }

    const testMatchData = `Caterham Pumas 2–1 Opposition

H1 Start - 18:31:00 [00:00]
Goal - Caterham Pumas (#3 Marco) - 18:35:42 [05:42]
Goal - Opposition - 18:42:18 [12:18]
H1 End - 19:01:00 [30:00]
H2 Start - 19:01:15 [30:00]
Goal - Caterham Pumas (#1 Joseph) (Penalty) - 19:15:33 [44:18]
H2 End - 19:31:15 [60:00]
Match End - 19:31:15 [60:00]`;

    setIsTestingAPI(true);
    setTestResult(null);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${testApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
          messages: [
            {
              role: 'system',
              content: 'You are an AI sports writer covering grassroots football. Write short, honest match reports in clear British English. Capture the spirit of the game — the teamwork, graft, and small turning points — without exaggeration or flattery. Celebrate effort, learning, and moments of character as much as results or goals. Keep the tone warm and fair, showing pride in the team as a whole. A parent reading should feel their child\'s part mattered, and the story should sound like it came from the touchline, not a press office.'
            },
            {
              role: 'user',
              content: testMatchData
            }
          ]
        })
      });

      // Capture full response
      const responseText = await response.text();

      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        rawResponse: responseText
      };

      if (!response.ok) {
        // Try to parse JSON error
        try {
          result.parsedError = JSON.parse(responseText);
        } catch (e) {
          result.parseError = 'Could not parse as JSON';
        }
        setTestResult(result);
      } else {
        // Success - parse the report
        try {
          const data = JSON.parse(responseText);
          result.parsedResponse = data;
          result.report = data.choices?.[0]?.message?.content;
          setTestResult(result);
        } catch (e) {
          result.parseError = 'Could not parse response as JSON';
          setTestResult(result);
        }
      }

      // Copy full result to clipboard
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));

    } catch (error) {
      const errorResult = {
        error: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString()
      };
      setTestResult(errorResult);
      await navigator.clipboard.writeText(JSON.stringify(errorResult, null, 2));
    } finally {
      setIsTestingAPI(false);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Referee/Manager Toggle */}
      <div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsManager(false)}
            className={`flex-1 font-bold py-3 px-6 rounded-lg transition duration-200 ${
              !isManager
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Referee
          </button>
          <button
            onClick={() => setIsManager(true)}
            className={`flex-1 font-bold py-3 px-6 rounded-lg transition duration-200 ${
              isManager
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Manager
          </button>
        </div>
      </div>

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

      {/* Debug Test API Section */}
      {debugMode && (
        <div className="bg-gray-700 p-4 rounded-lg space-y-3 border-2 border-purple-500">
          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
            <Sparkles size={16} />
            Local API Test (Debug Only)
          </h3>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              OpenRouter API Key (.dev\.env)
            </label>
            <input
              type="password"
              value={testApiKey}
              onChange={(e) => setTestApiKey(e.target.value)}
              placeholder="Paste API key here for testing"
              className="input-field text-sm"
            />
          </div>
          <button
            onClick={handleTestAPI}
            disabled={isTestingAPI || !testApiKey.trim()}
            className={`w-full font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm ${
              isTestingAPI || !testApiKey.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <Sparkles size={16} />
            {isTestingAPI ? 'Testing API...' : 'Test OpenRouter API'}
          </button>
          {testResult && (
            <div className="bg-gray-800 p-3 rounded text-xs font-mono max-h-64 overflow-y-auto">
              <div className="mb-2 text-gray-300">
                <strong>Status:</strong> {testResult.status || 'Error'}
                {testResult.statusText && ` (${testResult.statusText})`}
              </div>
              {testResult.ok && testResult.report ? (
                <div className="text-green-400">
                  <strong>Success!</strong> Report generated and copied to clipboard.
                  <div className="mt-2 text-gray-300 whitespace-pre-wrap">
                    {testResult.report.substring(0, 200)}...
                  </div>
                </div>
              ) : (
                <div className="text-red-400">
                  <strong>Error Details:</strong>
                  <pre className="mt-2 text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
              <div className="mt-2 text-gray-400 text-center">
                Full details copied to clipboard
              </div>
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onSetupComplete}
        className="btn-primary w-full"
      >
        <Play size={20} />
        {isManager ? 'Continue to Player Setup' : 'Start Match Tracker'}
      </button>
    </div>
  );
};

export default MatchSetup;