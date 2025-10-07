// Date: 2025-10-07
// About Modal component for Football Match Tracker
// Displays README.md instructions

import React from 'react';
import { X, Info } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Info size={24} className="text-orange-500" />
            <h3 className="text-2xl font-bold text-orange-500">
              About Football Match Tracker
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="text-gray-300 space-y-4">
          <p>
            A Progressive Web App (PWA) for tracking football matches from U7 to Adult level.
            Optimised for mobile devices and works completely offline.
          </p>

          <h4 className="text-xl font-bold text-orange-500 mt-6">Features</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            <li>Match Setup: Configure age group, match format (quarters/halves/custom), and team names</li>
            <li>Custom Formats: Create custom match formats with 1, 2, or 4 periods of any length</li>
            <li>Player Management: Add and manage your team squad list with optional player numbers</li>
            <li>Substitute Tracking: Mark players as starting or substitutes with green/red toggles</li>
            <li>Live Timer: Track match time with cumulative display across periods</li>
            <li>Goal Tracking: Record goals in real-time with timestamps</li>
            <li>Goal Details: Assign players to goals and mark penalties</li>
            <li>Missed Goals: Add goals to previous periods that were missed during play</li>
            <li>Substitution Management: Manage player substitutions during the match</li>
            <li>Power Play Support: Automatic extra player allowance for U7-U10 when trailing</li>
            <li>Match Events: View complete chronological list of all match events</li>
            <li>Export: Copy detailed match data to clipboard for sharing</li>
            <li>Offline Support: Works completely offline once installed</li>
            <li>Data Persistence: Match settings, player squad lists, and substitute status saved automatically</li>
          </ul>

          <h4 className="text-xl font-bold text-orange-500 mt-6">Installation</h4>
          <div className="text-sm">
            <p className="font-bold text-gray-200 mt-3">iOS Devices:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Open the app URL in Safari</li>
              <li>Tap the Share button (square with arrow pointing up)</li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>

            <p className="font-bold text-gray-200 mt-3">Android Devices:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Open the app URL in Chrome</li>
              <li>Tap the menu (three dots)</li>
              <li>Tap "Add to Home Screen" or "Install app"</li>
              <li>Tap "Add" or "Install" to confirm</li>
            </ol>
          </div>

          <h4 className="text-xl font-bold text-orange-500 mt-6">Age Group Defaults</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2">Age Group</th>
                  <th className="text-left py-2">Format</th>
                  <th className="text-left py-2">Period Length</th>
                  <th className="text-left py-2">Total Time</th>
                  <th className="text-left py-2">Players</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-2">U7-U8</td>
                  <td>4 Quarters</td>
                  <td>10 min</td>
                  <td>40 min</td>
                  <td>5</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2">U9-U10</td>
                  <td>4 Quarters</td>
                  <td>12.5 min</td>
                  <td>50 min</td>
                  <td>7</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2">U11-U12</td>
                  <td>2 Halves*</td>
                  <td>30 min</td>
                  <td>60 min</td>
                  <td>9</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2">U13-U14</td>
                  <td>2 Halves</td>
                  <td>35 min</td>
                  <td>70 min</td>
                  <td>11</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2">U15-U16</td>
                  <td>2 Halves</td>
                  <td>40 min</td>
                  <td>80 min</td>
                  <td>11</td>
                </tr>
                <tr>
                  <td className="py-2">U17-Adult</td>
                  <td>2 Halves</td>
                  <td>45 min</td>
                  <td>90 min</td>
                  <td>11</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">*U11-U12 can also use 4 quarters (15 min each)</p>
          </div>

          <h4 className="text-xl font-bold text-orange-500 mt-6">Tips & Best Practices</h4>
          <div className="text-sm">
            <p className="font-bold text-gray-200 mt-3">Before the Match:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Set up your player squad list before arriving at the pitch</li>
              <li>Mark starting players (green) and substitutes (red)</li>
              <li>Check that the age group and format are correct</li>
            </ul>

            <p className="font-bold text-gray-200 mt-3">During the Match:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Record goals immediately when they happen</li>
              <li>Use the Substitutes button to manage player changes</li>
              <li>Power play automatically calculated for U7-U10 teams when trailing</li>
              <li>Use the pause button during breaks or injuries</li>
            </ul>

            <p className="font-bold text-gray-200 mt-3">After the Match:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Export match data before resetting</li>
              <li>Review and edit any incorrect times or player assignments</li>
              <li>Share the exported data with parents/coaches</li>
            </ul>
          </div>

          <h4 className="text-xl font-bold text-orange-500 mt-6">Privacy</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            <li>No data is sent to any server</li>
            <li>All data stored locally on your device</li>
            <li>No tracking or analytics</li>
            <li>No account or login required</li>
          </ul>

          <h4 className="text-xl font-bold text-orange-500 mt-6">Browser Support</h4>
          <p className="text-sm">iOS Safari 14+, Chrome 90+, Firefox 88+, Edge 90+</p>

          <h4 className="text-xl font-bold text-orange-500 mt-6">License</h4>
          <p className="text-sm">
            This project is licensed under the GNU General Public License v3.0.
          </p>

          <h4 className="text-xl font-bold text-orange-500 mt-6">Support</h4>
          <p className="text-sm">
            For questions or feedback, please open an issue in the repo:<br />
            <span className="text-gray-300">
              github.com/jasonftl/football-match-tracker
            </span>
          </p>

          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© 2025 - All rights reserved</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
