import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import CreateTutor from "../../components/CreateTutor";
import EditTutor from "../../components/EditTutor";
import ViewYourTutorDetails from "../../components/ViewYourTutorDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TutorLogin from "../../components/TutorLogin";

export default function TutorSetUp() {
  const [page, setPage] = useState("login");
  const [tutorDetails, setTutorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoredUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("Tutortoken");
        const storedUser = await AsyncStorage.getItem("tutorDetails");

        if (storedToken && storedUser) {
          setTutorDetails(JSON.parse(storedUser));
          setPage("profile");
          console.log("tutor found");
        }
      } catch (error) {
        console.error("Error fetching stored data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoredUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {page === "create" && (
        <View style={styles.pageContainer}>
          <CreateTutor setPage={setPage} />
        </View>
      )}
      {page === "profile" && tutorDetails && (
        <View style={styles.pageContainer}>
          <ViewYourTutorDetails details={tutorDetails} setPage={setPage} />
        </View>
      )}

      {page === "login" && (
        <View style={styles.pageContainer}>
          <TutorLogin setPage={setPage} />
        </View>
      )}

      {page === "edit" && tutorDetails && (
        <View style={styles.pageContainer}>
          <EditTutor details={tutorDetails} setPage={setPage} setTutorDetails={setTutorDetails} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  pageContainer: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
