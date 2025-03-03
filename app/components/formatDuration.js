// Format seconds into YouTube-style duration string (HH:MM:SS or MM:SS)

export const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    // Convert to integer
    seconds = Math.floor(seconds);
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    // Handle hours if present
    if (hours > 0) {
      return `${hours}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
    }
    
    // Just minutes and seconds
    return `${minutes}:${padZero(remainingSeconds)}`;
  };
  
  // Helper function to pad single digits with leading zero
  const padZero = (num) => {
    return num.toString().padStart(2, '0');
  };
  
  // Example usage:
  // formatDuration(62)  -> "1:02"
  // formatDuration(3661) -> "1:01:01"
  // formatDuration(45) -> "0:45"
  // formatDuration(0) -> "0:00"