// Match Data View Component
// Displays match data with options to copy or generate AI report

import React from 'react';
import { Copy, Sparkles, ArrowDown } from 'lucide-react';

const MatchDataView = ({
  matchData,
  onCopyToClipboard,
  onGenerateAIReport,
  showCopied,
  isFullTime,
  isGeneratingAI,
  aiError,
  aiReport,
}) => {
  // Function to scroll to AI report section (at bottom of page)
  const scrollToAIReport = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Determine if AI report has been generated
  const hasAIReport = aiReport && !aiError;

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Match Data</h2>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* First Row - Copy and AI Report */}
        <div className="grid grid-cols-2 gap-2">
          {/* Copy to Clipboard Button */}
          <button
            onClick={onCopyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Copy size={20} />
            {showCopied ? 'Copied!' : 'Copy to Clipboard'}
          </button>

          {/* AI Report Button (includes weather) */}
          <button
            onClick={hasAIReport ? scrollToAIReport : onGenerateAIReport}
            disabled={(!isFullTime || isGeneratingAI) && !hasAIReport}
            className={`font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
              hasAIReport
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                : !isFullTime || isGeneratingAI
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {hasAIReport ? (
              <>
                <ArrowDown size={20} />
                Scroll to Report
              </>
            ) : (
              <>
                <Sparkles size={20} />
                {isGeneratingAI ? 'Generating...' : 'AI Report'}
              </>
            )}
          </button>
        </div>

        {/* Helper text */}
        {!isFullTime && (
          <p className="text-xs text-yellow-400 text-center">
            AI Report only available after full time
          </p>
        )}
        {hasAIReport && (
          <p className="text-xs text-green-400 text-center">
            AI Report generated successfully - scroll down to view
          </p>
        )}
      </div>

      {/* Match Data Display */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap break-words">
          {matchData}
        </pre>
      </div>
    </div>
  );
};

export default MatchDataView;
