import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useUser } from "@/store/userStore";
const Tutorbook = () => {
  const { user } = useUser();
  const router = useRouter();
  const Fields = ["Engineering", "Physics and Applied Math", "Computer Science", "Social Sciences", "Media and Art"];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome {user.name}</Text>

        <Text style={styles.selectText}>Please Select Your Field of Learning</Text>
        {Fields.map((field, index) => (
          <TouchableOpacity
            key={index}
            style={styles.fieldButton}
            className="bg-blue-400 text-slate-100 text-2xl"
            onPress={() => router.push(`/fields/field?title=${encodeURIComponent(field)}`)}
          >
            <Text style={styles.fieldText}>{field}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Tutorbook;

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
    backgroundColor: "#9e9d9d", // Light gray background
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  fieldText: {
    fontSize: 16,
    // color: "#fff",
  },
});
