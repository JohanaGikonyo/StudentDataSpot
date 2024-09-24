import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tutor = () => {
  const [messages, setMessages] = useState([]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    // Implement the logic to send the message to your backend or AI service
  }, []);

  const renderInputToolbar = (props) => (
    <InputToolbar {...props} containerStyle={styles.inputToolbarContainer} primaryStyle={styles.inputToolbarPrimary} />
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#6b6c6d",
        },
        left: {
          backgroundColor: "#f0f0f0",
        },
      }}
      textStyle={{
        right: {
          color: "#fff",
        },
        left: {
          color: "#000",
        },
      }}
    />
  );

  const renderActions = (props) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="insert-emoticon" size={28} color="#7d7d7e" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="attach-file" size={28} color="#686869" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="photo-camera" size={28} color="#7d7d7e" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="mic" size={28} color="#7d7d7e" />
      </TouchableOpacity>
    </View>
  );

  const renderSend = (props) => (
    <TouchableOpacity
      style={styles.sendButton}
      onPress={() => {
        if (props.text.trim().length > 0) {
          props.onSend({ text: props.text.trim() }, true);
        }
      }}
    >
      <Icon name="send" size={28} color="#0078fe" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderSend={renderSend}
        placeholder="Type your message..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Add a background color if necessary
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
    paddingVertical: 5,
  },
});

export default Tutor;
