import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Appbar, Title } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { SearchBar } from "react-native-elements";
import axios from "axios";

const Tutorbook = () => {
  const router = useRouter();
  const { topic } = useLocalSearchParams();
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [rated, setRated] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tutors/gettutors");
        setProfiles(response.data);
        setRated(response.data.rated || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (text) => {
    setSearch(text);
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(search.toLowerCase()) ||
      profile.course.toLowerCase().includes(search.toLowerCase()) // Check both name and course
  );

  const handleSelectTutor = (tutor) => {
    router.push({
      pathname: "/fields/selectedTutor",
      params: {
        name: tutor.name,
        image: tutor.photo,
        email: tutor.email,
        major: tutor.course,
        year: tutor.year,
        phone: tutor.phone,
        institution: tutor.institution,
      },
    });
  };

  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F1C40F", "#9B59B6"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const renderProfileImageOrInitials = (profile) => {
    if (profile.photo) {
      return <Image source={{ uri: profile.photo }} style={styles.profileImage} />;
    } else {
      return (
        <View style={[styles.profileImagePlaceholder, { backgroundColor: getRandomColor() }]}>
          <Text style={styles.profileInitials}>{getInitials(profile.name)}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <View style={styles.iconWrapper} onPress={() => router.push("/userconnect")}>
          <Appbar.Action icon="account-group" size={30} color="#6200EE" onPress={() => router.push("/userconnect")} />
          <TouchableOpacity>
            <Text style={styles.iconText} className="font-bold">
              User Connect
            </Text>
          </TouchableOpacity>
        </View>
        <Appbar.Content title="" />
        <Text style={styles.appBarTitle} className="font-extrabold text-3xl">
          Tutorhub
        </Text>
        <Appbar.Content title="" />
        <View style={styles.iconWrapper}>
          <Appbar.Action icon="school" color="#6200EE" onPress={() => router.push("/fields/tutorSetUp")} />
          <Text style={styles.iconText} className="font-bold">
            Tutor Setup
          </Text>
        </View>
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>Welcome to the awesome and</Text>
          <Text style={styles.text}>intertwining world of {topic}</Text>
          <View style={styles.search}>
            <SearchBar
              placeholder="Search a tutor..."
              platform="default"
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
              value={search}
              onChangeText={handleSearchChange}
              showLoading={false}
            />
          </View>
          <Title style={styles.title}>Most Rated:</Title>
          <View style={styles.iconContainer2}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="format-list-bulleted" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="apps" size={24} color="black" />
            </TouchableOpacity>
          </View>

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

          <View style={styles.profileContainer}>
            {filteredProfiles.map((profile, index) => (
              <TouchableOpacity style={styles.profile} key={index} onPress={() => handleSelectTutor(profile)}>
                {renderProfileImageOrInitials(profile)}
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileDetails}>{profile.course}</Text>
                <Text style={styles.profileDetails}>{profile.year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
    position: "absolute", // Fix position at the top
    width: "100%",
    zIndex: 1, // Ensure it's above other components
    top: 0,
  },
  appBarTitle: {
    position: "absolute",
    left: "50%",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconWrapper: {
    flexDirection: "column",
    justifyContent: "space-around",
    gap: 6,
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
    flex: 1,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  contentContainer: {
    padding: 15,
    margin: 15,
  },
  text: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "400",
    color: "black",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchInputContainer: {
    backgroundColor: "#fff",
    borderRadius: 25,
  },
  searchInput: {
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  profileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profile: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: "48%", // Adjust as needed
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  profileInitials: {
    color: "#fff",
    fontSize: 18,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  profileDetails: {
    color: "#666",
  },
  iconContainer2: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  iconButton: {
    padding: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    color: "black",
    marginVertical: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    color: "black",
    marginVertical: 5,
  },
});
