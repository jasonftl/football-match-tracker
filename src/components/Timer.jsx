// Date: 2025-10-05
// Timer component for Football Match Tracker
// Displays and controls the match timer

import React, { useState, useEffect } from 'react';
import { Square } from 'lucide-react';
import { getPeriodDisplayName, getCumulativeTimeFromRealTime } from '../utils/helpers';

const Timer = ({
  currentPeriod,
  periodLength,
  periodStartTimestamp,
  onEndPeriod
}) => {
  // State to force re-render every second
  const [, setTick] = useState(0);

  // Effect to update timer display every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1); // Force re-render
    }, 1000);

    return () => clearInterval(interval);
  }, [periodStartTimestamp]);

  return (
    <div className="bg-gray-700 p-6 sm:p-8 rounded-lg mb-4 sm:mb-6 text-center w-full">
      {/* Period Display */}
      <p className="text-xl sm:text-2xl text-gray-300 mb-4">
        {getPeriodDisplayName(currentPeriod)} ({periodLength} minutes)
      </p>

      {/* Timer Display */}
      <p className="text-6xl sm:text-7xl md:text-8xl font-bold text-orange-500 mb-6">
        {getCumulativeTimeFromRealTime(currentPeriod, periodStartTimestamp, periodLength)}
      </p>

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center">
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