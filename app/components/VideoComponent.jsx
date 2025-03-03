import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "./timeFormatter";

const API_URL = "http://192.168.100.219:4000";
const { width, height } = Dimensions.get("window");

const VideoComponent = ({ userId, channelId, _id }) => {
  const { user } = useUser();
  const { video } = useLocalSearchParams();
  const videoData = video ? JSON.parse(video) : {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(true);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCommentsCollapsed, setIsCommentsCollapsed] = useState(false);
  const [viewCount, setViewCount] = useState(videoData.views || 0);
  const [likeCounts, setLikesCount]=useState(videoData.likes || 0)
  const [dislikeCounts, setDislikesCount]=useState(videoData.likes || 0)

  const profileImage = user.profileImage
  const name = user.name
  const subscribers=user.subscribers


  const videoRef = React.useRef(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    incrementVideoView();
  }, []);

  const loadInitialData = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Load comments
      const commentsResponse = await axios.get(`${API_URL}/api/videos/${videoData._id}/getComments`,config);
      console.log(commentsResponse.data)
      setComments("Initial comments",commentsResponse.data);

      // Check if user has liked/disliked
      const isLiked = videoData.likes?.includes(userId);
      const isDisliked = videoData.dislikes?.includes(userId);
      setIsLiked(isLiked);
      setIsDisliked(isDisliked);

      

      // Check if user is subscribed
      const userResponse = await axios.get(`${API_URL}/api/users/${userId}`);
      setIsSubscribed(userResponse.data.subscribedUsers?.includes(channelId));

    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };


  const incrementVideoView = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.put(
        `${API_URL}/api/videos/${videoData._id}/view`,
        {},
        config
      );
  
      if (response.data.success) {
        setViewCount(response.data.views);
      }
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };
  

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Add an interceptor to automatically add the token to all requests
  api.interceptors.request.use(
    async config => {
      const token = AsyncStorage.getItem('token'); // or AsyncStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  // Then your subscription handler becomes simpler:
// First, make sure you have access to the video data

const handleSubscribe = async () => {
  try {
    // Get the stored token
    const token = await AsyncStorage.getItem("auth_token");
    console.log("Retrieved token for subscription:", token);

    if (!token) {
      alert("Please login first");
      return;
    }

    // Get stored user data to verify we have it
    const userData = await AsyncStorage.getItem("user");
    const user = JSON.parse(userData);
    // console.log("Current user:", user);

    // Get the channel ID from your video data
    const channelId = user._id; // Assuming videoData contains the creator's userId
    console.log("Channel ID (creator's user ID):", channelId);

    if (!channelId) {
      console.error("Channel ID is missing");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (isSubscribed) {
      await axios.put(
        `${API_URL}/api/video/users/${channelId}/unsubscribe`,
        {},
        config
      );
      setIsSubscribed(false);
    } else {
      console.log("Making subscribe request to:", `${API_URL}/api/video/users/${channelId}/subscribe`);
      const response = await axios.put(
        `${API_URL}/api/video/users/${channelId}/subscribe`,
        {},
        config
      );
      console.log("Subscribe response:", response.data);
      setIsSubscribed(true);
    }
  } catch (error) {
    console.error("Subscription error:", error.response?.data || error);
    alert(error.response?.data?.message || "Subscription failed");
  }
};


const handleLike = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      alert("Please login first");
      return;
    }
    const videoId = videoData._id;

    if (!videoId) {
      console.error("No video ID available");
      alert("Video data not available");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    const userData = await AsyncStorage.getItem("user");
    const user = JSON.parse(userData);
    // console.log("Current user:", user);

    // Get the channel ID from your video data


    const response = await axios.put(
      `${API_URL}/api/videos/${videoData._id}/like`,
      {},
      config
    );

    if (response.data.success) {
      setIsLiked(true);
      setIsDisliked(false);
      // Update likes count from response
      setLikesCount(response.data.likes);
      setDislikesCount(response.data.likes)
    } 
  } catch (error) {
    console.error("Error liking video:", error.response?.data || error);
    alert(error.response?.data?.message || "Error liking video");
    console.log("Video ID:", videoData?._id);
    console.log("Making request to: ",      `${API_URL}/api/videos/${videoData._id}/like`,
    )

  }
};


const handleDislike = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.put(
      `${API_URL}/api/videos/${videoData._id}/dislike`,
      {},
      config
    );

    if (response.data.success) {
      setIsDisliked(true);
      setIsLiked(false);
      // Update dislikes count from response
      setDislikesCount(response.data.dislikes);
      setLikesCount(response.data.likes)
    }
  } catch (error) {
    console.error("Error disliking video:", error.response?.data || error);
    alert(error.response?.data?.message || "Error disliking video");
  }
};



const handleAddComment = async () => {
  if (newComment.trim() === "") return;

  try {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const userData = await AsyncStorage.getItem("user");
    const user = JSON.parse(userData);
    // console.log("Current user:", user);

    // Get the channel ID from your video data
    const response = await axios.post(
      `${API_URL}/api/comments/${videoData._id}/addComment`,
      {
        text: newComment
      },
      config
    );

    if (response.data.success) {
      const newCommentObj = {
        _id: response.data.comment._id,
        userId: {
          _id: user._id,
          name: user.name,
          profileImage: user.profileImage
        },
        text: newComment,
        createdAt: new Date().toISOString()
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment("");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    console.log("Making requests to:",`${API_URL}/api/comments/${channelId}/addComment`,"Channel id:",channelId )
    alert(error.response?.data?.message || "Error adding comment");
  }
};

  const handleToggleComments = () => {
    setIsCommentsCollapsed(!isCommentsCollapsed);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: videoData.videoUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="cover"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
          />
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#FF0000"
              style={styles.loadingIndicator}
            />
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.videoInfoContainer}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {videoData.title}
            </Text>
            <Text style={styles.description}>
              {videoData.desc}
            </Text>
            
            <View style={styles.engagementContainer}>
              <View style={styles.viewsAndDate}>
              <Text style={styles.viewCount}>{videoData.views} views</Text>
              <Text style={styles.dot}>•</Text>
                <Text style={styles.publishDate}>{formatTime(videoData.uploadDate)}</Text>
              </View>
              
          <View style={styles.channelSection}>
            <View style={styles.channelInfo}>
              <Image 
                source={{ uri: profileImage}}
                style={styles.channelAvatar}
              />
              <View style={styles.channelDetails}>
                <Text style={styles.channelName}>{name}</Text>
                <Text style={styles.subscriberCount}>{videoData.subscribers} subscribers</Text>
              </View>
            </View>
  <TouchableOpacity 
    style={[styles.subscribeButton, isSubscribed && styles.subscribedButton]} 
    onPress={handleSubscribe}
  >
    <Text style={[styles.subscribeText, isSubscribed && styles.subscribedText]}>
      {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
    </Text>
  </TouchableOpacity>
          </View>
              <View style={styles.reactionButtons}>
                <TouchableOpacity 
                  style={styles.reactionButton}
                  onPress={handleLike}
                >
                  <Ionicons 
                    name={"thumbs-up"} 
                    size={22} 
                    color={isLiked ? "#FF0000" : "#606060"} 
                  />
                  <Text style={[styles.reactionText, isLiked && styles.activeReaction]}>
                    {videoData.likes.length}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.reactionButton}
                  onPress={handleDislike}
                >
                  <Ionicons 
                    name={"thumbs-down"} 
                    size={22} 
                    color={isDisliked ? "#FF0000" : "#606060"} 
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.reactionButton}>
                  <Ionicons name="share-social-outline" size={24} color="#606060" />
                  <Text style={styles.reactionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>

        {/* Comments Section */}
        <View style={styles.commentHeader}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <TouchableOpacity onPress={handleToggleComments}>
            <Ionicons
              name={isCommentsCollapsed ? "chevron-down" : "chevron-up"}
              size={24}
              color="#606060"
            />
          </TouchableOpacity>
        </View>

        {!isCommentsCollapsed && (
          <>
            <View style={styles.addCommentContainer}>
              <Image
                source={{ uri: profileImage }}
                style={styles.commentAvatar}
              />
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#888"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                style={[
                  styles.postButton,
                  newComment.length > 0 && styles.activePostButton,
                ]}
                onPress={handleAddComment}
                disabled={newComment.length === 0}
              >
                <Text
                  style={[
                    styles.postButtonText,
                    newComment.length > 0 && styles.activePostButtonText,
                  ]}
                >
                  Post
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={comments}
              scrollEnabled={false}
              keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{item.author}</Text>
                      <Text style={styles.commentTime}>{item.timeAgo}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentAction}>
                        <Ionicons name="thumbs-up" size={16} color="#606060" />
                        <Text style={styles.commentActionText}>{item.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentAction}>
                        <Ionicons name="thumbs-down" size={16} color="#606060" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentAction}>
                        <Text style={styles.replyButton}>REPLY</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </>
        )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  videoWrapper: {
    width: width,
    height: width * (9/16),
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  contentContainer: {
    padding: 12,
  },
  videoInfoContainer: {
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 18,
    color: "#030303",
    fontWeight: "bold",
    marginBottom: 8,
  },
  engagementContainer: {
    marginTop: 8,
  },
  viewsAndDate: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  viewCount: {
    color: "#606060",
    fontSize: 14,
  },
  dot: {
    color: "#606060",
    marginHorizontal: 4,
  },
  publishDate: {
    color: "#606060",
    fontSize: 14,
  },
  reactionButtons: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 8,
  },
  reactionText: {
    color: "#606060",
    marginLeft: 6,
    fontSize: 14,
  },
  activeReaction: {
    color: "#FF0000",
  },
  channelSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  channelInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    color: "#030303",
    fontSize: 16,
    fontWeight: "bold",
  },
  subscriberCount: {
    color: "#606060",
    fontSize: 14,
    marginTop: 2,
  },
  subscribeButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  descriptionContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  description: {
    color: "#030303",
    fontSize: 14,
    lineHeight: 20,
  },
  commentsSection: {
    marginTop: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  commentsTitle: {
    color: "#030303",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  commentCount: {
    color: "#606060",
    fontSize: 14,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    color: "#030303",
    fontSize: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  postButton: {
    marginLeft: 12,
    padding: 8,
    opacity: 0.5,
  },
  activePostButton: {
    opacity: 1,
  },
  postButtonText: {
    color: "#606060",
    fontSize: 14,
    fontWeight: "bold",
  },
  activePostButtonText: {
    color: "#065FD4",
  },
  comment: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    color: "#030303",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  commentTime: {
    color: "#606060",
    fontSize: 12,
  },
  commentText: {
    color: "#030303",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentActionText: {
    color: "#606060",
    fontSize: 12,
    marginLeft: 4,
  },
  replyButton: {
    color: "#606060",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default VideoComponent;