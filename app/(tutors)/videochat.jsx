import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";

const VideoChat = () => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (text) => {
    setSearch(text);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchWrapper}>
        <SearchBar
          placeholder="Search..."
          platform="default"
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          value={search}
          onChangeText={handleSearchChange}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>Video Chat Content</Text>
      </View>
    </ScrollView>
  );
};

export default VideoChat;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  searchWrapper: {
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    padding: 0,
  },
  searchInputContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
  },
  searchInput: {
    fontSize: 16,
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentText: {
    fontSize: 18,
    color: "#333",
  },
});
