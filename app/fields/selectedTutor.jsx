import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { tw } from "nativewind"; // Ensure nativewind is imported

const SelectedTutor = () => {
  const router = useRouter();
  const { name, image, major, year, email } = useLocalSearchParams(); // Added email
  const [selectedValue, setSelectedValue] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailInput, setEmailInput] = useState(email);

  const radioButtons = [
    { label: "Online", value: "online" },
    { label: "Physical", value: "physical" },
  ];

  const RadioButton = ({ label, value, selected, onSelect }) => {
    return (
      <TouchableOpacity className="flex-row items-center mb-2" onPress={() => onSelect(value)}>
        <View
          className={`h-6 w-6 rounded-full border-2 items-center justify-center mr-2 ${
            selected ? "border-green-500" : "border-gray-800"
          }`}
        >
          {selected && <View className="h-3 w-3 rounded-full bg-green-500" />}
        </View>
        <Text className="text-lg">{label}</Text>
      </TouchableOpacity>
    );
  };

  const handleBooking = async () => {
    try {
      const response = await fetch('http://192.168.43.5:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutorName: name,
          tutorEmail: emailInput,
          studentName,
          sessionType: selectedValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking successful');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text className="m-4 text-3xl font-bold">{name}</Text>
      <Image source={{ uri: image }} style={styles.image} />

      <View className="bg-slate-300 p-5 rounded-lg text-center">
        <Text className="text-slate-800 m-2 font-bold">Name : {name}</Text>
        <Text className="text-slate-800 m-2 font-bold">Major : {major}</Text>
        <Text className="text-slate-800 m-2 font-bold">Institution : Multimedia University of Kenya</Text>
        <Text className="text-slate-800 m-2 font-bold">Year : {year}</Text>
        <Text className="text-slate-800 m-2 font-bold">Graduation Date : December 2027</Text>
        <Text className="text-slate-800 m-2 font-bold">Phone Number: +25478545664</Text>
        <Text className="text-slate-800 m-2 font-bold">Email : tutor@gmail.com</Text>
      </View>

      <View className="mt-4">
        <Text className="mb-2 font-bold text-lg">To book a tutoring session, Choose</Text>
        <View className="justify-center items-center p-5">
          {radioButtons.map((radio, index) => (
            <RadioButton
              key={index}
              label={radio.label}
              value={radio.value}
              selected={radio.value === selectedValue}
              onSelect={setSelectedValue}
            />
          ))}

          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={studentName}
            onChangeText={setStudentName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad" // Numeric keyboard for phone number
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address" // Email keyboard
          />

          <TouchableOpacity
            className="mt-5 p-4 bg-slate-300 rounded-lg"
            onPress={handleBooking}
          >
            <Text className="text-lg font-bold">Book {selectedValue ? selectedValue : ""}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectedTutor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});
