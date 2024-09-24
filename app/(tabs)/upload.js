import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import io from "socket.io-client";

const Upload = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const socket = io("http://192.168.137.91:3000"); // Adjust the URL to match your server

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to make this work!");
      }
    };
    getPermissions();

    return () => {
      socket.disconnect();
    };
  }, []);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVideo(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while picking the video.");
      console.error(error);
    }
  };

  const uploadVideo = async () => {
    if (!title || !video) {
      Alert.alert("Missing Information", "Please provide both a title and a video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", {
      uri: video,
      type: "video/mp4", // Adjust the type as needed
      name: "video.mp4",
    });

    try {
      await axios.post("http://192.168.137.91:3000/api/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Success", "Video uploaded successfully");
      setVideo(null); // Clear video after upload
      setTitle(""); // Clear title after upload

      // Emit event to update viewers
      socket.emit("newVideo", { title, videoUrl: video });
    } catch (error) {
      Alert.alert("Error", "Failed to upload video.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Video</Text>
      <TextInput style={styles.input} placeholder="Video Title" value={title} onChangeText={setTitle} />
      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Pick a Video</Text>
      </TouchableOpacity>
      {video && <Text style={styles.videoText}>Video selected</Text>}
      <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={uploadVideo}>
        <Text style={styles.buttonText}>Upload Video</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#28A745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  videoText: {
    marginBottom: 20,
    fontSize: 16,
    color: "#555",
  },
});

export default Upload;
