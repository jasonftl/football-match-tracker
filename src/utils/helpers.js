// Helper functions for Football Match Tracker

/**
 * Format seconds as MM:SS
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
 * @param {string} timerValue - Timer value in MM:SS format
 * @param {string} period - Period code
 * @param {number} periodLength - Length of each period in minutes
 * @returns {number} Match minute (1-indexed)
 */
export const calculateMatchMinute = (timerValue, period, periodLength) => {
  const timeParts = timerValue.split(':');
  const minutes = parseInt(timeParts[0]);
  const seconds = parseInt(timeParts[1]);
  const elapsedSeconds = (minutes * 60) + seconds;
  const periodMinute = elapsedSeconds > 0 ? Math.floor(elapsedSeconds / 60) + 1 : 1;

  let previousMinutes = 0;
  if (period === 'Q2') previousMinutes = periodLength;
  else if (period === 'Q3') previousMinutes = periodLength * 2;
  else if (period === 'Q4') previousMinutes = periodLength * 3;
  else if (period === 'H2') previousMinutes = periodLength;

  let matchMinute = previousMinutes + periodMinute;
  const maxMinuteForPeriod = previousMinutes + periodLength;
  if (matchMinute > maxMinuteForPeriod) {
    matchMinute = maxMinuteForPeriod;
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
