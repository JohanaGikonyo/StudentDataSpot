import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import SplashScreen from "./SplashScreen";
import RegisterForm from "./authentification/RegisterForm";
import LoginForm from "./authentification/LoginForm";
import { useUser, useFollowers, usePending } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import "../global.css"
export default function Home() {
  const [isAppReady, setAppReady] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const { setUser, user } = useUser();
  const { setFollowers } = useFollowers();
  const { setPending } = usePending();
  const router = useRouter(); // Initialize useRouter for navigation

  const handleSplashScreenFinish = () => {
    setAppReady(true);
  };

  const navigateToLogin = () => {
    setShowLogin(true);
  };

  const navigateToRegister = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = async (userData, token) => {
    try {
      // Save the token and user data to AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      setUser(JSON.parse(userData)); // Set user data in the app's state/store
      setIsAuthenticated(true); // Set the authenticated state

      // Redirect to the main tabs screen
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error saving login data:", error);
    }
  };

  // Check for token on app load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Get token from AsyncStorage
        if (token) {
          const userData = await AsyncStorage.getItem("user"); // Assuming user data is also stored in AsyncStorage
          await setUser(JSON.parse(userData)); // Set user data
          setIsAuthenticated(true); // Set authenticated state
          router.push("/(tabs)"); // Redirect to the main page
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setLoading(false); // Set loading to false after the token check
      }
    };

    if (isAppReady) {
      checkToken(); // Check token once the app is ready
    }
  }, [isAppReady, setUser, router]); // Dependency array

  if (!isAppReady) {
    return <SplashScreen onFinish={handleSplashScreenFinish} />;
  }

  // Show a loading indicator while checking for authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return showLogin ? (
      <LoginForm navigateToRegister={navigateToRegister} onLoginSuccess={handleLoginSuccess} />
    ) : (
      <RegisterForm navigateToLogin={navigateToLogin} />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ff6347",
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});
