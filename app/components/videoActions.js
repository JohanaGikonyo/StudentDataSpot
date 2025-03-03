import axios from "axios";

const API_URL = "http://192.168.100.219:4000"; 

// Subscribe a user to another user (channel)
export const subscribeUser = async (userId, channelId) => {
  try {
    const response = await axios.post(`${API_URL}/users/${channelId}/subscribe`, {
      userId,
    });
    alert(response.data); // Show success message
  } catch (error) {
    console.error("Error subscribing:", error);
    alert("Subscription failed");
  }
};

// Unsubscribe a user from another user (channel)
export const unsubscribeUser = async (userId, channelId) => {
  try {
    const response = await axios.post(`${API_URL}/users/${channelId}/unsubscribe`, {
      userId,
    });
    alert(response.data); // Show success message
  } catch (error) {
    console.error("Error unsubscribing:", error);
    alert("Unsubscription failed");
  }
};

// Like a video
export const likeVideo = async (userId, videoId) => {
  try {
    const response = await axios.post(`${API_URL}/videos/${videoId}/like`, {
      userId,
    });
    alert(response.data); // Show success message
  } catch (error) {
    console.error("Error liking video:", error);
    alert("Error liking video", error);
  }
};

// Dislike a video
export const dislikeVideo = async (userId, videoId) => {
  try {
    const response = await axios.post(`${API_URL}/videos/${videoId}/dislike`, {
      userId,
    });
    alert(response.data); // Show success message
  } catch (error) {
    console.error("Error disliking video:", error);
    alert("Error disliking video");
  }
};
