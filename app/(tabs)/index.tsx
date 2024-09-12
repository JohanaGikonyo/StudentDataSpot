import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { SearchBar } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import axios from 'axios';
import { Video } from 'expo-av';

const DefaultTab = () => {
    const [search, setSearch] = useState("");
    const [videos, setVideos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    });

    const fetchVideos = useCallback(async () => {
        setRefreshing(true);
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.43.5:3000/api/videos');
            console.log('Fetched Videos:', response.data); // Debugging
            setVideos(response.data);
        } catch (error) {
            console.error('Failed to fetch videos', error.response ? error.response.data : error.message);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleSearchChange = (text) => {
        setSearch(text);
    };

    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(search.toLowerCase()));

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        const visibleVideoIds = viewableItems.map(item => item.item._id);

        // Pause the currently playing video if it is no longer visible
        if (playingVideoId && !visibleVideoIds.includes(playingVideoId)) {
            setPlayingVideoId(null);
        }
    }, [playingVideoId]);

    const handlePlaybackStatusUpdate = useCallback((status, itemId) => {
        if (status.isPlaying && itemId !== playingVideoId) {
            setPlayingVideoId(itemId);
        }
        if (status.didJustFinish) {
            setPlayingVideoId(null);
        }
    }, [playingVideoId]);

    const renderItem = ({ item }) => (
        <View style={styles.videoContainer}>
            <Video
                source={{ uri: `http://192.168.43.5:3000/${item.videoUrl}` }}
                style={styles.video}
                useNativeControls
                resizeMode="cover"
                shouldPlay={item._id === playingVideoId} // Only play if it's the currently playing video
                onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, item._id)}
                onError={(error) => console.error('Video Error:', error)} // to be commented out once the app is launched for users
            />
            <View style={styles.titleSubscribeContainer}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <TouchableOpacity style={styles.subscribeButton}>
                    <Text style={styles.actionText}>Subscribe</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.tutorName}>John Doe</Text>
                <Text style={styles.postTime}>2 hours ago</Text>
                <Text style={styles.views}>1,234 Views</Text>
            </View>
            <View style={styles.actionsContainer}>
                <View style={styles.thumbContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="thumbs-up" size={24} color="black" />
                        <Text>467</Text>
                    </TouchableOpacity>
                    <View style={styles.verticalLine} />
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="thumbs-down" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="share" size={24} color="black" />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="download" size={24} color="black" />
                    <Text style={styles.actionText}>Download</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.commentsContainer}>
                <Text style={styles.commentsCount}>Comments 18</Text>
                <Text style={styles.commentText}>Awesome video</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <Link href="/settings/setting" style={styles.icon}>
                    <FontAwesome size={24} name="cog" color="black" />
                </Link>
                <SearchBar
                    placeholder="Search Here..."
                    platform="default"
                    containerStyle={styles.searchBarContainer}
                    inputContainerStyle={styles.searchInputContainer}
                    inputStyle={styles.searchInput}
                    value={search}
                    onChangeText={handleSearchChange}
                    showLoading={false}
                />
                <FontAwesome size={24} name="microphone" color="black" style={styles.icon} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredVideos}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchVideos}
                        />
                    }
                    viewabilityConfig={viewabilityConfig.current}
                    onViewableItemsChanged={onViewableItemsChanged}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    search: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 25,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        elevation: 5,
    },
    searchBarContainer: {
        flex: 1,
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchInputContainer: {
        backgroundColor: "#e0e0e0",
        borderRadius: 20,
        height: 40,
    },
    searchInput: {
        fontSize: 16,
    },
    icon: {
        marginHorizontal: 5,
    },
    videoContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
    },
    videoTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        flex: 1,
    },
    video: {
        width: '100%',
        height: 350,
    },
    titleSubscribeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    subscribeButton: {
        backgroundColor: '#ff0000',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    infoContainer: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent:'space-evenly',
    },
    tutorName: {
        fontSize: 24,
        color: '#555',
    },
    postTime: {
        fontSize: 20,
        color: '#555',
    },
    views: {
        fontSize: 20,
        color: '#555',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    thumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f5',
        borderRadius: 24,
        padding: 5,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        marginRight: 10,
    },
    verticalLine: {
        height: 24,
        width: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 5,
    },
    actionText: {
        fontSize: 16,
        marginLeft: 5,
    },
    commentsContainer: {
        marginTop: 10,
    },
    commentsCount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentText: {
        fontSize: 16,
    },
});

export default DefaultTab;