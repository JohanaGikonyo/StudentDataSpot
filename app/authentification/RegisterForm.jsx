import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput, Button, Card, Title, Paragraph, Appbar } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useUser } from "@/store/userStore";
import { useRouter } from "expo-router";

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

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!name || !email || !password) {
      setMessage("Name, email, password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

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
        const fileName = photo.uri.split("/").pop();
        const fileType = photo.uri.match(/\.\w+$/) ? photo.uri.match(/\.\w+$/)[0] : "";
        formData.append("photo", {
          uri: photo.uri,
          name: fileName,
          type: `image/${fileType.replace(".", "")}`,
        });
      }

      // Console log the form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post("http://localhost:3000/api/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setMessage("User registered successfully!");
        const token = response.data.token; // Assuming the response contains a token
        const user = response.data.user; // Assuming the response contains user data

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
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

  // replaced this fuction below
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
            {/* <View style={styles.datePickerContainer}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={day}
                    onValueChange={(itemValue) => setDay(itemValue)}
                    style={styles.picker}
                    prompt="Select Day"
                  >
                    <Picker.Item label="Day" value="" />
                    {days.map((d) => (
                      <Picker.Item key={d} label={d.toString()} value={d.toString()} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={month}
                    onValueChange={(itemValue) => setMonth(itemValue)}
                    style={styles.picker}
                    prompt="Select Month"
                  >
                    <Picker.Item label="Month" value="" />
                    {months.map((m) => (
                      <Picker.Item key={m} label={m.toString()} value={m.toString()} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={year}
                    onValueChange={(itemValue) => setYear(itemValue)}
                    style={styles.picker}
                    prompt="Select Year"
                  >
                    <Picker.Item label="Year" value="" />
                    {years.map((y) => (
                      <Picker.Item key={y} label={y.toString()} value={y.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View> */}

            {/* <Text style={styles.label}>Graduation Date</Text>
            <View style={styles.datePickerContainer}>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={day} onValueChange={setDay} style={styles.picker}>
                  <Picker.Item label="Day" value="" />
                  {days.map((d) => (
                    <Picker.Item key={d} label={d.toString()} value={d.toString()} />
                  ))}
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={month} onValueChange={setMonth} style={styles.picker}>
                  <Picker.Item label="Month" value="" />
                  {months.map((m) => (
                    <Picker.Item key={m} label={m.toString()} value={m.toString()} />
                  ))}
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={year} onValueChange={setYear} style={styles.picker}>
                  <Picker.Item label="Year" value="" />
                  {years.map((y) => (
                    <Picker.Item key={y} label={y.toString()} value={y.toString()} />
                  ))}
                </Picker>
              </View>
            </View> */}

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
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
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
});

export default RegisterForm;
