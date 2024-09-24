import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tutor = () => {
  <View>
    <Text>Chat spot</Text>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputToolbarContainer: {
    backgroundColor: "#ece9e9",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 2,
    marginHorizontal: 3,
    marginVertical: -6,
    borderRadius: 10,
  },
  inputToolbarPrimary: {
    alignItems: "center",
    flexDirection: "row",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});

export default Tutor;
