import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const TutorHub = () => {
  const router = useRouter();
  const Fields = ["Engineering", "Physics and Applied Math", "Computer Science", "Social Sciences", "Media and Art"];

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome User</Text>
      <Text style={styles.selectText}>Please Select Your Field of Learning</Text>
      {Fields.map((field, index) => (
        <TouchableOpacity
          key={index}
          style={styles.fieldButton}
          onPress={() => router.push(`/fields/field?title=${encodeURIComponent(field)}`)}
          accessibilityLabel={`Select ${field}`}
          accessibilityRole="button"
          activeOpacity={0.8} // Provide feedback on press
        >
          <Text style={styles.fieldText}>{field}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TutorHub;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selectText: {
    fontSize: 18,
    marginBottom: 20,
  },
  fieldButton: {
    backgroundColor: "#4A90E2", // A brighter blue for better visibility
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  fieldText: {
    fontSize: 16,
    color: "#fff",
  },
});
