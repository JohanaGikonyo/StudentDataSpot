import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Appbar, Title } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const Tutorbook = () => {
  const router = useRouter();
  const { topic } = useLocalSearchParams();
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const profiles = [
    {
      name: "Eric Andrew",
      major: "Solid Mechanics",
      year: "Year 2",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Andy Man",
      major: "Solid Mechanics",
      year: "Year 4",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "Erica Singh",
      major: "Solid Mechanics",
      year: "Year 5",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
    },
  ];

  const rated = [
    {
      name: "Eric John",
      major: "Solid Mechanics",
      year: "Year 3",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
      name: "Julia Miles",
      major: "Solid Mechanics",
      year: "Year 4",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    {
      name: "Erica Jack",
      major: "Solid Mechanics",
      year: "Year 5",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
    },
  ];

  const filteredProfiles = profiles.filter((profile) => profile.major === topic);
  const filteredRated = rated.filter((profile) => profile.major === topic);

  const handleSelectTutor = (tutor) => {
    router.push({
      pathname: "/fields/selectedTutor",
      params: {
        name: tutor.name,
        image: tutor.image,
        major: tutor.major,
        year: tutor.year,
      },
    });
  };

  return (
    <ScrollView>
      <Appbar.Header style={styles.appBar}>
        <View style={styles.iconWrapper}>
          <Appbar.Action icon="magnify" size={30} onPress={() => console.log("Search icon pressed")} />
          <Text style={styles.iconText} className="font-bold">
            User Connect
          </Text>
        </View>
        <Appbar.Content title="" />
        <Text style={styles.appBarTitle} className="font-extrabold text-3xl">
          Tutorhub
        </Text>
        <Appbar.Content title="" />
        <View style={styles.iconWrapper}>
          <Appbar.Action icon="account-circle" onPress={() => router.push("/fields/tutorSetUp")} />
          <Text style={styles.iconText} className="font-bold">
            Tutor Setup
          </Text>
        </View>
      </Appbar.Header>
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to the awesome and</Text>
        <Text style={styles.text}>intertwining world of {topic}</Text>
        <Title style={styles.title}>Featured:</Title>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="format-list-bulleted" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="apps" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMajor(value)}
              items={[
                { label: "Solid Mechanics", value: "solid-mechanics" },
                { label: "Fluid Dynamics", value: "fluid-dynamics" },
                { label: "Thermodynamics", value: "thermodynamics" },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: "Select Major", value: "" }}
              useNativeAndroidPickerStyle={false}
              Icon={() => <MaterialIcons name="arrow-drop-down" size={24} color="black" />}
            />
          </View>
          <View>
            <RNPickerSelect
              onValueChange={(value) => setSelectedYear(value)}
              items={[
                { label: "1st Year", value: "1st-year" },
                { label: "2nd Year", value: "2nd-year" },
                { label: "3rd Year", value: "3rd-year" },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: "Select Year", value: "" }}
              useNativeAndroidPickerStyle={false}
              Icon={() => <MaterialIcons name="arrow-drop-down" size={24} color="black" />}
            />
          </View>
        </View>

        {/* Tutors profile below: */}
        <View style={styles.profileContainer}>
          {filteredProfiles.map((profile, index) => (
            <TouchableOpacity
              style={styles.profile}
              key={index}
              onPress={() => {
                handleSelectTutor(profile);
              }}
            >
              <Image source={{ uri: profile.image }} style={styles.profileImage} />
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileDetails}>{profile.major}</Text>
              <Text style={styles.profileDetails}>{profile.year}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.iconContainer2}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="format-list-bulleted" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="apps" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Title style={styles.title}>Most Rated:</Title>
        <View style={styles.profileContainer}>
          {filteredRated.map((rated, index) => (
            <TouchableOpacity style={styles.profile} key={index} onPress={() => handleSelectTutor(rated)}>
              <Image source={{ uri: rated.image }} style={styles.profileImage} />
              <Text style={styles.profileName}>{rated.name}</Text>
              <Text style={styles.profileDetails}>{rated.major}</Text>
              <Text style={styles.profileDetails}>{rated.year}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Tutorbook;

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  appBarTitle: {
    position: "absolute",
    left: "50%",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  iconText: {
    fontSize: 12,
    color: "black",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    padding: 15,
    margin: 15,
  },
  text: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "400",
    color: "black",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    justifyContent: "center",
    marginTop: 10,
  },
  iconContainer2: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 0,
    paddingTop: 20,
  },
  iconButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  profile: {
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileDetails: {
    fontSize: 16,
    color: "black",
    fontFamily: "Georgia",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderRadius: 15,
    color: "#ffa100",
    paddingRight: 30,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});
