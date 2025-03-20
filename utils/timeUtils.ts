/**
 * Format time in seconds to MM:SS format
 * @param timeInSeconds Time in seconds to format
 * @returns Formatted time string in MM:SS format
 */
export const formatTime = (timeInSeconds: number): string => {
  if (!timeInSeconds || isNaN(timeInSeconds)) {
    return '0:00';
  }
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}; 