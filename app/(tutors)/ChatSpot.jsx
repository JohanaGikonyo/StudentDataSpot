import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from "react-native";
import ChatList from "../chatspot/chatspot";
const Tutor = () => {
  return (
    <ScrollView>
      <View>
        <ChatList />
      </View>
    </ScrollView>
  );
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
