import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { fetchVideos } from "../api/backendApi";
import VideoThumbnail from "../components/VideoThumbnail";

const DefaultTab = () => {
  const [search, setSearch] = useState("");
  const router = useRouter()
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };
  const navigateToBot = () =>{
    router.push({
      pathname: "/AI/ChatBot"
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (error) {
      console.error("Error refreshing videos:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchChange = (text) => setSearch(text);

  const filteredVideos = videos.filter((video) =>
    video.title && video.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.search} className="bg-gray-100 text-slate-800">
    <Link href="/settings/setting" style={styles.icon}>
      <FontAwesome size={24} name="cog" color="black" />
    </Link>
    <SearchBar
      placeholder="Search Here..."
      value={search}
      onChangeText={handleSearchChange}
      containerStyle={styles.searchBarContainer}
      className="outline-none bg-neutral-50 text-slate-900 px-2"
    />
  </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>
          }
        >
          {filteredVideos.length === 0 ? (
            <Text style={styles.noResults}>No videos found!</Text>
          ) : (
            filteredVideos.map((video, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => console.log("Video pressed:", video.channelTitle)}>
                <VideoThumbnail video={video} />
              </TouchableWithoutFeedback>
            ))
          )}
        </ScrollView>
      )}

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={navigateToBot}
      >
        <FontAwesome name="comments" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f3",
    padding: 10,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  icon: {
    marginHorizontal: 10,
    color: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  noResults: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});

export default DefaultTab;