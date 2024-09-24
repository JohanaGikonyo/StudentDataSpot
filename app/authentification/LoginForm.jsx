import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput, Button, Card, Paragraph, Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const LoginForm = ({ navigateToForgotPassword, navigateToRegister, onLoginSuccess }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // Start loading
    try {
      //below use your computer's ip address not the localhost
      const response = await fetch("http://192.168.137.91:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setMessage(errorMessage);
        return;
      }

      const data = await response.json();
      const { token } = data;

      console.log("Token:", token);
      // Handle the token (e.g., save it to AsyncStorage or navigate to another screen)
      setMessage("Login successful!");

      onLoginSuccess(); // Indicate successful login

      // Navigate to the main page
      navigation.navigate("(tabs)");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Error logging in. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await fetch("http://192.168.137.91:3000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigateToRegister} />
        <Appbar.Content title="TutorBook" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="menu" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.horizontalLine} />

      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Login</Text>

            <Text style={styles.label}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 20 }}
              autoCapitalize="none"
              keyboardType="email-address"
              outlineStyle={{ borderWidth: 0 }}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />
            <Paragraph style={styles.errorMessage}>{message}</Paragraph>
            <View style={{ alignItems: "flex-start" }}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>
                  Forgot Password? <Text style={{ color: "green" }}>Click Here</Text>
                </Text>
              </TouchableOpacity>

              <Button
                mode="text"
                onPress={navigateToRegister}
                // style={styles.registerButton}
              >
                Don't have an account? Register
              </Button>
            </View>
            <View style={{ alignItems: "center" }}>
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                disabled={loading} // Disable button while loading
              >
                {loading ? <ActivityIndicator color="#2337e6" /> : "Login"}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appBarTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  card: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
    height: 40,
    backgroundColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  forgotPassword: {
    // textAlign: "center",
    marginLeft: 10,
    marginTop: 10,
    textDecorationLine: "none",
  },
  registerButton: {
    // textAlign: "center",
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginForm;
