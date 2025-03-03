import React, { useState, useEffect } from "react";
import { View, Image, FlatList, TextInput, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useUser } from "@/store/userStore";
import axios from "redaxios";
import moment from 'moment';

export default function Messaging() {
  const { name, photo, status, id } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      if (user.id && id) {
        try {
          const response = await axios.post("http://localhost:3000/api/message/get_message", {
            recipient: user.id,
            sender: id,
          });

          const sentResponse = await axios.post("http://localhost:3000/api/message/get_message",{
            recipient: id,
            sender: user.id,
          })

          if (response.status === 200 && sentResponse.status ===200) {
            const receivedMessages = response.data.map(msg => ({...msg, type: 'received'}));
            const sentMessages = sentResponse.data.map(msg => ({...msg, type: 'sent'}));
            const combinedMessages = [...receivedMessages, ...sentMessages].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(combinedMessages);
          } else {
            console.error("Error fetching messages");
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [user.id, id]);

  const handleSend = async () => {
    if (message.trim() && user.id) {
      const newMessage = {
        sender: user.id,
        recipient: id,
        content: message,
      };
      try {
        const response = await axios.post("http://localhost:3000/api/message/post_message", newMessage);
        if (response.status >= 200 && response.status < 300) {
          console.log("Message sent successfully:", response.data);
          setMessages([...messages, { ...response.data, type: 'sent' }]);
          setMessage("");
        } else {
          console.error("Error sending message:", response.data.message || "Failed to send message");
          throw new Error(response.data.message || "Failed to send message");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderProfileImage = () => {
    if (photo) {
      return <Image source={{ uri: photo }} className="w-12 h-12 rounded-full mr-2" />;
    } else {
      const firstLetter = name.charAt(0).toUpperCase();
      return (
        <View className={`w-12 h-12 rounded-full justify-center items-center mr-2 bg-[${getBackgroundColor(firstLetter)}]`}>
          <Text className="text-white text-xl font-bold">{firstLetter}</Text>
        </View>
      );
    }
  };

  const getBackgroundColor = (letter) => {
    const colors = ["#007BFF", "#28A745", "#DC3545", "#FFC107", "#17A2B8"];
    return colors[letter.charCodeAt(0) % colors.length];
  };

  const renderMessage = ({ item }) => (
    <View className={`rounded-xl p-2 mb-2 max-w-[80%] ${item.type === 'sent' ? 'bg-[#DCF8C6] self-end' : 'bg-[#E0E0E0] self-start'}`}>
      <Text className="text-base text-[#333]">{item.content}</Text>
      <Text className="text-xs text-[#666] self-end mt-1">{moment(item.createdAt).format('LT')}</Text>
    </View>
  );

  const handleVoicePress = () => {
    console.log("Voice icon pressed");
  };

  const handleUploadPress = () => {
    console.log("Upload icon pressed");
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center p-2 bg-white">
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        {renderProfileImage()}
        <View className="flex-1">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-sm text-green-500">{status === "online" ? "Online" : "Offline"}</Text>
        </View>
        <View className="flex-row items-center justify-between w-24">
          <Feather name="phone" size={24} color="black" />
          <Feather name="video" size={24} color="black" />
          <Feather name="more-vertical" size={24} color="black" />
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 10 }}
        // inverted
      />

      <View className="flex-row items-center p-2 border-t border-gray-300 bg-white">
        <TouchableOpacity onPress={handleVoicePress}>
          <Feather name="mic" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 rounded-full border border-gray-300 p-2 mx-2 h-10 outline-none"
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={handleUploadPress}>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#007BFF] rounded-full p-2" onPress={handleSend}>
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}