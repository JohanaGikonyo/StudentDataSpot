import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
import { useKeyboard } from "../../components/usekeyboard";
import { useUser } from "@/store/userStore";

export default function TabLayout() {
  const router = useRouter();
  const keyboardShown = useKeyboard();
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Assuming user is retrieved from a global state or context

  // Function to get initials from a user's name
  const getInitials = (name) => {
    if (!name) return "U"; // Fallback for missing name
    const names = name.split(" ");
    const initials = names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
    return initials.toUpperCase();
  };

  // Show loading while user data is being fetched
  useEffect(() => {
    if (user) {
      setLoading(false); // Set loading to false once user data is available
    }
  }, [user]);

  if (loading) {
    return <Text>Loading...</Text>; // Placeholder while data is loading
  }

  const renderProfileImage = () => (
    <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile/user")}>
      {user?.profileImage ? (
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      ) : (
        <View style={[styles.profileImage, styles.initialsContainer]}>
          <Text style={styles.initials} >{getInitials(user?.name || user.email)}</Text>
        </View>
      )}
      <Text style={styles.profileText}>{user?.name || "User"}</Text>
    </TouchableOpacity>
  );

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
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
            title: "Home",
            header: () => (
              <Appbar.Header style={styles.header}>
                <View style={styles.headerLeft}>
                  <FontAwesome size={28} name="youtube-play" color="black" />
                  <Text style={styles.headerTitle} >Tutor Book</Text>
                </View>
                <View style={styles.headerRight}>{renderProfileImage()}</View>
              </Appbar.Header>
            ),
          }}
        />
        <Tabs.Screen
          name="Mr. Tutor"
          options={{
            title: "Mr. Tutor",
            tabBarIcon: ({ color }) => <Feather size={28} name="message-circle" color={color} />,
            header: () => (
              <Appbar.Header style={styles.header}>
                <Appbar.BackAction size={30} onPress={() => router.push("/(tabs)")} />
                <Appbar.Content title="Mr. Tutor" titleStyle={styles.headerContentTitle} />
                {/* <Appbar.Action icon="menu" onPress={() => alert("Menu")} /> */}
                {renderProfileImage()}
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
                {renderProfileImage()}
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
                {renderProfileImage()}
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
