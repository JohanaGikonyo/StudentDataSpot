import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Appbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Function to retrieve the user ID from AsyncStorage
  const retrieveUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      return userId;
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = await retrieveUserId();  // Get user ID from storage

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
    return <Text>Loading...</Text>;  // Placeholder while data is loading
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="youtube-play" color={color} />,
          title: "Home",
          header: () => (
            <Appbar.Header style={styles.appBar}>
              <View style={styles.headerLeft}>
                <FontAwesome size={28} name="youtube-play" color="black" />
                <Text style={styles.headerLeftText}>Tutor Book</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.profileContainer} onPress={() => router.push("/profile/user")}>
                  {userProfile?.profileImage ? (
                    <Image source={{ uri: `http://192.168.43.5:3000/${userProfile.profileImage}` }} style={styles.profileImage} />
                  ) : (
                    <View style={[styles.profileImage, styles.initialsContainer]}>
                      <Text style={styles.initials}>
                        {getInitials(userProfile?.name || "Unknown User")}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.profileText}>My Profile</Text>
                </TouchableOpacity>
              </View>
            </Appbar.Header>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
  },
  headerLeftText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "black",
  },
  headerRight: {
    paddingRight: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
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
  initialsContainer: {
    backgroundColor: "#00A4EF", // Customize default color for initials
  },
  initials: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 12,
    color: "black",
    marginTop: 2,
  },
});
