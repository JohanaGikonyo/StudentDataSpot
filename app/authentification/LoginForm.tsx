import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Card, Paragraph, Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const LoginForm = ({ navigateToRegister }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    // Login here
  };

  const handleForgotPassword = () => {
    // Password logic here
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigateToRegister} />
        <Appbar.Content title="TutorBook" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="menu" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.horizontalLine} />

      <ScrollView>
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
                  Forgot Password?{" "}
                  <Text style={{ color: "green" }}>Click Here</Text>
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
              >
                Login
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
    marginLeft:10,
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
