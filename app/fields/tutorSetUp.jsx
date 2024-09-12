import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput, Button, Card, Title, Paragraph, Appbar } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import axios from 'axios';

const TutorSetUp = ({ navigateToLogin }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [institution, setInstitution] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [qualifications, setQualifications] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (result.type === "success") {
      setQualifications(result.uri);
    }
  };
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!!");
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('institution', institution);
    formData.append('graduationYear', graduationYear);
    formData.append('course', course);
    formData.append('password', password);
    formData.append('photo', photo ? {
      uri: photo.uri,
      type: photo.type || 'image/jpeg',
      name: photo.fileName || 'photo.jpg'
    } : '');
    formData.append('qualifications', qualifications ? {
      uri: qualifications,
      type: 'application/pdf',
      name: qualifications.split('/').pop()
    } : '');
  
    try {
      const response = await axios.post('http://192.168.43.5:3000/api/tutors/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage("Registration successful!");
      router.push("/(tabs)");
    } catch (error) {
      console.log('Error response:', error.response); // Debug log
      setMessage("Registration failed: " + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };
  

  const selectPhoto = () => {
    const options = {
      mediaType: "photo", // Limit to photos only
      quality: 1, // High quality
      includeBase64: false, // Set to true if you need base64 encoded image
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="TutorBook" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="menu" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.horizontalLine} />

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={styles.title}>Account Set-Up</Title>
              <TouchableOpacity onPress={selectPhoto} style={styles.photoContainer}>
                {photo ? (
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                ) : (
                  <View style={styles.iconContainer}>
                    <Icon name="photo-camera" size={30} color="#000" />
                    <Text style={styles.uploadText} className="font-bold">
                      Upload Profile Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />

            <Text style={styles.label}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Institution</Text>
                <TextInput
                  value={institution}
                  onChangeText={setInstitution}
                  style={styles.input}
                  mode="outlined"
                  theme={{ roundness: 20 }}
                  outlineStyle={{ borderWidth: 0 }}
                />
              </View>
            </View>

            <Text style={styles.label}>Graduation Date</Text>
            <View style={styles.datePickerContainer}>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={day} onValueChange={(itemValue) => setDay(itemValue)} style={styles.picker}>
                  <Picker.Item label="Day" value="" />
                  {days.map((d) => (
                    <Picker.Item key={d} label={d.toString()} value={d.toString()} />
                  ))}
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={month} onValueChange={(itemValue) => setMonth(itemValue)} style={styles.picker}>
                  <Picker.Item label="Month" value="" />
                  {months.map((m) => (
                    <Picker.Item key={m} label={m.toString()} value={m.toString()} />
                  ))}
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={year} onValueChange={(itemValue) => setYear(itemValue)} style={styles.picker}>
                  <Picker.Item label="Year" value="" />
                  {years.map((y) => (
                    <Picker.Item key={y} label={y.toString()} value={y.toString()} />
                  ))}
                </Picker>
              </View>
            </View>

            <Text style={styles.label}>Course</Text>
            <TextInput
              value={course}
              onChangeText={setCourse}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 20 }}
              outlineStyle={{ borderWidth: 0 }}
            />

            <Text style={styles.label}>Upload Qualifications</Text>
            <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
              <Icon name="cloud-upload" size={30} color="#000" />
              <Text style={styles.uploadButtonText}>Upload PDF</Text>
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button mode="contained" onPress={handleRegister} style={styles.button}>
                Create Account
              </Button>
            )}

            <Paragraph style={styles.message}>{message}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  appBarTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "#fff",
  },
  card: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  title: {
    fontWeight: "900",
    flex: 1,
    fontSize: 30,
  },
  photoContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    overflow: "hidden",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    textAlign: "center",
    marginTop: 5,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 17,
  },
  input: {
    marginBottom: 10,
    height: 35,
    backgroundColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  button: {
    marginBottom: 0,
    marginTop: 0,
    maxWidth: 150,
    alignItems: "center",
  },
  link: {
    marginTop: 10,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    height: 40,
    borderRadius: 25,
  },
  picker: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
});


export default TutorSetUp;
