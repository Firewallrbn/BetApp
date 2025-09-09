import { Link, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function LinksTester() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>


      <Link href="/login" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Ir a /login (Link)</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/register" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Ir a /register (Link)</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/resetpas" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Ir a /resetpas (Link)</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Ir a / (raíz) (Link)</Text>
        </TouchableOpacity>
      </Link>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 14,
    alignItems: "stretch",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  linkButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f1f3f5",
    borderRadius: 10,
    marginTop: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#111",
    fontWeight: "600",
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
  hint: {
    marginTop: 18,
    fontSize: 13,
    color: "#555",
  },
});
