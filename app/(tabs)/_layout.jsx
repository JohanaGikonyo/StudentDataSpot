import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useKeyboard } from "../../components/usekeyboard";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function TabLayout() {
  const router = useRouter();
  const keyboardShown = useKeyboard();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Function to retrieve the user ID from AsyncStorage
  const retrieveUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("@user_id");
      return userId;
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = await retrieveUserId(); // Get user ID from storage

      if (!userId) {
        console.error("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://192.168.43.5:3000/api/user/profile/${userId}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to get initials from a user's name
  const getInitials = (name) => {
    if (!name) return "U"; // Fallback for missing name
    const names = name.split(" ");
    const initials = names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
    return initials.toUpperCase();
  };

  if (loading) {
    return <Text>Loading...</Text>; // Placeholder while data is loading
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            display: keyboardShown ? "none" : "flex", // Hide tabs when keyboard is shown
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />, // Change to home icon
            title: "Home",
            header: () => (
              <Appbar.Header style={styles.header}>
                <View style={styles.headerLeft}>
                  <FontAwesome size={28} name="youtube-play" color="black" />
                  <Text style={styles.headerTitle}>Tutor Book</Text>
                </View>
                <View style={styles.headerRight}>
                  <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile/user")}>
                    {userProfile?.profileImage ? (
                      <Image
                        source={{ uri: `http://192.168.43.5:3000/${userProfile.profileImage}` }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <View style={[styles.profileImage, styles.initialsContainer]}>
                        <Text style={styles.initials}>{getInitials(userProfile?.name || "Unknown User")}</Text>
                      </View>
                    )}
                    <Text style={styles.profileText}>My Profile</Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.headerRight}>
                  <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile/user")}>
                    <FontAwesome size={28} name="user-circle" color="black" />
                    <Text style={styles.profileText}>My Profile</Text>
                  </TouchableOpacity>
                </View> */}
              </Appbar.Header>
            ),
          }}
        />
        <Tabs.Screen
          name="Mr. Tutor"
          options={{
            title: "Mr. Tutor",
            tabBarIcon: ({ color }) => <AntDesign size={28} name="message1" color={color} />,
            header: () => (
              <Appbar.Header style={styles.header}>
                <Appbar.BackAction size={30} onPress={() => router.push("/(tabs)")} />
                <Appbar.Content title="Mr. Tutor" titleStyle={styles.headerContentTitle} />
                <Appbar.Action icon="menu" onPress={() => alert("Menu")} />
              </Appbar.Header>
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
            header: () => (
              <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => router.push("/(tabs)")} />
                <Appbar.Content title="Upload" titleStyle={styles.headerContentTitle} />
                <Appbar.Action icon="account-circle" onPress={() => router.push("/profile/user")} />
              </Appbar.Header>
            ),
          }}
        />
        <Tabs.Screen
          name="tutorhub"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome5 name="rocketchat" size={24} color={color} />,
            header: () => (
              <Appbar.Header style={styles.header}>
                <Appbar.Action icon="magnify" size={30} onPress={() => console.log("Search icon pressed")} />
                <Appbar.Content title="TutorHub" titleStyle={styles.headerContentTitle} />
                <Appbar.Action icon="account-circle" onPress={() => router.push("/profile/user")} />
              </Appbar.Header>
            ),
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
    color: "black",
  },
  headerRight: {
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc", // Placeholder background color
  },
  profileText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "black",
    marginTop: 4,
  },
  headerContentTitle: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "800",
    color: "black",
  },
});
