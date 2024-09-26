import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Appbar, Title } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

// Define colors and backgrounds based on initials
const avatarStyles = {
  A: { backgroundColor: "#FF5733", color: "#FFFFFF" },
  B: { backgroundColor: "#33FF57", color: "#FFFFFF" },
  C: { backgroundColor: "#3357FF", color: "#FFFFFF" },
  D: { backgroundColor: "#FF33A8", color: "#FFFFFF" },
  E: { backgroundColor: "#FFD433", color: "#FFFFFF" },
  F: { backgroundColor: "#FF33B5", color: "#FFFFFF" },
  G: { backgroundColor: "#33FFF3", color: "#000000" },
  H: { backgroundColor: "#FF7F33", color: "#FFFFFF" },
  I: { backgroundColor: "#7F33FF", color: "#FFFFFF" },
  J: { backgroundColor: "#FF8C33", color: "#FFFFFF" },
  K: { backgroundColor: "#33FF8C", color: "#FFFFFF" },
  L: { backgroundColor: "#FF3357", color: "#FFFFFF" },
  M: { backgroundColor: "#FF338A", color: "#FFFFFF" },
  N: { backgroundColor: "#33FF77", color: "#FFFFFF" },
  O: { backgroundColor: "#A833FF", color: "#FFFFFF" },
  P: { backgroundColor: "#FF33D4", color: "#FFFFFF" },
  Q: { backgroundColor: "#33FFC4", color: "#000000" },
  R: { backgroundColor: "#FF3333", color: "#FFFFFF" },
  S: { backgroundColor: "#33B3FF", color: "#FFFFFF" },
  T: { backgroundColor: "#FF8C33", color: "#FFFFFF" },
  U: { backgroundColor: "#FF33B5", color: "#FFFFFF" },
  V: { backgroundColor: "#C733FF", color: "#FFFFFF" },
  W: { backgroundColor: "#FF9F33", color: "#FFFFFF" },
  X: { backgroundColor: "#33FFD4", color: "#000000" },
  Y: { backgroundColor: "#FF5E33", color: "#FFFFFF" },
  Z: { backgroundColor: "#FF7F77", color: "#FFFFFF" },
};

const Users = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/getUsers"); // Replace with your actual API endpoint
        const data = await response.json();
        setProfiles(data.users);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleSearchChange = (text) => {
    setSearch(text);
  };

  const filteredProfiles = profiles.filter((profile) => profile.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelectUser = (user) => {
    router.push({
      pathname: "/fields/selectedUser",
      params: {
        name: user.name,
        image: user.profileImage,
        major: user.course,
        year: user.year,
        institution: user.institution,
        graduationYear: user.graduationYear,
        phone: user.phone,
        email: user.email,
      },
    });
  };

  const renderAvatar = (name, profileImage) => {
    if (profileImage) {
      return <Image source={{ uri: profileImage }} style={styles.profileImage} />;
    } else {
      const firstLetter = name.charAt(0).toUpperCase();
      const { backgroundColor, color } = avatarStyles[firstLetter] || { backgroundColor: "#E0E0E0", color: "#FFFFFF" };
      return (
        <View style={[styles.avatarContainer, { backgroundColor }]}>
          <Text style={[styles.avatarText, { color }]}>{firstLetter}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/(tabs)")}>
            <FontAwesome name="youtube-play" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tutor Book</Text>
        </View>
        <Appbar.Content title="" />
        <Text style={styles.headerTitle}>User Connect</Text>
        <Appbar.Action icon="account-circle" onPress={() => router.push("/profile/user")} />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.introText}>Connect with a community of Students seeking knowledge</Text>
        <SearchBar
          placeholder="Search..."
          platform="default"
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          value={search}
          onChangeText={handleSearchChange}
        />
        <Title style={styles.sectionTitle}>Featured:</Title>

        <View style={styles.profilesContainer}>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile, index) => (
              <TouchableOpacity style={styles.profileCard} key={index} onPress={() => handleSelectUser(profile)}>
                {renderAvatar(profile.name, profile.profileImage)}
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileMajor}>{profile.course}</Text>
                <Text style={styles.profileYear}>{profile.year}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No profiles found</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -60 }],
  },
  container: {
    padding: 16,
  },
  introText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: "transparent",
    padding: 0,
    marginBottom: 16,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchInputContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
  },
  searchInput: {
    fontSize: 16,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 16,
    width: "48%",
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileMajor: {
    fontSize: 16,
  },
  profileYear: {
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
  },
});

export default Users;
