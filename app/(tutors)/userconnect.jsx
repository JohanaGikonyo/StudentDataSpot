import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Appbar, Title } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

const Users = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

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

  const handleSearchChange = (text) => {
    setSearch(text);
  };

  const filteredProfiles = profiles.filter((profile) => profile.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelectUser = (tutor) => {
    router.push({
      pathname: "/fields/selectedUser",
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
                <Image source={{ uri: profile.image }} style={styles.profileImage} />
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileMajor}>{profile.major}</Text>
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
