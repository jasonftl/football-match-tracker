// AI Agreement Modal Component
// Brief reminder before generating AI reports (user already agreed to main terms)

import React from 'react';
import { Sparkles } from 'lucide-react';

const AIAgreementModal = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-purple-600">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={24} className="text-purple-500" />
          <h3 className="text-xl font-bold text-purple-500">
            Generate AI Report?
          </h3>
        </div>

        {/* Content */}
        <div className="text-gray-300 text-sm mb-6">
          <p className="mb-3">
            This will send your match data (teams, players, events, weather) to OpenRouter AI to generate a narrative match report.
          </p>
          <p className="text-gray-400 text-xs">
            Reminder: Use first names only to minimise identifiable data.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgreementModal;
