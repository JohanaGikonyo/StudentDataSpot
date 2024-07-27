import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { tw } from "nativewind"; // Ensure nativewind is imported
import { Appbar, Button } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

const BookSpecs = () => {
  const router = useRouter();
  const { name, image, major, year } = useLocalSearchParams();
  const [selectedValue, setSelectedValue] = useState(null);

  const radioButtons = [
    { label: "Online", value: "online" },
    { label: "Physical", value: "physical" },
  ];

  const RadioButton = ({ label, value, selected, onSelect }) => {
    return (
      <TouchableOpacity className="flex-row items-center mb-2" onPress={() => onSelect(value)}>
        <View
          className={`h-6 w-6 rounded-full border-2 items-center justify-center mr-2 ${
            selected ? "border-green-500" : "border-gray-800"
          }`}
        >
          {selected && <View className="h-3 w-3 rounded-full bg-green-500" />}
        </View>
        <Text className="text-lg">{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text className="m-4 text-3xl font-bold">
        {name} <Text>Eric John Book Specs</Text>
      </Text>
      <Image source={{ uri: image }} style={styles.image} />

      <View className="flex flex-col gap-2 my-3">
        <Text className="text-slate-800 m-2 font-bold text-xl">Current Location</Text>
        <Button className="bg-slate-300 font-bold text-black">
          <Text className="text-slate-700 font-bold">Rongai</Text>
        </Button>
      </View>

      <View className="flex flex-col gap-2 my-3">
        <Text className="text-slate-800 m-2 font-bold text-xl">Preferred Tutor Locaton</Text>
        <Button className="bg-slate-300 font-bold text-black">
          <Text className="text-slate-700 font-bold">Maasai Lodge</Text>
        </Button>
      </View>

      <View className="flex flex-col gap-2 my-3">
        <Text className="text-slate-800 m-2 font-bold text-xl">Time When Available</Text>
        <Button className="bg-slate-300 font-bold text-black">
          <Text className="text-slate-700 font-bold">3:00 P.M</Text>
        </Button>
      </View>

      <View className="flex flex-col gap-2 my-3">
        <Text className="text-slate-800 m-2 font-bold text-xl">Preferred Tutor Fee</Text>
        <Button className="bg-slate-300 font-bold text-black">
          <Text className="text-slate-700 font-bold">200</Text>
        </Button>
      </View>
    </View>
  );
};

export default BookSpecs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
  },
});
