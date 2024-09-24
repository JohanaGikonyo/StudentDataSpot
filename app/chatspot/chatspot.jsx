import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";

const ChatList = ({ navigation }) => {
  //below are the examples from the figma design
  const chats = [
    {
      id: 1,
      name: "Emmy Young",
      lastMessage: "Hello, pleasure to connect",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    { id: 2, name: "Kelvian Wesale", lastMessage: "Thanks", image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Anzel Godwils", lastMessage: "Nice", image: "https://randomuser.me/api/portraits/women/3.jpg" },
    {
      id: 4,
      name: "Memo Brian",
      lastMessage: "Haina noma King",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    { id: 5, name: "Andrew John", lastMessage: "Sawa man", image: "https://randomuser.me/api/portraits/men/5.jpg" },
    {
      id: 6,
      name: "Anthony Matthew",
      lastMessage: "The class will be as from 10",
      image: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    { id: 7, name: "Leshan Ian", lastMessage: "Safi mkuu", image: "https://randomuser.me/api/portraits/men/7.jpg" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={null}>
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} navigation={navigation} />
      ))}
    </ScrollView>
  );
};

const ChatItem = ({ chat, navigation }) => {
  const { name, lastMessage, image } = chat;

  const onPressChat = () => {
    // Navigate to chat screen
    console.log(`Navigating to chat with ${name}`);
  };

  return (
    <View>
      <TouchableOpacity style={styles.chatItem} onPress={onPressChat}>
        <Image source={{ uri: image }} style={styles.avatar} />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{name}</Text>
          <Text style={styles.lastMessage}>{lastMessage}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f5f6ee",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6ee",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 0,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#EDEADE",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  lastMessage: {
    color: "#666666",
  },
});

export default ChatList;
