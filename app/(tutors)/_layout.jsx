import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useKeyboard } from "../../components/usekeyboard";
import { useUser } from "../../store/userStore";
export default function TutorsLayout() {
  const { user } = useUser();
  const router = useRouter();
  const keyboardShown = useKeyboard();

  // Function to get initials from a user's name
  const getInitials = (name) => {
    if (!name) return "U"; // Fallback for missing name
    const names = name.split(" ");
    const initials = names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
    return initials.toUpperCase();
  };

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
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="userconnect"
          options={{
            tabBarIcon: () => null,
            tabBarLabel: () => null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="ChatSpot"
          options={{
            title: "ChatSpot",
            tabBarIcon: ({ color }) => <AntDesign size={28} name="message1" color={color} />,
            header: () => (
              <Appbar.Header style={styles.header}>
                <Appbar.BackAction size={30} onPress={() => router.push("/(tabs)")} />
                <Appbar.Content title="Chat Spot" titleStyle={styles.headerContentTitle} />
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile/user")}>
                  {user?.profileImage ? (
                    <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={[styles.profileImage, styles.initialsContainer]}></View>
                  )}
                </TouchableOpacity>
              </Appbar.Header>
            ),
          }}
        />
        <Tabs.Screen
          name="videochat"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="camera" color={color} />,
            header: () => (
              <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => router.push("/(tabs)")} />
                <Appbar.Content title="Video Chat" titleStyle={styles.headerContentTitle} />
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile/user")}>
                  {user?.profileImage ? (
                    <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={[styles.profileImage, styles.initialsContainer]}>
                      <Text style={styles.initials}>{getInitials(user?.name || user.email)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
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
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile/user")}>
                  {user?.profileImage ? (
                    <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={[styles.profileImage, styles.initialsContainer]}></View>
                  )}
                </TouchableOpacity>
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
  profileButton: {
    alignItems: "center",
    flexDirection: "row", // Ensure the text aligns properly with the image
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
    marginLeft: 8, // Added margin to separate text from the image
    marginTop: 4,
  },
  headerContentTitle: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "800",
    color: "black",
  },
});
