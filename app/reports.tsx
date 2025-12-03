import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useReports } from "./context/ReportsContext";

export default function ReportsScreen() {
  const router = useRouter();
  const { reports, updateReport } = useReports(); // ✅ grab updateReport

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#ff9800";
      case "In Progress":
        return "#2196f3";
      case "Cleaned":
        return "#4caf50";
      default:
        return "#999";
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateReport(id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      Alert.alert(
        "Error",
        "Could not update report status. Check your permissions."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Reports</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {reports.map((report) => (
          <View key={report.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLocation}>{report.location}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(report.status) },
                ]}
              >
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>{report.description}</Text>
            <Text style={styles.cardDate}>{report.date}</Text>

            {/* Status change buttons */}
            <View style={styles.statusButtons}>
              {report.status !== "In Progress" && (
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: "#2196f3" }]}
                  onPress={() => handleStatusChange(report.id, "In Progress")}
                >
                  <Text style={styles.statusButtonText}>Mark In Progress</Text>
                </TouchableOpacity>
              )}

              {report.status !== "Cleaned" && (
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: "#4caf50" }]}
                  onPress={() => handleStatusChange(report.id, "Cleaned")}
                >
                  <Text style={styles.statusButtonText}>Mark Cleaned</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { marginRight: 15 },
  backButtonText: { fontSize: 18, color: "#007bff", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  scrollView: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLocation: { fontSize: 18, fontWeight: "600", color: "#333", flex: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  cardDate: { fontSize: 12, color: "#999" },
  statusButtons: { flexDirection: "row", marginTop: 10, gap: 10 },
  statusButton: { padding: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  statusButtonText: { color: "#fff", fontWeight: "600" },
});
