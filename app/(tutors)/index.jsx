import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tutors/gettutors", {
          params: { page, limit: 50 },
        });
        setProfiles((prevProfiles) => [...prevProfiles, ...response.data.tutors]); // Append new profiles
        setHasMore(response.data.hasMore); // Check if more tutors exist
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching tutors:", error);
        setLoading(false);
      }
    };
    if (hasMore) {
      fetchTutors(); // Load more tutors when needed
    }
  }, [page]); // Fetch more tutors when page changes

  const handleSearchChange = (text) => {
    setSearch(text);
  };
  const shuffleProfiles = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(search.toLowerCase()) ||
      profile.course.toLowerCase().includes(search.toLowerCase())
  );
  const shuffledProfiles = shuffleProfiles(filteredProfiles);

  const handleSelectTutor = (tutor) => {
    router.push({
      pathname: "/fields/selectedTutor",
      params: {
        id: tutor.id,
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

  const loadMoreProfiles = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Load next page of data
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <View style={styles.iconWrapper} onPress={() => router.push("/userconnect")}>
          <Appbar.Action icon="account-group" size={30} color="#6200EE" onPress={() => router.push("/userconnect")} />
          <TouchableOpacity>
            <Text style={styles.iconText}>User Connect</Text>
          </TouchableOpacity>
        </View>
        <Appbar.Content title="" />
        <Text style={styles.appBarTitle}>Tutorhub</Text>
        <Appbar.Content title="" />
        <View style={styles.iconWrapper}>
          <Appbar.Action icon="school" color="#6200EE" onPress={() => router.push("/fields/tutorSetUp")} />
          <Text style={styles.iconText}>Tutor Setup</Text>
        </View>
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        shuffledProfilesonScroll={({ nativeEvent }) => {
          if (
            nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - 20
          ) {
            loadMoreProfiles(); // Trigger loading more tutors when reaching the bottom
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.text}>Welcome to the awesome world of {topic}</Text>
          <View style={styles.search}>
            <SearchBar
              placeholder="Search a tutor..."
              platform="default"
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
              value={search}
              onChangeText={handleSearchChange}
            />
          </View>
          <Title style={styles.title}>Featured Tutors</Title>
          <View style={styles.profileContainer}>
            {shuffledProfiles.map((profile, index) => (
              <TouchableOpacity key={index} style={styles.profile} onPress={() => handleSelectTutor(profile)}>
                {renderProfileImageOrInitials(profile)}
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileDetails}>{profile.course}</Text>
                <Text style={styles.profileDetails}>{profile.year}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {loading && <ActivityIndicator size="large" color="#6200EE" />}
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
    alignItems: "center",
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
