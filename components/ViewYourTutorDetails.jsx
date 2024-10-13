import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
export default function ViewYourTutorDetails({ details, setPage }) {
  const router = useRouter();
  const navigation = useNavigation();

  const renderAvatar = () => {
    if (details.photo) {
      return <Image source={{ uri: details.photo }} style={styles.avatar} />;
    } else {
      const initial = details.name ? details.name.charAt(0).toUpperCase() : "T";
      const backgroundColor = "#007BFF"; // Can be dynamic based on name if needed
      return (
        <View style={[styles.avatar, { backgroundColor }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      );
    }
  };

  // Logout function with navigation and page refresh
  const handleLogout = async () => {
    try {
      // Remove the token and details from AsyncStorage
      await AsyncStorage.removeItem("Tuortoken");
      await AsyncStorage.removeItem("tutorDetails");
      router.push("/fields/tutorSetUp");
      Alert.alert("Logged out", "You have been successfully logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "There was a problem logging out. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>{renderAvatar()}</View>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>
          Name: <Text style={styles.detailText}>{details.name}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.detailText}>{details.email}</Text>
        </Text>
        <Text style={styles.label}>
          Course: <Text style={styles.detailText}>{details.course}</Text>
        </Text>
        <Text style={styles.label}>
          Institution: <Text style={styles.detailText}>{details.institution}</Text>
        </Text>
        <Text style={styles.label}>
          Graduation Year: <Text style={styles.detailText}>{details.graduationYear}</Text>
        </Text>
        <Text style={styles.label}>
          Phone: <Text style={styles.detailText}>{details.phone}</Text>
        </Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => setPage("edit")}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

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
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "start",
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
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "90%", // Adjust width for better responsiveness
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
