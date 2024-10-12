import React, { useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
export default function Messaging() {
  const { name, status, photo } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message }]);
      setMessage(""); // Clear the input after sending
    }
  };

  const renderProfileImage = () => {
    if (photo) {
      return <Image source={{ uri: photo }} style={styles.profileImage} />;
    } else {
      const firstLetter = name.charAt(0).toUpperCase();
      return (
        <View style={[styles.fallbackImage, { backgroundColor: getBackgroundColor(firstLetter) }]}>
          <Text style={styles.fallbackText}>{firstLetter}</Text>
        </View>
      );
    }
  };

  const getBackgroundColor = (letter) => {
    const colors = ["#007BFF", "#28A745", "#DC3545", "#FFC107", "#17A2B8"];
    return colors[letter.charCodeAt(0) % colors.length];
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const handleVoicePress = () => {
    // Logic for voice input
    console.log("Voice icon pressed");
  };

  const handleUploadPress = () => {
    // Logic for document/image upload
    console.log("Upload icon pressed");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        {renderProfileImage()}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userStatus}>{status === "online" ? "Online" : "Offline"}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Feather name="phone" size={24} color="black" />
          <Feather name="video" size={24} color="black" />
          <Feather name="more-vertical" size={24} color="black" />
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
        inverted
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleVoicePress}>
          <Feather name="mic" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          //   onFocus={() => setInputFocused(true)}
          //   onBlur={() => setInputFocused(false)}
        />
        <TouchableOpacity onPress={handleUploadPress}>
          {/* <Feather name="upload" size={24} color="#007BFF" /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  fallbackImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  fallbackText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userStatus: {
    fontSize: 14,
    color: "green",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 100,
  },
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginHorizontal: 10,
    height: 40,
    outlineWidth: 0,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    padding: 10,
  },
});
