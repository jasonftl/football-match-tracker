// Date: 2025-10-05
// Main entry point for Football Match Tracker

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA updates
const updateSW = registerSW({
  onNeedRefresh() {
    // Dispatch custom event to notify React components that update is available
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: { updateSW }
    }));
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

// Create root and render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);