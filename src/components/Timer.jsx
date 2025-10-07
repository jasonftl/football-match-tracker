// Date: 2025-10-05
// Timer component for Football Match Tracker
// Displays and controls the match timer

import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { getPeriodDisplayName, getCumulativeTime } from '../utils/helpers';

const Timer = ({ 
  currentPeriod, 
  periodLength, 
  elapsedTime, 
  setElapsedTime, 
  isRunning, 
  onResume, 
  onPause, 
  onEndPeriod 
}) => {
  
  // Debug buttons for testing
  const handleAddTime = (seconds) => {
    setElapsedTime(prev => Math.min(prev + seconds, periodLength * 60));
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg mb-6 text-center">
      {/* Period Display */}
      <p className="text-lg text-gray-300 mb-2">
        {getPeriodDisplayName(currentPeriod)} ({periodLength} minutes)
      </p>
      
      {/* Timer Display */}
      <p className="text-5xl font-bold text-orange-500 mb-4">
        {getCumulativeTime(currentPeriod, elapsedTime, periodLength)}
      </p>
      
      {/* Debug Buttons */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => handleAddTime(10)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
        >
          +10 sec
        </button>
        <button
          onClick={() => handleAddTime(60)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
        >
          +1 min
        </button>
        <button
          onClick={() => handleAddTime(300)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
        >
          +5 min
        </button>
      </div>
      
      {/* Control Buttons */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={onResume}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <Play size={20} />
            {elapsedTime > 0 ? 'Restart' : 'Start'}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <Pause size={20} />
            Pause
          </button>
        )}
        
        <button
          onClick={onEndPeriod}
          className="btn-danger flex items-center gap-2"
        >
          <Square size={20} />
          End {currentPeriod}
        </button>
      </div>
    </div>
  );
};

export default Timer;