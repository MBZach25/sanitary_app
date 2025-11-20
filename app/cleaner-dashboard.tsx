import { useRouter } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebase/firebaseConfig";

interface Report {
  id: string;
  location: string;
  description: string;
  status: "Pending" | "In Progress" | "Cleaned";
  date: string;
  reporterEmail: string;
}

export default function CleanerDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportsData: Report[] = [];
      querySnapshot.forEach((doc) => {
        reportsData.push({ id: doc.id, ...doc.data() } as Report);
      });
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, []);

  const updateReportStatus = async (
    reportId: string,
    newStatus: Report["status"]
  ) => {
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: newStatus,
        updatedAt: new Date(),
      });
      Alert.alert("Success", `Report marked as ${newStatus}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update report");
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cleaner Dashboard</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>All Reports ({reports.length})</Text>
        {reports.map((report) => (
          <View key={report.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLocation}>📍 {report.location}</Text>
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
            <Text style={styles.cardDate}>📅 {report.date}</Text>
            <Text style={styles.cardReporter}>👤 {report.reporterEmail}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {report.status !== "In Progress" && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#2196f3" }]}
                  onPress={() => updateReportStatus(report.id, "In Progress")}
                >
                  <Text style={styles.actionButtonText}>Mark In Progress</Text>
                </TouchableOpacity>
              )}
              {report.status !== "Cleaned" && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#4caf50" }]}
                  onPress={() => updateReportStatus(report.id, "Cleaned")}
                >
                  <Text style={styles.actionButtonText}>Mark Cleaned</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
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
  cardLocation: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  cardReporter: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
