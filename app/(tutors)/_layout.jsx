import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useKeyboard } from "../../components/usekeyboard";
import Stack from "expo-router";

export default function TutorsLayout() {
  const router = useRouter();
  const keyboardShown = useKeyboard();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      {/* <Stack.Screen name="userconnect" options={{ headerShown: false }} /> */}
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
                <Appbar.Action icon="menu" onPress={() => alert("Menu")} />
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
