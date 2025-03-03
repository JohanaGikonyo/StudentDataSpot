import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import VideoThumbnail from "./VideoThumbnail";
import VideoComponent from "./VideoComponent";
import { fetchVideos } from "../api/backendApi"; // API to fetch videos

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Fetch videos when the component is mounted
    const getVideos = async () => {
      const videosData = await fetchVideos();
      setVideos(videosData);
    };

    getVideos();
  }, []);

  const handleThumbnailPress = (video) => {
    setSelectedVideo(video); // Set the selected video when the thumbnail is clicked
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.thumbnailContainer}>
        {/* Render video thumbnails */}
        {videos.map((video) => (
          <VideoThumbnail key={video._id} video={video} onThumbnailPress={handleThumbnailPress} />
        ))}
      </ScrollView>

      {selectedVideo && (
        <VideoComponent
          video={selectedVideo}
          fetchVideos={getVideos} // Pass the fetchVideos function if needed
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  thumbnailContainer: {
    marginBottom: 20,
  },
});

export default VideoGallery;
