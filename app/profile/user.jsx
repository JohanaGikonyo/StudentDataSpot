import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // For picking profile images
import axios from "redaxios"; // Axios alternative for HTTP requests

const Profile = () => {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(user.name);
  const [updatedEmail, setUpdatedEmail] = useState(user.email);
  const [updatedYear, setUpdatedYear] = useState(user.year);
  const [updatedCourse, setUpdatedCourse] = useState(user.course);
  const [updatedInstitution, setUpdatedInstitution] = useState(user.institution); // New field
  const [updatedGraduationYear, setUpdatedGraduationYear] = useState(user.graduationYear); // New field
  const [updatedPhone, setUpdatedPhone] = useState(user.phone); // New field
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true, // Ensure base64 is included in the response
      });

      if (!response.canceled) {
        // Access the first item in the assets array to get the URI
        const asset = response.assets ? response.assets[0] : null;

        if (asset) {
          const base64Image = `data:${asset.mimeType};base64,${asset.base64}`; // Create a base64 string
          setProfileImage(base64Image); // Store base64 image string
        } else {
          console.log("No assets found in the response");
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      // Append the profile details
      formData.append("name", updatedName);
      formData.append("email", updatedEmail);
      formData.append("year", updatedYear);
      formData.append("course", updatedCourse);
      formData.append("institution", updatedInstitution);
      formData.append("graduationYear", updatedGraduationYear);
      formData.append("phone", updatedPhone);
      formData.append("photo", profileImage);

      // Log each key/value pair for verification
      for (let pair of formData.entries()) {
        console.log(`am sending this data ${pair[0]}: ${pair[1]}`);
      }
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(`http://192.168.137.201:3000/api/users/updateProfile/${user.id}`, formData, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      console.log(response.data.user);

      setIsEditing(false);
      Alert.alert("Profile updated", "Your profile has been updated successfully.");
      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.push("/");
  };

  const renderAvatar = () => {
    if (profileImage) {
      return <Image source={{ uri: profileImage }} style={styles.avatar} />;
    } else {
      const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
      const backgroundColor = "#007BFF"; // You can generate a dynamic color here
      return (
        <View style={[styles.avatar, { backgroundColor }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>{renderAvatar()}</TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : isEditing ? (
        <View style={styles.formContainer}>
          <TextInput style={styles.input} value={updatedName} onChangeText={setUpdatedName} placeholder="Name" />
          <TextInput
            style={styles.input}
            value={updatedEmail}
            onChangeText={setUpdatedEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
          <TextInput style={styles.input} value={updatedYear} onChangeText={setUpdatedYear} placeholder="Year" />
          <TextInput style={styles.input} value={updatedCourse} onChangeText={setUpdatedCourse} placeholder="Course" />
          <TextInput
            style={styles.input}
            value={updatedInstitution}
            onChangeText={setUpdatedInstitution}
            placeholder="Institution"
          />
          <TextInput
            style={styles.input}
            value={updatedGraduationYear}
            onChangeText={setUpdatedGraduationYear}
            placeholder="Graduation Year"
          />
          <TextInput
            style={styles.input}
            value={updatedPhone}
            onChangeText={setUpdatedPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>
            Name: <Text style={styles.detailText}>{user.name}</Text>
          </Text>
          <Text style={styles.label}>
            Email: <Text style={styles.detailText}>{user.email}</Text>
          </Text>
          <Text style={styles.label}>
            Year: <Text style={styles.detailText}>{user.year}</Text>
          </Text>
          <Text style={styles.label}>
            Course: <Text style={styles.detailText}>{user.course}</Text>
          </Text>
          <Text style={styles.label}>
            Institution: <Text style={styles.detailText}>{user.institution}</Text>
          </Text>
          <Text style={styles.label}>
            Graduation Year: <Text style={styles.detailText}>{user.graduationYear}</Text>
          </Text>
          <Text style={styles.label}>
            Phone: <Text style={styles.detailText}>{user.phone}</Text>
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.editButtonText}>{isEditing ? "Cancel" : "Edit Profile"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
    alignItems: "center", // Center form fields horizontally
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "90%", // Adjust width for better responsiveness
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "start", // Center details horizontally
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    width: "90%", // Adjust width for better responsiveness
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    width: "90%", // Adjust width for better responsiveness
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ee6161",
    marginTop: 10,
    width: "90%", // Adjust width for better responsiveness
  },
  logoutButtonText: {
    color: "#ee6161",
    fontSize: 16,
  },
  loading: {
    marginVertical: 20,
  },
});

export default Profile;
