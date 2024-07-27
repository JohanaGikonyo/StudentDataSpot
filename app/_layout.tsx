import React from "react";
import { Stack, useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
import { TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Layout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="fields/field" options={{ headerShown: false }} />
      <Stack.Screen name="fields/tutors" options={{ headerShown: false }} />
      <Stack.Screen name="fields/tutorSetUp" options={{ headerShown: false, header: () => <Appbar.BackAction /> }} />
      <Stack.Screen
        name="fields/bookSpecs"
        options={{
          header: ({ navigation, route }) => (
            <Appbar.Header className="">
              <Appbar.BackAction onPress={() => navigation.goBack()} />
              <Appbar.Content title="Book Specs" className="font-bold" />
            </Appbar.Header>
          ),
        }}
      />

      <Stack.Screen
        name="fields/selectedTutor"
        options={{
          header: ({ navigation, route }) => (
            <Appbar.Header className="flex justify-between">
              <Appbar.BackAction onPress={() => navigation.goBack()} />

              <TouchableOpacity onPress={() => router.push("/fields/bookSpecs")} className="flex-col items-center">
                <FontAwesome size={28} name="user-circle" color="black" />
                <Text className="ml-2 font-bold">Book Specs</Text>
              </TouchableOpacity>
            </Appbar.Header>
          ),
        }}
      />
    </Stack>
  );
}
