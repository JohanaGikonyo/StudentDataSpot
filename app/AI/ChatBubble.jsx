import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FormattedMessage } from './format';

export default function ChatBubble({ role, text, onSpeech }) {
  return (
    <View style={[styles.container, role === "user" ? styles.userContainer : styles.modelContainer]}>
      <View style={[styles.bubble, role === "user" ? styles.userBubble : styles.modelBubble]}>
        {role === "model" ? (
          // Use the formatted message for model responses
          <FormattedMessage content={text} />
        ) : (
          <Text style={styles.messageText}>{text}</Text>
        )}
        
        {role === "model" && (
          <TouchableOpacity onPress={onSpeech} style={styles.speechButton}>
            <Ionicons name="volume-high-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.label, role === "user" ? styles.userLabel : styles.modelLabel]}>
        {role === "user" ? "You" : "AI Assistant"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  modelContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: '#3B82F6', // Blue-500
    borderBottomRightRadius: 0, // Remove bottom right radius for a "tail" effect
  },
  modelBubble: {
    backgroundColor: '#FFFFFF', // White background for model
    borderBottomLeftRadius: 0, // Remove bottom left radius
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF', // White text for user messages
  },
  // For model messages, the FormattedMessage component can use its own styling.
  speechButton: {
    position: 'absolute',
    bottom: -8,  // roughly equivalent to -bottom-2 in Tailwind
    right: -8,   // roughly equivalent to -right-2 in Tailwind
    backgroundColor: '#DBEAFE', // Blue-100
    padding: 8, // roughly p-2
    borderRadius: 9999, // full rounded circle
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    // Elevation for Android
    elevation: 2,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  userLabel: {
    color: '#1E3A8A', // approximate for text-blue-900
  },
  modelLabel: {
    color: '#4B5563', // approximate for text-gray-600
  },
});
