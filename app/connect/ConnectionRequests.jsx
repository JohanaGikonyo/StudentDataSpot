import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import axios from "axios";
import { useUser } from "../../store/userStore"; // Assuming you have a user store

const ConnectionRequests = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch the connection requests for the logged-in user
    const fetchRequests = async () => {
      try {
        const userId = user.id;
        console.log(userId);
        const response = await axios.get(`http://localhost:3000/api/connection/requests/${userId}`);
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching connection requests:", error);
      }
    };

    fetchRequests();
  }, [user.id]);

  const handleAcceptRequest = async (requestId) => {
    try {
      console.log("Accepting Id: ", requestId);
      const userId = user.id;
      const response = await axios.post(`http://localhost:3000/api/connection/accept`, { requestId, userId });
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId)); // Remove the accepted request
      console.log(response.data.message);
    } catch (error) {
      console.error("Error accepting connection request:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        Connection Requests{" "}
        <View style={styles.followerBadge}>
          <Text style={styles.followerCount}>{requests.length}</Text>
        </View>
      </Text>
      {requests.length === 0 ? (
        <Text>No pending connection requests</Text>
      ) : (
        requests.map((request) => (
          <View key={request._id} style={styles.requestCard}>
            <Image source={{ uri: request.requester.photo }} style={styles.profileImage} />
            <View style={styles.details}>
              <Text style={styles.name}>{request.requester.name}</Text>
              <Text>{request.requester.email}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRequest(request._id)}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ConnectionRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  followerBadge: {
    marginLeft: 10,
    backgroundColor: "#FF6347",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  followerCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
