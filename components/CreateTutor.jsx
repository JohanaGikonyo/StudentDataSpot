import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, Card, Title, Paragraph, Appbar } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

const CreateTutor = ({ setPage }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [institution, setInstitution] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [qualifications, setQualifications] = useState(null);

  // Select a photo from library
  const selectPhoto = async () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: true, // Convert to base64
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].base64); // Store base64 photo
      }
    });
  };

  // Handle document upload (qualifications)
  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*", // Accept all types of documents
    });

    if (result.type === "success") {
      setQualifications(result);
    }
  };

  // Register tutor and upload data
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!!");
      return;
    }

    const tutorData = {
      name,
      email,
      phone,
      institution,
      course,
      password,
      graduationDate: `${year}-${month}-${day}`,
      photo, // Base64 encoded image
      qualifications: qualifications ? qualifications.uri : null, // Path to the uploaded document
    };

    const formData = new FormData();
    formData.append("name", tutorData.name);
    formData.append("email", tutorData.email);
    formData.append("phone", tutorData.phone);
    formData.append("institution", tutorData.institution);
    formData.append("course", tutorData.course);
    formData.append("password", tutorData.password);
    formData.append("graduationDate", tutorData.graduationDate);

    // For photo as base64, send it directly without FormData
    if (tutorData.photo) {
      formData.append("photo", `data:image/jpeg;base64,${tutorData.photo}`);
    }

    // Add document (qualifications)
    if (qualifications) {
      formData.append("qualifications", {
        uri: qualifications.uri,
        name: qualifications.name,
        type: qualifications.mimeType,
      });
    }

    try {
      console.log(formData);
      const response = await axios.post("http://localhost:3000/api/tutors/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setMessage("Registration successful!");
        const { Tutortoken, tutorDetails } = response.data;

        await AsyncStorage.setItem("Tutortoken", Tutortoken);
        await AsyncStorage.setItem("tutorDetails", JSON.stringify(tutorDetails));
        router.push("/fields/tutorSetUp");
      } else {
        setMessage("Failed to register.Try Again!");
      }
    } catch (error) {
      setMessage("Something went wrong! Please try again.");
      console.error(error);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => setPage("login")} />
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
                  <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photo} />
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
            <TextInput value={name} onChangeText={setName} style={styles.input} mode="outlined" />

            <Text style={styles.label}>Email address</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} mode="outlined" />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} mode="outlined" />

            <Text style={styles.label}>Institution</Text>
            <TextInput value={institution} onChangeText={setInstitution} style={styles.input} mode="outlined" />

            <Text style={styles.label}>Graduation Date</Text>
            <View style={styles.datePickerContainer}>
              <Picker selectedValue={day} onValueChange={(itemValue) => setDay(itemValue)} style={styles.picker}>
                <Picker.Item label="Day" value="" />
                {days.map((d) => (
                  <Picker.Item key={d} label={d.toString()} value={d.toString()} />
                ))}
              </Picker>
              <Picker selectedValue={month} onValueChange={(itemValue) => setMonth(itemValue)} style={styles.picker}>
                <Picker.Item label="Month" value="" />
                {months.map((m) => (
                  <Picker.Item key={m} label={m.toString()} value={m.toString()} />
                ))}
              </Picker>
              <Picker selectedValue={year} onValueChange={(itemValue) => setYear(itemValue)} style={styles.picker}>
                <Picker.Item label="Year" value="" />
                {years.map((y) => (
                  <Picker.Item key={y} label={y.toString()} value={y.toString()} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Course/Major</Text>
            <TextInput value={course} onChangeText={setCourse} style={styles.input} mode="outlined" />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />
            <Paragraph style={{ color: "red" }}>{message}</Paragraph>

            <Text style={styles.label}>Upload Academic Qualifications and Certificate of Good Conduct</Text>
            <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
              <Icon name="upload" size={24} color="black" />
              <Text style={styles.uploadText}>{qualifications ? qualifications.name : "Tap to upload"}</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={handleRegister} style={styles.button}>
                Become a Tutor
              </Button>
            </View>
          </Card.Content>
        </Card>
        <TouchableOpacity style={styles.signInButton} onPress={() => setPage("login")}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appBarTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    padding: 10,
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
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#6200EE",
  },
  photoContainer: {
    marginLeft: "auto",
    alignItems: "center",
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  iconContainer: {
    alignItems: "center",
  },
  uploadText: {
    fontWeight: "bold",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  picker: {
    flex: 1,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  signInButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signInButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "#007BFF",
  },
});

export default CreateTutor;
