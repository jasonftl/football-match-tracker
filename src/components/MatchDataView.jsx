// Match Data View Component
// Displays match data with options to copy or generate AI report

import React from 'react';
import { Copy, Sparkles } from 'lucide-react';

const MatchDataView = ({
  matchData,
  onCopyToClipboard,
  onGenerateAIReport,
  showCopied,
  aiEnabled,
  isFullTime,
  isGeneratingAI,
  aiError,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Match Data</h2>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {/* Copy to Clipboard Button */}
          <button
            onClick={onCopyToClipboard}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Copy size={20} />
            {showCopied ? 'Copied!' : 'Copy to Clipboard'}
          </button>

          {/* AI Report Button */}
          <button
            onClick={onGenerateAIReport}
            disabled={!aiEnabled || !isFullTime || isGeneratingAI}
            className={`flex-1 font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
              !aiEnabled || !isFullTime || isGeneratingAI
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <Sparkles size={20} />
            {isGeneratingAI
              ? 'Generating AI Report...'
              : aiError
              ? `Error: ${aiError}`
              : 'Generate AI Report'}
          </button>
        </div>

        {/* Helper text */}
        {!aiEnabled && (
          <p className="text-xs text-yellow-400 text-center">
            Enable AI Features in the About (Info) page to use this feature
          </p>
        )}
        {aiEnabled && !isFullTime && (
          <p className="text-xs text-yellow-400 text-center">
            AI Report only available after full time
          </p>
        )}
      </div>

      {/* Match Data Display */}
      <div className="bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto">
        <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap break-words">
          {matchData}
        </pre>
      </div>
    </div>
  );
};

export default MatchDataView;
