// utils/timeFormatter.js
export const formatTime = (timestamp) => {
    // Convert ISO 8601 string to Date object
    const now = new Date();
    const videoDate = new Date(timestamp); // This directly parses the ISO string
    const diffInSeconds = Math.floor((now - videoDate) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000); // 30 days in seconds
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
  };
  