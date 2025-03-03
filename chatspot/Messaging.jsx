import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
// import { CallHandler } from './callHandler';

export default function Messaging() {
  const { name, status, photo } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const callHandlerRef = useRef(null);
  const [isInCall, setIsInCall] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallInfo, setIncomingCallInfo] = useState(null);

  useEffect(() => {
    // Initialize CallHandler
    callHandlerRef.current = new CallHandler('YOUR_USER_ID');
    
    // Set up call handlers
    callHandlerRef.current.onIncomingCall = handleIncomingCall;
    callHandlerRef.current.onCallAccepted = handleCallAccepted;
    callHandlerRef.current.onCallRejected = handleCallRejected;
    callHandlerRef.current.onCallEnded = handleCallEnded;
    callHandlerRef.current.onStreamReceived = handleStreamReceived;

    return () => {
      // Cleanup
      if (callHandlerRef.current) {
        callHandlerRef.current.cleanup();
      }
    };
  }, []);

  const handleVideoCall = async () => {
    try {
      if (!isInCall) {
        const stream = await callHandlerRef.current.initiateCall(name, 'video');
        // Handle local stream (e.g., show in video component)
        setIsInCall(true);
      } else {
        callHandlerRef.current.endCall(name);
        setIsInCall(false);
      }
    } catch (error) {
      console.error('Error handling video call:', error);
    }
  };

  const handleVoiceCall = async () => {
    try {
      if (!isInCall) {
        const stream = await callHandlerRef.current.initiateCall(name, 'audio');
        // Handle local stream
        setIsInCall(true);
      } else {
        callHandlerRef.current.endCall(name);
        setIsInCall(false);
      }
    } catch (error) {
      console.error('Error handling voice call:', error);
    }
  };

  const handleIncomingCall = (from, signal, type) => {
    setIncomingCallInfo({ from, signal, type });
    setShowIncomingCall(true);
  };

  const handleCallAccepted = (signal) => {
    setIsInCall(true);
    setShowIncomingCall(false);
  };

  const handleCallRejected = () => {
    setIsInCall(false);
    setShowIncomingCall(false);
  };

  const handleCallEnded = () => {
    setIsInCall(false);
    setShowIncomingCall(false);
  };

  const handleStreamReceived = (stream) => {
    // Implementation for handling received stream
    // This would typically involve setting up a video element or RTCView
    console.log('Received remote stream:', stream);
  };

  const handleAcceptCall = async () => {
    try {
      if (incomingCallInfo) {
        const stream = await callHandlerRef.current.answerCall(
          incomingCallInfo.from,
          incomingCallInfo.signal
        );
        setIsInCall(true);
        setShowIncomingCall(false);
      }
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleRejectCall = () => {
    if (incomingCallInfo) {
      callHandlerRef.current.rejectCall(incomingCallInfo.from);
      setShowIncomingCall(false);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: message,
          sender: 'YOUR_USER_ID',
          timestamp: new Date(),
        },
      ]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'YOUR_USER_ID' ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Image source={{ uri: photo }} style={styles.avatar} />
        <Appbar.Content title={name} subtitle={status} />
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleVoiceCall}>
            <Feather
              name="phone"
              size={24}
              color={isInCall ? "red" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoCall}>
            <Feather
              name="video"
              size={24}
              color={isInCall ? "red" : "black"}
            />
          </TouchableOpacity>
          <Feather name="more-vertical" size={24} color="black" />
        </View>
      </Appbar.Header>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal visible={showIncomingCall} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Incoming {incomingCallInfo?.type} Call
            </Text>
            <Text style={styles.modalText}>
              From: {incomingCallInfo?.from}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.acceptButton]}
                onPress={handleAcceptCall}
              >
                <Feather name="phone" size={24} color="white" />
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.rejectButton]}
                onPress={handleRejectCall}
              >
                <Feather name="phone-off" size={24} color="white" />
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginRight: 10,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});