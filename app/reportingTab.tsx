import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useReports } from "./context/ReportsContext";

export default function NewReportScreen() {
  const { addReport } = useReports();
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!location || !description) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    const newReport = {
      id: Date.now().toString(), // auto-generate ID
      location,
      description,
      status: "Pending", // default status
      date: new Date().toISOString().split("T")[0], // current date YYYY-MM-DD
    };

    addReport(newReport);
    router.push("/reports"); // navigate back to reports list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Report</Text>

      <TextInput
        style={styles.input}
        placeholder="Building / Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
