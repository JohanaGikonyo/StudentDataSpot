import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Appbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

const SelectedTutor = () => {
  const router = useRouter();
  const { name, image, major, year } = useLocalSearchParams();
  const [selectedValue, setSelectedValue] = useState(null);

  const radioButtons = [
    { label: "Online", value: "online" },
    { label: "Physical", value: "physical" },
  ];

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

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Name: {name}</Text>
        <Text style={styles.detailText}>Major: {major}</Text>
        <Text style={styles.detailText}>Institution: Multimedia University of Kenya</Text>
        <Text style={styles.detailText}>Year: {year}</Text>
        <Text style={styles.detailText}>Graduation Date: December 2027</Text>
        <Text style={styles.detailText}>Phone Number: +25478545664</Text>
        <Text style={styles.detailText}>Email: tutor@gmail.com</Text>
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
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              /* Handle booking logic here */
            }}
          >
            <Text style={styles.bookButtonText}>Book {selectedValue ? selectedValue : ""}</Text>
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
});
