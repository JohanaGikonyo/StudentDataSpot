import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import axios from "redaxios";

interface ModalProps {
  onClose: () => void;
}
interface User {
  _id: string;
  name: string;
}

const UsersModal: React.FC<ModalProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/getUsers");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white p-5 rounded-lg w-4/5">
        <Text className="text-lg font-bold mb-3">Select User</Text>
        <ScrollView>
          {Array.isArray(users) &&
            users.map(
              (
                user // Check if users is an array
              ) => (
                <TouchableOpacity
                  key={user._id}
                  className="p-2 border-b border-gray-200"
                  onPress={() => {
                    console.log("Selected user:", user.name);
                    onClose();
                  }}
                >
                  <Text>{user.name}</Text>
                </TouchableOpacity>
              )
            )}
        </ScrollView>
        <TouchableOpacity className="mt-4 bg-gray-300 p-2 rounded-md" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UsersModal;
