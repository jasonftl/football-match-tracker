// Home Page Component
// First screen users see - intro and navigation to main features

import React from 'react';
import { Play, History, Info } from 'lucide-react';

const HomePage = ({ onStartNewMatch, onViewPreviousMatches, onShowAbout }) => {
  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        {/* Header with Info button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
            Football Match Tracker
          </h1>
          <button
            onClick={onShowAbout}
            className="text-gray-400 hover:text-orange-500 transition duration-200 p-2 rounded-full border border-gray-600 hover:border-orange-500"
            title="About & Help"
          >
            <Info size={24} />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Intro Text */}
          <div className="text-center">
            <p className="text-base sm:text-lg text-gray-300 mb-2">
              Track football matches from U7 to Adult level
            </p>
            <p className="text-sm text-gray-400">
              A Progressive Web App optimised for mobile devices and offline use
            </p>
          </div>

          {/* About Blurb */}
          <div className="bg-gray-700 rounded-lg p-4 sm:p-5 border border-gray-600">
            <h2 className="text-lg sm:text-xl font-bold text-orange-500 mb-3">What is this?</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-3">
              A simple, powerful tool for tracking grassroots football matches. Record goals,
              substitutions, and match events in real-time with a timer that runs even when
              your screen locks.
            </p>
            <p className="text-sm sm:text-base text-gray-300">
              Choose <strong>Referee Mode</strong> for quick match tracking, or <strong>Manager Mode</strong> for
              detailed player and substitution management. Export match data and generate AI
              match reports when online.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4">
            {/* Track New Match */}
            <button
              onClick={onStartNewMatch}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 sm:py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg"
            >
              <Play size={24} />
              Track New Match
            </button>

            {/* Previous Matches */}
            <button
              onClick={onViewPreviousMatches}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 sm:py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg"
              disabled
            >
              <History size={24} />
              Previous Matches
              <span className="text-xs bg-gray-600 px-2 py-1 rounded ml-2">Coming Soon</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-2 sm:pt-4">
            <p>© 2025 Football Match Tracker</p>
            <p className="mt-1">Works offline • Install as PWA for best experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
