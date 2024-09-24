import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput, Button, Card, Title, Paragraph, Appbar } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const RegisterForm = ({ navigateToLogin }) => {
  const navigation = useNavigation();

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
  const [loading, setLoading] = useState(false); // Loading state

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!name || !email || !password) {
      setMessage("Name, email, and password are required.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("day", day);
      formData.append("month", month);
      formData.append("year", year);
      formData.append("institution", institution);
      formData.append("graduationYear", graduationYear);
      formData.append("course", course);
      formData.append("password", password);

      if (photo) {
        formData.append("photo", {
          uri: photo.uri,
          name: `photo_${Date.now()}.jpg`,
          type: photo.type,
        });
      }

      const response = await axios.post("http://192.168.137.91:3000/api/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setMessage("User registered successfully!");
        navigation.navigate("(tabs)");
      } else {
        setMessage("Error registering user");
      }
    } catch (error) {
      console.error("Error registering user:", error.response ? error.response.data : error.message);
      setMessage("Error registering user");
    } finally {
      setLoading(false); // End loading
    }
  };

  const selectPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
      } else {
        console.log("User cancelled image picker");
      }
    } catch (error) {
      console.log("ImagePicker Error: ", error);
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
              <TouchableOpacity onPress={selectPhoto} style={styles.photoContainer}>
                {photo ? (
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                ) : (
                  <View style={styles.iconContainer}>
                    <Icon name="photo-camera" size={30} color="#000" />
                    <Text style={styles.uploadText}>Upload Photo</Text>
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
              secureTextEntry
              mode="outlined"
              theme={{ roundness: 10 }}
              outlineColor="transparent"
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry
              mode="outlined"
              theme={{ roundness: 10 }}
              outlineColor="transparent"
            />
            <Paragraph style={styles.message}>{message}</Paragraph>

            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#6200ee" />
              ) : (
                <>
                  <Button mode="contained" onPress={handleRegister} style={styles.button}>
                    Create Account
                  </Button>
                  <View style={styles.loginContainer}>
                    <Text style={styles.orText}>OR</Text>
                    <Button mode="contained" onPress={navigateToLogin} style={styles.button}>
                      Login
                    </Button>
                  </View>
                </>
              )}
            </View>
          </Card.Content>
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
  appBar: {
    // backgroundColor: "#6200ee",
    // color: #faf5f5,
  },
  appBarTitle: {
    // color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    flex: 1,
  },
  photoContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    borderWidth: 0,
    borderColor: "#ccc",
    marginLeft: 16,
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
    marginTop: 8,
    color: "#000",
    fontSize: 14,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
  },
  button: {
    marginVertical: 8,
    backgroundColor: "#6200ee",
  },
  scrollView: {
    paddingBottom: 16,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  orText: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 16,
  },
  message: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
});

export default RegisterForm;
