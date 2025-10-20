// Helper functions for Football Match Tracker

/**
 * Format seconds as HH:MM:SS
 * @param {number} seconds - Total seconds
 * @param {boolean} useHours - If false, format as MM:SS with minutes exceeding 60 (default: true)
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds, useHours = true) => {
  if (useHours) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    // Format as MM:SS where minutes can exceed 60
    const totalMinutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${totalMinutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

/**
 * Get display name for a period
 * @param {string} period - Period code (Q1, Q2, H1, H2, P1, etc.)
 * @returns {string} Display name
 */
export const getPeriodDisplayName = (period) => {
  if (period.startsWith('Q')) {
    return `Quarter ${period.substring(1)}`;
  } else if (period.startsWith('H')) {
    return `Half ${period.substring(1)}`;
  } else if (period.startsWith('P')) {
    return `Period ${period.substring(1)}`;
  }
  return period;
};

/**
 * Get cumulative time display for timer
 * @param {string} currentPeriod - Current period code
 * @param {number} elapsedTime - Elapsed seconds in current period
 * @param {number} periodLength - Length of each period in minutes
 * @returns {string} Formatted cumulative time
 */
export const getCumulativeTime = (currentPeriod, elapsedTime, periodLength) => {
  let previousMinutes = 0;

  if (currentPeriod === 'Q2') previousMinutes = periodLength;
  else if (currentPeriod === 'Q3') previousMinutes = periodLength * 2;
  else if (currentPeriod === 'Q4') previousMinutes = periodLength * 3;
  else if (currentPeriod === 'H2') previousMinutes = periodLength;

  const totalSeconds = (previousMinutes * 60) + elapsedTime;
  return formatTime(totalSeconds);
};

/**
 * Calculate match minute from timer value and period
 * @param {string} timerValue - Timer value in HH:MM:SS format (cumulative time)
 * @param {string} period - Period code
 * @param {number} periodLength - Length of each period in minutes
 * @returns {number} Match minute (1-indexed)
 */
export const calculateMatchMinute = (timerValue, period, periodLength) => {
  const timeParts = timerValue.split(':');
  const hours = parseInt(timeParts[0]) || 0;
  const minutes = parseInt(timeParts[1]) || 0;
  const seconds = parseInt(timeParts[2]) || 0;
  const elapsedSeconds = (hours * 3600) + (minutes * 60) + seconds;

  // Calculate match minute directly from cumulative time (timerValue is already cumulative)
  const matchMinute = elapsedSeconds > 0 ? Math.floor(elapsedSeconds / 60) + 1 : 1;

  // Calculate maximum minute for the period to cap overtime goals
  let previousMinutes = 0;
  if (period === 'Q2') previousMinutes = periodLength;
  else if (period === 'Q3') previousMinutes = periodLength * 2;
  else if (period === 'Q4') previousMinutes = periodLength * 3;
  else if (period === 'H2') previousMinutes = periodLength;

  const maxMinuteForPeriod = previousMinutes + periodLength;

  // Cap at period end time if in overtime
  if (matchMinute > maxMinuteForPeriod) {
    return maxMinuteForPeriod;
  }

  return matchMinute;
};

/**
 * Get current timestamp in HH:MM:SS format
 * @returns {string} Current time
 */
export const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

/**
 * Get current date in ddd dd/mmm/yyyy format
 * @returns {string} Current date (e.g., "Mon 20/Jan/2025")
 */
export const getCurrentDate = () => {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[now.getDay()];
  const day = now.getDate().toString().padStart(2, '0');
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  return `${dayName} ${day}/${month}/${year}`;
};

/**
 * Calculate elapsed seconds from a real-time timestamp to now
 * @param {number} startTimestamp - Start time in milliseconds (from Date.now())
 * @returns {number} Elapsed seconds
 */
export const getElapsedSeconds = (startTimestamp) => {
  if (!startTimestamp) return 0;
  return Math.floor((Date.now() - startTimestamp) / 1000);
};

/**
 * Get cumulative elapsed time for display including previous periods
 * @param {string} currentPeriod - Current period code
 * @param {number} periodStartTimestamp - When current period started (milliseconds)
 * @param {number} periodLength - Length of each period in minutes
 * @returns {string} Formatted cumulative time MM:SS (minutes can exceed 60)
 */
export const getCumulativeTimeFromRealTime = (currentPeriod, periodStartTimestamp, periodLength) => {
  let previousMinutes = 0;

  if (currentPeriod === 'Q2') previousMinutes = periodLength;
  else if (currentPeriod === 'Q3') previousMinutes = periodLength * 2;
  else if (currentPeriod === 'Q4') previousMinutes = periodLength * 3;
  else if (currentPeriod === 'H2') previousMinutes = periodLength;

  const elapsedSeconds = getElapsedSeconds(periodStartTimestamp);
  const totalSeconds = (previousMinutes * 60) + elapsedSeconds;

  return formatTime(totalSeconds, false); // Use MM:SS format (useHours = false)
};

/**
 * Get list of periods based on format
 * @param {boolean} useQuarters - Whether to use quarters (true) or halves (false)
 * @param {number} customPeriods - Optional custom number of periods (1, 2, or 4)
 * @returns {string[]} Array of period codes
 */
export const getPeriods = (useQuarters, customPeriods = null) => {
  // If custom periods specified, use that
  if (customPeriods !== null) {
    if (customPeriods === 1) return ['P1'];
    if (customPeriods === 2) return ['H1', 'H2'];
    if (customPeriods === 4) return ['Q1', 'Q2', 'Q3', 'Q4'];
  }
  // Otherwise use the boolean flag
  return useQuarters ? ['Q1', 'Q2', 'Q3', 'Q4'] : ['H1', 'H2'];
};
