// app/(main)/profile.tsx
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { user, profile, refreshProfile, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user && !profile) {
      refreshProfile();
    }
  }, [user, profile, refreshProfile]);

  const displayName =
    profile?.full_name ??
    user?.user_metadata?.display_name ??
    user?.user_metadata?.full_name ??
    user?.email ??
    "Usuario";

  const email = user?.email ?? "Sin correo";

  const toNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) {
      return 0;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const balanceValue = toNumber(profile?.balance);
  const openBetsValue = toNumber(profile?.bets_open);
  const winRateValue = toNumber(profile?.win_rate);

  const formattedBalance = !Number.isNaN(balanceValue)
    ? balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })
    : "0.00";

  const avatarSource = profile?.avatar_url
    ? { uri: profile.avatar_url }
    : require("../../assets/images/R.jpg");

  const handleDeposit = () => {
    Alert.alert("Depositar", "Abrir modal / pantalla de depósito (demo).");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      router.replace("/(auth)/login");
    }
  };

  const handleEdit = () => {
    router.push("/(auth)/editprofile");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={avatarSource} style={styles.avatar} contentFit="cover" />
        <View style={styles.headerText}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      {/* Card con saldo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo</Text>
        <Text style={styles.balance}>
          ${formattedBalance}
        </Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpi}>
            <Text style={styles.kpiNum}>{openBetsValue}</Text>
            <Text style={styles.kpiLabel}>Apuestas</Text>
          </View>

          <View style={styles.kpi}>
            <Text style={styles.kpiNum}>{winRateValue}%</Text>
            <Text style={styles.kpiLabel}>Win rate</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleDeposit}>
            <Text style={styles.primaryBtnText}>Depositar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={handleEdit}>
            <Text style={styles.outlineBtnText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferencias / opciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => Alert.alert("Notificaciones", "Configurar notificaciones (demo).")}
        >
          <Text style={styles.optionText}>Notificaciones</Text>
          <Text style={styles.optionChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => Alert.alert("Seguridad", "Cambiar contraseña / MFA (demo).")}
        >
          <Text style={styles.optionText}>Seguridad</Text>
          <Text style={styles.optionChevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF8", padding: 18 },

  header: {  flexDirection: "row", alignItems: "center", marginTop: 50, 
    marginBottom: 18
    
   },
  avatar: { width: 78, height: 78, borderRadius: 60, backgroundColor: "#E6F4EA" },
  headerText: { marginLeft: 12 },
  name: { fontSize: 20, fontWeight: "800", color: "#0F3D12" },
  email: { color: "#3A6F3A", marginTop: 4 },

  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 3, marginBottom: 18 },
  cardTitle: { color: "#2E7D32", fontWeight: "700", marginBottom: 6 },
  balance: { fontSize: 24, fontWeight: "900", color: "#145A32", marginBottom: 12 },

  kpiRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  kpi: { alignItems: "flex-start" },
  kpiNum: { fontWeight: "800", fontSize: 18, color: "#145A32" },
  kpiLabel: { color: "#4C9E62", fontSize: 12 },

  actionsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  primaryBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", textAlign: "center" },

  outlineBtn: { borderWidth: 1, borderColor: "#2E7D32", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, flex: 1 },
  outlineBtnText: { color: "#2E7D32", fontWeight: "700", textAlign: "center" },

  section: { marginTop: 8, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, elevation: 2 },
  sectionTitle: { color: "#2E7D32", fontWeight: "700", marginBottom: 8 },

  optionRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EEF8EE" },
  optionText: { color: "#145A32", fontWeight: "600" },
  optionChevron: { color: "#9CC39C", fontWeight: "700" },

  logoutBtn: { marginTop: 18, backgroundColor: "#fff", borderRadius: 10, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#F0F0F0" },
  logoutText: { color: "#D32F2F", fontWeight: "700" },
});
