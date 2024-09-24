// ResetPasswordForm.js
import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { TextInput, Button, Card, Paragraph } from "react-native-paper";

const ResetPasswordForm = ({ route }) => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = route.params;

  const handleResetPassword = async () => {
    try {
      const response = await fetch("http://192.168.137.91:3000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Reset Password</Text>

            <Text style={styles.label}>New Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />
            <Paragraph style={styles.errorMessage}>{message}</Paragraph>
            <View style={{ alignItems: "center" }}>
              <Button mode="contained" onPress={handleResetPassword} style={styles.button}>
                Reset Password
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... your styles here
});

export default ResetPasswordForm;
