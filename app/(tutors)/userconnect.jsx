import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Appbar, Title } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";
import { useUser } from "../../store/userStore";

const Users = () => {
  const { user } = useUser();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const Skeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonAvatar} />
      <Text>Please Wait...</Text>
    </View>
  );

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/getUsers");
        const data = await response.json();
        setProfiles(data.users);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

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
      profile.email !== user?.email &&
      (profile.name.toLowerCase().includes(search.toLowerCase()) ||
        profile.course.toLowerCase().includes(search.toLowerCase()))
  );
  const shuffledProfiles = shuffleProfiles(filteredProfiles);

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
        photo: user.photo,
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
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/(tabs)")}>
            <FontAwesome name="youtube-play" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tutor Book</Text>
        </View>
        <Appbar.Content title="" />
        <Text style={styles.headerTitle}>User Connect</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile/user")}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileUserImage} />
          ) : (
            <View style={[styles.profileImage, styles.initialsContainer]}></View>
          )}
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
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
            {loading ? (
              <Skeleton />
            ) : shuffledProfiles.length > 0 ? (
              shuffledProfiles.map((profile, index) => (
                <TouchableOpacity style={styles.profileCard} key={index} onPress={() => handleSelectUser(profile)}>
                  {renderAvatar(profile.name, profile.photo)}
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileMajor}>{profile.course}</Text>
                  <Text style={styles.profileYear}>{profile.year}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No profiles found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginTop: 60, // Adjust this value based on your header height
  },
  innerContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: "#faf9f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
  profileButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  profileUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
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
  skeletonCard: {
    alignItems: "center",
    marginBottom: 16,
    width: "48%",
  },
  skeletonAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#C0C0C0",
    marginBottom: 8,
  },
});

export default Users;
