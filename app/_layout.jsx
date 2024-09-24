import React from "react";
import { Stack, useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Layout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(tutors)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="fields/field" options={{ headerShown: false }} />
      <Stack.Screen
        name="fields/tutorSetUp"
        options={{
          headerShown: false,
          header: () => <Appbar.BackAction />,
        }}
      />
      <Stack.Screen
        name="fields/bookSpecs"
        options={{
          header: ({ navigation }) => (
            <Appbar.Header style={styles.header}>
              <Appbar.BackAction onPress={() => navigation.goBack()} />
              <Appbar.Content title="Book Specs" titleStyle={styles.title} />
            </Appbar.Header>
          ),
        }}
      />
      <Stack.Screen
        name="fields/selectedTutor"
        options={{
          header: ({ navigation }) => (
            <Appbar.Header style={styles.header}>
              <Appbar.BackAction onPress={() => navigation.goBack()} />
              <TouchableOpacity onPress={() => router.push("/fields/bookSpecs")} style={styles.button}>
                <FontAwesome size={28} name="user-circle" color="black" />
                <Text style={styles.buttonText}>Book Specs</Text>
              </TouchableOpacity>
            </Appbar.Header>
          ),
        }}
      />
      <Stack.Screen
        name="fields/selectedUser"
        options={{
          header: ({ navigation }) => (
            <Appbar.Header style={styles.header}>
              <Appbar.BackAction onPress={() => navigation.goBack()} />
            </Appbar.Header>
          ),
        }}
      />
      <Stack.Screen
        name="profile/user"
        options={{
          header: ({ navigation }) => (
            <Appbar.Header style={styles.header}>
              <Appbar.BackAction onPress={() => navigation.goBack()} />
              <Appbar.Content title="My Profile" titleStyle={styles.title} />
            </Appbar.Header>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 8,
    fontWeight: "bold",
  },
});
