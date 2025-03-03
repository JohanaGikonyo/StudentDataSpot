import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

export default function Upload(params) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("AI");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Sorry, we need camera roll permissions to pick the video"
          );
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error requesting permissions:", error);
        Alert.alert("Error", "Failed to request permissions");
        return false;
      }
    }
    return true;
  };

  const pickVideo = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        allowsMultipleSelection: false,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setVideo(uri);
      } else {
        Alert.alert("Error", "No video selected.");
      }
      
    } catch (error) {
      console.error("Error while picking the video:", error);
      Alert.alert(
        "Error",
        "Failed to pick video. Please try again."
      );
    }
  };

  const handleSubmit = async () => {
    if (!video || !title || !desc || !category) {
      Alert.alert(
        "Missing information",
        "Please fill all the fields to continue..."
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add video file
      formData.append("video", {
        uri: video,
        type: "video/mp4",
        name: "video.mp4",
      }, "video");

      // Add the other form data
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("category", category);
      console.log([...formData.entries()]);


      const response = await axios.post(
        "http://localhost:3000/api/video/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Video uploaded successfully!");
        // Reset form
        setTitle("");
        setDesc("");
        setVideo(null);
        setCategory("AI");

      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload failed",
        error.response?.data?.message || "Error uploading the video. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Video</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Channel Title"
        value={title}
        onChangeText={setTitle}
      />
      
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.picker}
      >
        <Picker.Item label="AI" value="AI" />
        <Picker.Item label="Web Development" value="Web Development" />
        <Picker.Item label="Data Science" value="Data Science" />
        <Picker.Item label="Design" value="Design" />
      </Picker>
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        multiline
      />
      
      <TouchableOpacity
        style={styles.pickButton}
        onPress={pickVideo}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {video !== null? "Selected":"Select Video"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.uploadButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Uploading..." : "Upload Video"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  pickButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
