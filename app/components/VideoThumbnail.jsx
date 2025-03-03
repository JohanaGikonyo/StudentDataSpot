import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { formatViews } from "../utils/numbers";
import { formatTime } from "./timeFormatter";
import { Ionicons } from "react-native-vector-icons";
import {formatDuration } from "./formatDuration.js"


import { useUser, useFollowers, usePending } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VideoThumbnail({ video }) {
  const router = useRouter();
  const { user}= useUser()
  const image=user.profileImage;
  const name=user.name;


  const onThumbnailPress = () => {
    router.push({
      pathname: "/components/VideoComponent",
      params: {
        video: JSON.stringify(video),
      },
    });
    console.log("The parsed data", video);
  };

  return (
    <TouchableOpacity onPress={onThumbnailPress} style={styles.container}>
      <View style={styles.thumbnailContainer}>
        {video.thumbnailUrl && (
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={styles.thumbnail}
            onError={() =>
              console.log(`Failed to load image from: ${video.thumbnailUrl}`)
            }
          />
        )}
        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(video.duration || "0:00")}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.channelAvatarContainer}>
          {image? (
            <Image
              source={{ uri: image }}
              style={styles.channelAvatar}
            />
          ) : (
            <View style={[styles.channelAvatar, styles.avatarPlaceholder]} />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {video.title}
            </Text>
            
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.channelInfo} numberOfLines={1}>
  <Text style={{ fontWeight: "bold", color: "black" }}>{name}</Text>{" "}
  <Text style={styles.viewsTime}>
     {formatViews(video.views)} views • {formatTime(video.uploadDate)}
  </Text>
</Text>

        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: "#0f0f0f",
    borderRadius: 8,
    elevation: 2,
  },
  thumbnailContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#fff",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  contentContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  channelAvatarContainer: {
    marginRight: 12,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  avatarPlaceholder: {
    backgroundColor: "#2f2f2f",
  },
  detailsContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 24,
    lineHeight: 22,
  },
  menuButton: {
    padding: 4,
  },
  channelInfo: {
    color: "#555",
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  viewsTime: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
});
