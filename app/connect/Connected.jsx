import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useUser } from "../../store/userStore";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Connected() {
  const router = useRouter();
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Get the current logged-in user
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user

  useEffect(() => {
    const userId = user.id;

    const fetchAcceptedUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/connection/accepted/${userId}`);
        setAcceptedUsers(response.data.followers);
      } catch (error) {
        console.error("Error fetching accepted users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedUsers();
  }, [user.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading please wait...</Text>
      </View>
    );
  }

  // Function to open modal with selected user details
  const handleUserPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleMessage = (selectedUser) => {
    setModalVisible(false);

    router.push({
      pathname: "/chatspot/Messaging",
      params: { name: selectedUser.name, status: "online", photo: selectedUser.photo },
    });
  };

  // Render each accepted user
  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleUserPress(item)}>
      <Image source={{ uri: item.photo }} style={styles.profileImage} />
      <View>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <View style={styles.container}>
      {/* Header with follower count */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Connections</Text>
        <View style={styles.followerBadge}>
          <Text style={styles.followerCount}>{acceptedUsers.length}</Text>
        </View>
      </View>

      {acceptedUsers.length > 0 ? (
        <FlatList
          data={acceptedUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          contentContainerStyle={styles.userList}
        />
      ) : (
        <Text>No accepted connections yet.</Text>
      )}

      {/* Modal for displaying user details */}
      {selectedUser && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeader}>{selectedUser.name}</Text>
                  <Image source={{ uri: selectedUser.photo }} style={styles.modalImage} />

                  <Text style={styles.modalDetail}>Email: {selectedUser.email}</Text>
                  <Text style={styles.modalDetail}>Phone: {selectedUser.phone}</Text>
                  <Text style={styles.modalDetail}>Institution: {selectedUser.institution}</Text>
                  <Text style={styles.modalDetail}>Course: {selectedUser.course}</Text>

                  <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => {
                      handleMessage(selectedUser);
                    }}
                  >
                    <Text style={styles.messageButtonText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    // textAlign: "center",
    color: "#0e1cdf",
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userList: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  messageButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#0e1cdf",
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  messageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
