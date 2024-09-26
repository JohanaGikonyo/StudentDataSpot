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
  const { user, updateUser } = useUser();
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", updatedName);
      formData.append("email", updatedEmail);
      formData.append("year", updatedYear);
      formData.append("course", updatedCourse);
      formData.append("institution", updatedInstitution); // Include institution
      formData.append("graduationYear", updatedGraduationYear); // Include graduation year
      formData.append("phone", updatedPhone); // Include phone

      if (profileImage) {
        const fileName = profileImage.split("/").pop();
        const fileType = profileImage.match(/\.\w+$/) ? profileImage.match(/\.\w+$/)[0] : "";
        formData.append("profileImage", {
          uri: profileImage,
          name: fileName,
          type: `image/${fileType.replace(".", "")}`,
        });
      }

      const token = await AsyncStorage.getItem("token");
      const response = await axios.put("http://localhost:3000/api/users/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      updateUser(response.data.user);
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
    alignItems: "center", // Center details horizontally
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
