import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Appbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { useUser } from "../../store/userStore";
const SelectedTutor = () => {
  const { user } = useUser();
  const router = useRouter();
  const { name, image, major, year, email, phone, institution } = useLocalSearchParams();
  const [selectedValue, setSelectedValue] = useState(null);

  const radioButtons = [
    { label: "Online", value: "online" },
    { label: "Physical", value: "physical" },
  ];
  const handleBooking = async () => {
    if (!selectedValue) {
      alert("Please select a session type");
      return;
    }

    try {
      // Make a POST request to send the email
      const response = await fetch("http://localhost:3000/api/tutors/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorEmail: email,
          userEmail: user.email,
          selectedValue: selectedValue,
          userName: user.name,
          tutorname: name,
        }),
      });

      if (response.ok) {
        alert("Booking request sent!");
      } else {
        alert("Failed to send booking request");
      }
    } catch (error) {
      console.error("Error booking session: ", error);
      alert("Error booking session");
    }
  };

  const RadioButton = ({ label, value, selected, onSelect }) => {
    return (
      <TouchableOpacity style={styles.radioButtonContainer} onPress={() => onSelect(value)}>
        <View style={[styles.radioButton, { borderColor: selected ? "#4CAF50" : "#555" }]}>
          {selected && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={styles.radioButtonLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F1C40F", "#9B59B6"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const renderProfileImageOrInitials = (image) => {
    if (image) {
      return <Image source={{ uri: image }} style={styles.image} />;
    } else {
      return (
        <View style={[styles.profileImagePlaceholder, { backgroundColor: getRandomColor() }]}>
          <Text style={styles.profileInitials}>{getInitials(name)}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
        {/* <Image source={{ uri: image }} style={styles.image} /> */}
        {renderProfileImageOrInitials(image)}

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Name: {name}</Text>
          <Text style={styles.detailText}>Major: {major}</Text>
          <Text style={styles.detailText}>Institution: {institution}</Text>
          <Text style={styles.detailText}>Year: {year}</Text>
          <Text style={styles.detailText}>Graduation Date: December 2027</Text>
          <Text style={styles.detailText}>Phone Number: {phone}</Text>
          <Text style={styles.detailText}>Email: {email}</Text>
        </View>

        <View style={styles.bookingContainer}>
          <Text style={styles.bookingTitle}>To book a tutoring session, Choose</Text>
          <View style={styles.radioButtonGroup}>
            {radioButtons.map((radio, index) => (
              <RadioButton
                key={index}
                label={radio.label}
                value={radio.value}
                selected={radio.value === selectedValue}
                onSelect={setSelectedValue}
              />
            ))}
            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
              <Text style={styles.bookButtonText}>Book {selectedValue ? selectedValue : ""}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SelectedTutor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  detailText: {
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
  },
  bookingContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  bookingTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  radioButtonGroup: {
    alignItems: "center",
    width: "100%",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  radioButtonLabel: {
    fontSize: 16,
  },
  bookButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileDetails: {
    fontSize: 14,
    color: "#555",
  },
});
