import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useUser } from "../../store/userStore";
import axios from "axios";

const SelectedUser = () => {
  const router = useRouter();
  const { name, major, year, institution, graduationYear, phone, email, photo, id } = useLocalSearchParams();
  const { user } = useUser();
  const [connectionStatus, setConnectionStatus] = useState(null); // Add state for connection status

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/connection/check-connection/${user.id}/${id}`);
        setConnectionStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching connection status:", error.message);
      }
    };

    checkConnectionStatus();
  }, [user.id, id]);

  const renderProfileImage = (name, image) => {
    if (image) {
      return <Image source={{ uri: image }} style={styles.image} />;
    } else {
      const initials = name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
      return (
        <View style={styles.fallbackImage}>
          <Text style={styles.fallbackText}>{initials}</Text>
        </View>
      );
    }
  };

  const handleConnectionRequest = async (requesterId, targetId) => {
    try {
      const targetName = name;
      const targetEmail = email;
      const requesterName = user.name;
      const requesterEmail = user.email;
      const response = await axios.post(
        "http://localhost:3000/api/connection/connect",
        { requesterId, targetId, requesterName, targetName, targetEmail, requesterEmail },
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.data;
      Alert.alert("Success!", "Connection request sent");
      setConnectionStatus("pending"); // Update status after sending the request
    } catch (error) {
      Alert.alert("Failed!", error.message);
      console.error("Error sending connection request:", error.message);
    }
  };

  const handleMessagePress = () => {
    router.push({
      pathname: "/chatspot/Messaging",
      params: { name: name, status: "online", photo: photo },
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
        {renderProfileImage(name, photo)}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Name: {name}</Text>
          <Text style={styles.detailText}>Major: {major}</Text>
          <Text style={styles.detailText}>Institution: {institution}</Text>
          <Text style={styles.detailText}>Year: {year}</Text>
          <Text style={styles.detailText}>Graduation Year: {graduationYear}</Text>
          <Text style={styles.detailText}>Phone Number: +254{phone}</Text>
          <Text style={styles.detailText}>Email: {email}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleMessagePress}>
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          {/* Conditionally render the "Connect" button */}
          {connectionStatus !== "pending" && connectionStatus !== "accepted" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.connectButton]}
              onPress={() => handleConnectionRequest(user.id, id)}
            >
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          )}
          {/* Display status if a request is pending or connection is accepted */}

          {connectionStatus === "pending" && (
            <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
              <Text style={styles.connectStatus}>Pending </Text>
            </TouchableOpacity>
          )}
          {connectionStatus === "accepted" && (
            <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
              <Text style={styles.connectStatus}>Following</Text>{" "}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SelectedUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FA", // Soft background for the whole screen
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333", // Dark color for the name at the top
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ddd", // Light border around the image
  },
  fallbackImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF", // Blue background for initials fallback
    marginBottom: 20,
  },
  fallbackText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  detailsContainer: {
    backgroundColor: "#E0E0E0", // Greyish background for the details section
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  detailText: {
    color: "#333",
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row", // Arrange buttons horizontally
    justifyContent: "space-between",
    width: "80%", // Ensure the buttons occupy 80% of the width
    marginTop: 30,
  },
  actionButton: {
    flex: 1, // Evenly distribute button width
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10, // Spacing between the buttons
  },
  messageButton: {
    backgroundColor: "white", // White button with a border for "Message"
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  connectButton: {
    backgroundColor: "#007BFF", // Blue button for "Connect"
  },
  messageButtonText: {
    color: "#007BFF", // Blue text for the "Message" button
    fontSize: 18,
    fontWeight: "bold",
  },
  connectButtonText: {
    color: "white", // White text for the "Connect" button
    fontSize: 18,
    fontWeight: "bold",
  },
  connectStatus: {
    color: "#007BFF",
  },
});
