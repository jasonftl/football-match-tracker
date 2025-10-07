// Date: 2025-10-05
// Modal component for Football Match Tracker
// Reusable modal for confirmations and alerts

import React from 'react';

const Modal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  confirmStyle = 'danger' 
}) => {
  
  if (!isOpen) return null;

  // Determine button style based on type
  const confirmButtonClass =
    confirmStyle === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : confirmStyle === 'warning'
      ? 'bg-orange-600 hover:bg-orange-700'
      : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-700">
        {/* Title */}
        <h3 className="text-lg font-bold text-orange-500 mb-4">
          {title}
        </h3>
        
        {/* Message */}
        <div className="text-gray-300 mb-6">
          {message}
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${confirmButtonClass} text-white font-bold py-2 px-4 rounded-lg transition duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;