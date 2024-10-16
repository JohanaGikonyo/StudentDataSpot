import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput, Button, Card, Title, Paragraph, Appbar } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useUser } from "@/store/userStore";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import ImagePicker from "react-native-image-crop-picker";

const RegisterForm = ({ navigateToLogin }) => {
  const router = useRouter();
  const { setUser } = useUser();
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
  const [loading, setLoading] = useState(false);

  const handleChoosePhoto = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true, // Ensure base64 is included in the response
      });

      if (!response.canceled) {
        // Access the first item in the assets array to get the URI
        const asset = response.assets ? response.assets[0] : null;

        if (asset) {
          const base64Image = `data:${asset.mimeType};base64,${asset.base64}`; // Create a base64 string
          setPhoto(base64Image); // Store base64 image string
        } else {
          console.log("No assets found in the response");
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("registering with ", email, name, password);
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!name || !email || !password || !photo) {
      setMessage("Name, email, password, and profile image are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          photo,
          name,
          email,
          phone,
          day,
          month,
          year,
          institution,
          graduationYear,
          course,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setMessage("User registered successfully!");
        const token = response.data.token; // Assuming the response contains a token
        const user = response.data.user; // Assuming the response contains user data

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setUser(JSON.stringify(user)); // Assuming setUser takes an object
        router.push("/");
      } else {
        setMessage("Error registering user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error.response ? error.response.data : error.message);
      setMessage("Error registering user: " + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="TutorBook" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="menu" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.horizontalLine} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={styles.title}>Account Set-Up</Title>
              <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.image} />
                ) : (
                  <View style={styles.iconContainer}>
                    <Icon name="photo-camera" size={30} color="#000" />
                    <Text style={styles.uploadText}>Upload Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 10 }}
              outlineColor="transparent"
            />

            <Text style={styles.label}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 10 }}
              autoCapitalize="none"
              keyboardType="email-address"
              outlineColor="transparent"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
              mode="outlined"
              theme={{ roundness: 10 }}
              outlineColor="transparent"
            />

            {/* Additional Fields */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Institution</Text>
                <TextInput
                  value={institution}
                  onChangeText={setInstitution}
                  style={styles.input}
                  mode="outlined"
                  theme={{ roundness: 10 }}
                  outlineColor="transparent"
                />
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Graduation Year</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={graduationYear}
                  onValueChange={(itemValue) => setGraduationYear(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Year" value="" />
                  {years.map((y) => (
                    <Picker.Item key={y} label={y.toString()} value={y.toString()} />
                  ))}
                </Picker>
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

            <Text style={styles.label}>Course/Major</Text>
            <TextInput
              value={course}
              onChangeText={setCourse}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 10 }}
              outlineColor="transparent"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 10 }}
              secureTextEntry
              outlineColor="transparent"
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 10 }}
              secureTextEntry
              outlineColor="transparent"
            />

            {message && <Text style={styles.errorMessage}>{message}</Text>}
          </Card.Content>

          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
            >
              {loading ? <ActivityIndicator color="#fff" /> : "Register"}
            </Button>
            <Button onPress={navigateToLogin} style={styles.loginButton}>
              Login
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  photoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70, // Circular container
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70, // Circular image
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  iconContainer: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 12,
    color: "#666",
  },
  input: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerContainer: {
    flexDirection: "row",
    marginTop: 10,
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
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorMessage: {
    color: "red",
    marginVertical: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  registerButton: {
    flex: 1,
    marginRight: 8,
  },
  loginButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#6200ee",
  },
  appBar: {
    backgroundColor: "#6200ee",
  },
  appBarTitle: {
    color: "#fff",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default RegisterForm;
