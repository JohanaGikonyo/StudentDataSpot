import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import ChatBubble from './ChatBubble';
import { API_KEY } from './api.js';
import { speak, isSpeakingAsync, stop } from "expo-speech";
import { FontAwesome5 } from '@expo/vector-icons';
import { FormattedMessage } from './format.js';


export default function ChatBot() {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const flatListRef = useRef(null);

    const handleUserInput = async () => {
        // Add user input to the chat
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];

        setLoading(true);
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    contents: updatedChat,
                },
            );
            console.log("Gemini response:", response.data);
            const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (modelResponse) {
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }],
                    },
                ];
                setChat(updatedChatWithModel);
                setUserInput("");
            }
        } catch (error) {
            console.error("Error calling Gemini pro API: ", error);
            console.error("Error response:", error.response);
            setError("An error occurred! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            // Stop the speech if the user is speaking
            stop();
            setIsSpeaking(false);
        } else {
            // If not speaking, start the speech
            if (!(await isSpeakingAsync())) {
                speak(text);
                setIsSpeaking(true);
            }
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            text={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );



    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>AI Assistant</Text>
            </View>
     
            {/* Chat Area */}
            <View style={styles.chatArea}>
                {chat.length === 0 ? (
                    <View style={styles.welcomeContainer}>
                        <View style={styles.iconContainer}>
                            <FontAwesome5 name="robot" size={32} color="#3B82F6" />
                        </View>
                        <Text style={styles.welcomeTitle}>Welcome!</Text>
                        <Text style={styles.welcomeText}>
                            Start a conversation with your AI assistant
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={chat}
                        renderItem={renderChatItem}
                        keyExtractor={(_, index) => index.toString()}
                        style={styles.chatList}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                    />
                )}
            </View>
     
            {/* Input Area */}
            <View style={styles.inputContainer}>
                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Message..."
                        placeholderTextColor="#94A3B8"
                        value={userInput}
                        onChangeText={setUserInput}
                        multiline
                        maxHeight={100}
                    />
                    <TouchableOpacity 
                        onPress={handleUserInput}
                        disabled={loading || !userInput.trim()}
                        style={[
                            styles.sendButton,
                            !userInput.trim() && styles.sendButtonDisabled
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <FontAwesome5 
                                name="paper-plane" 
                                size={20} 
                                color={!userInput.trim() ? '#94A3B8' : 'white'}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
     );
     
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 24,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        elevation: 1
    },
    headerText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center'
    },
    chatArea: {
        flex: 1,
        paddingHorizontal: 12
    },
    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        backgroundColor: '#eff6ff',
        padding: 24,
        borderRadius: 50,
        marginBottom: 16
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#475569'
    },
    welcomeText: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 8,
        maxWidth: 250
    },
    chatList: {
        paddingTop: 16
    },
    inputContainer: {
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#fff'
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 8,
        backgroundColor: '#fef2f2'
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 8
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#1e293b',
        fontSize: 16
    },
    sendButton: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#3b82f6'
    },
    sendButtonDisabled: {
        backgroundColor: '#e2e8f0'
    }
 });
