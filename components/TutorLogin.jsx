import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
export default function TutorLogin({ setPage }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSetPage = () => {
    setPage("profile");
  };
  const handleSignIn = async ({ setPage }) => {
    // Add your sign-in logic here
    try {
      const response = await axios.post(
        "http://localhost:3000/api/tutors/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setMessage("Login successful!");
        const { Tutortoken, tutorDetails } = response.data;
        await AsyncStorage.setItem("Tutortoken", Tutortoken);
        await AsyncStorage.setItem("tutorDetails", JSON.stringify(tutorDetails));
        Alert.alert("Notice!", message);
        handleSetPage();
        router.push("/fields/tutorSetUp");
      } else {
        setMessage("Failed to SignIn. Try to SignUp");
        Alert.alert(message);
      }
    } catch (error) {
      setMessage("Something went wrong! Please try again.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Login</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={() => setPage("create")}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // backgroundColor: "#cfcbcb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  signUpButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signUpButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "#007BFF",
  },
});
