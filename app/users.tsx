import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { getAllUsers, UserProfile } from "../services/userService";

export default function UsersScreen() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  // ⭐ THIS IS WHERE THE useEffect GOES
  useEffect(() => {
    async function load() {
      const list = await getAllUsers();
      setUsers(list);
    }
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users & Admins</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.role}>
              {item.role === "cleaner" ? "🧹 Admin / Cleaner" : "👤 Person"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  email: { fontSize: 16, fontWeight: "600" },
  role: { fontSize: 14, color: "#555", marginTop: 4 },
});
