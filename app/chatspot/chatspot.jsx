// Frontend (ChatList.js)
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import { useRouter } from "expo-router";
import axios from "redaxios";
import { useUser } from "@/store/userStore";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import UsersModal from "@/components/UsersModal";
export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchChats = async () => {
      if (user.id) {
        try {
          const response = await axios.get(`http://localhost:3000/api/chats/${user.id}`);
          setChats(response.data);
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }
    };

    fetchChats();
  }, [user.id]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View className="flex-1">
      <ScrollView className="p-5 bg-[#f5f6ee]">
        {chats.map((chat) => (
          <ChatItem key={chat.userId} chat={chat} />
        ))}
      </ScrollView>

      <TouchableOpacity
        className="sticky bottom-5 r-5 ml-[85%]  bg-blue-500 rounded-full p-3 shadow-md w-10 flex items-center justify-center"
        onPress={toggleModal}
      >
        <Feather name="message-square" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <UsersModal onClose={toggleModal} />
      </Modal>
    </View>
  );
}

function ChatItem({ chat }) {
  const router = useRouter();
  const { name, photo, lastMessage, userId, lastMessageTime } = chat;

  const onPressChat = () => {
    router.push({
      pathname: "/chatspot/Messaging",
      params: { name: name, photo: photo, status: "online", id: userId },
    });
  };

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center bg-[#f5f6ee] p-4 mb-2 rounded-lg shadow-sm"
        onPress={onPressChat}
      >
        <Image source={{ uri: photo }} className="w-12 h-12 rounded-full mr-4" />
        <View className="flex-1">
          <Text className="font-bold text-lg mb-1">{name}</Text>
          <Text className="text-gray-600">{lastMessage}</Text>
        </View>
        <Text className="text-xs text-gray-400">
          {moment(lastMessageTime).fromNow()}
        </Text>
      </TouchableOpacity>
      <View className="h-[1px] bg-[#EDEADE]" />
    </View>
  );
}