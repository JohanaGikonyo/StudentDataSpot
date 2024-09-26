import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import SplashScreen from "./SplashScreen";
import RegisterForm from "./authentification/RegisterForm";
import LoginForm from "./authentification/LoginForm";
import { useUser } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export default function Home() {
  const [isAppReady, setAppReady] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const { setUser } = useUser();
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

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Check for token on app load
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token"); // Get token from AsyncStorage
      if (token) {
        // Here you can fetch user data using the token if needed
        const userData = JSON.parse(await AsyncStorage.getItem("user")); // Assuming user data is also stored in AsyncStorage
        setUser(userData); // Set user data
        setIsAuthenticated(true); // Set authenticated state
        router.push("/(tabs)"); // Redirect to the main page
      }
      setLoading(false); // Set loading to false after check
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
      <View>
        <Text>Loading...</Text>
      </View>
    ); // Optionally, show a loading screen or spinner
  }

  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginForm navigateToRegister={navigateToRegister} onLoginSuccess={handleLoginSuccess} />;
    }
    return <RegisterForm navigateToLogin={navigateToLogin} />;
  }

  // Optionally render a placeholder if necessary
  return null;
}
