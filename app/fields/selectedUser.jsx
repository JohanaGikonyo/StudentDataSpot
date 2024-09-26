import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const SelectedUser = () => {
  const { name, image, major, year, institution, graduationYear, phone, email } = useLocalSearchParams();

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

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Name at the top */}
        <Text style={styles.name}>{name}</Text>
        {/* Profile Image */}
        {renderProfileImage(name, image)}
        {/* User Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Name: {name}</Text>
          <Text style={styles.detailText}>Major: {major}</Text>
          <Text style={styles.detailText}>Institution: {institution}</Text>
          <Text style={styles.detailText}>Year: {year}</Text>
          <Text style={styles.detailText}>Graduation Year: {graduationYear}</Text>
          <Text style={styles.detailText}>Phone Number: +254{phone}</Text>
          <Text style={styles.detailText}>Email: {email}</Text>
        </View>
        {/* Connect Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => {
              /* Handle booking logic here */
            }}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
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
    alignItems: "center",
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
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  connectButton: {
    padding: 15,
    backgroundColor: "#007BFF", // Blue button color for Connect
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  connectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
