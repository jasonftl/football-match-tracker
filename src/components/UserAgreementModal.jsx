// Date: 2025-10-11
// User Agreement Modal component for Football Match Tracker
// Displays terms and conditions on first run

import React from 'react';
import { AlertTriangle } from 'lucide-react';

const UserAgreementModal = ({ isOpen, onAccept }) => {
  if (!isOpen) return null;

  const handleDecline = () => {
    alert('You must accept the User Agreement to use this application. The app will now close.');
    // Close the tab/window (works in most browsers)
    window.close();
    // If window.close() doesn't work (some browsers prevent it), reload to show agreement again
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 max-w-2xl w-full border-2 border-orange-500 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle size={32} className="text-orange-500" />
          <h2 className="text-2xl font-bold text-orange-500">
            User Agreement Required
          </h2>
        </div>

        {/* Content */}
        <div className="text-gray-300 space-y-4 text-sm">
          <p className="text-lg font-bold text-white">
            Before using Football Match Tracker, you must read and accept these terms:
          </p>

          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <p className="text-sm text-gray-300 mb-3">
              <strong>This is an independent volunteer hobby project.</strong>
            </p>

            <h3 className="text-lg font-bold text-orange-500">1. Data Storage & Responsibility</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Match data is stored locally on your device</li>
              <li>You are responsible for any personal data you enter</li>
              <li>The app's developer does not collect, view, or store any match data</li>
              <li>Clearing browser data will delete all match information</li>
            </ul>

            <h3 className="text-lg font-bold text-orange-500 mt-4">2. Online Features & Location Usage</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>App hosted on Vercel - may collect anonymous usage analytics</li>
              <li>No personally identifiable information collected via analytics</li>
              <li>Optional AI Match Report feature sends match data to OpenRouter's AI service</li>
              <li>Data sent to AI may be processed for improving their models</li>
              <li><strong>Location access:</strong> Your GPS location may be requested as part of match tracking to fetch weather data from Open-Meteo API</li>
              <li>Location coordinates and weather conditions are part of match tracking and may be included in exported data and AI reports</li>
              <li>Location data is not stored permanently, logged, or used for any other purpose</li>
              <li>You can deny location permission - the app will still function without weather data</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">
              Privacy Policies: Vercel (<span className="text-gray-300">https://vercel.com/legal/privacy-policy</span>), OpenRouter (<span className="text-gray-300">https://openrouter.ai/privacy</span>), Open-Meteo (<span className="text-gray-300">https://open-meteo.com</span>)
            </p>

            <h3 className="text-lg font-bold text-orange-500 mt-4">3. Data Protection Tips</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Use player names only (e.g., "John" not "John Smith") to minimise identifiable data</li>
              <li>Clear old match data you no longer need</li>
              <li>Ensure your use complies with applicable laws and regulations</li>
            </ul>

            <h3 className="text-lg font-bold text-orange-500 mt-4">4. No Warranty & Liability</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>App provided "as is" without warranty of any kind</li>
              <li>We are not responsible for data loss, errors, or issues</li>
              <li>We are not liable for how third-party services handle data</li>
              <li>You use this app entirely at your own risk</li>
            </ul>

            <h3 className="text-lg font-bold text-orange-500 mt-4">5. Your Confirmation</h3>
            <div className="bg-gray-800 p-3 rounded border-l-4 border-orange-500">
              <p className="font-bold text-white">By clicking "I Agree", you confirm that:</p>
              <ul className="list-disc ml-5 space-y-1 mt-2">
                <li>You have read and understood these terms</li>
                <li>You will use player names only to minimise identifiable data</li>
                <li>You understand the optional AI feature sends data to third-party services</li>
                <li>You accept the app "as is" with no warranty</li>
                <li>You are old enough to enter into this agreement</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-600 border border-gray-500 rounded-lg p-4 mt-4">
            <p className="text-gray-200 text-center">
              If you do not agree to these terms, click "I Do Not Agree".
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={handleDecline}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            I Do Not Agree
          </button>
          <button
            onClick={onAccept}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            I Agree
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          You can review these terms anytime by clicking the Info (About) button in the app.
        </p>
      </div>
    </div>
  );
};

export default UserAgreementModal;
