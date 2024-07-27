import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tutor = () => {
  const [messages, setMessages] = useState([]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    // Here you can implement the logic to send the message to your backend or AI service
  }, []);

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer}
        primaryStyle={styles.inputToolbarPrimary}
      />
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#0078fe",
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
  };

  const renderActions = (props) => {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="photo-camera" size={28} color="#0078fe" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="mic" size={28} color="#0078fe" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="insert-emoticon" size={28} color="#0078fe" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="attach-file" size={28} color="#0078fe" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSend = (props) => {
    return (
      <TouchableOpacity style={styles.sendButton} onPress={() => props.onSend({ text: props.text }, true)}>
        <Icon name="send" size={28} color="#0078fe" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderSend={renderSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputToolbarContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 2,
  },
  inputToolbarPrimary: {
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  actionButton: {
    marginHorizontal: 10,
  },
  sendButton: {
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Tutor;
