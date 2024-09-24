import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Appbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

const SelectedUser = () => {
  const { name, image, major, year } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Name: {name}</Text>
        <Text style={styles.detailText}>Major: {major}</Text>
        <Text style={styles.detailText}>Institution: Multimedia University of Kenya</Text>
        <Text style={styles.detailText}>Year: {year}</Text>
        <Text style={styles.detailText}>Graduation Date: December 2027</Text>
        <Text style={styles.detailText}>Phone Number: +25478545664</Text>
        <Text style={styles.detailText}>Email: tutor@gmail.com</Text>
      </View>

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
  );
};

export default SelectedUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  detailText: {
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  connectButton: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
