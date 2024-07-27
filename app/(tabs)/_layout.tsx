import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { Link, Tabs, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";

export default function TabLayout() {
  const router = useRouter();
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
                  <FontAwesome size={28} name="user-circle" color="black" />
                  <Text style={styles.profileText}>My Profile</Text>
                </TouchableOpacity>
              </View>
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
            <Appbar.Header style={styles.appBar}>
              <Appbar.BackAction size={30} onPress={() => router.push("/(tabs)")} />
              <Appbar.Content title="Mr. Tutor" style={styles.title} />
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
            <Appbar.Header style={styles.appBar}>
              <Appbar.BackAction onPress={() => router.push("/(tabs)")} />
              <Appbar.Content title="Upload" style={styles.title} />
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
            <Appbar.Header style={styles.appBar}>
              <Appbar.Action icon="magnify" size={30} onPress={() => console.log("Search icon pressed")} />
              <Appbar.Content title="Tutorhub" style={styles.title} />
              <Appbar.Action icon="account-circle" onPress={() => router.push("/profile/user")} />
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
  headerText: {
    fontSize: 12,
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
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
  profileText: {
    fontSize: 12,
    color: "black",
    marginTop: 2,
  },
});
