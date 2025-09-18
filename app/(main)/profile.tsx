// app/(main)/profile.tsx
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { logout, user } = useContext(AuthContext); // ⬅️ del contexto

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // 🔒 Guard: mientras no haya user, evita acceder a null
  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Cargando perfil…</Text>
      </View>
    );
  }

  const [infoOpen, setInfoOpen] = useState(false);
  const toggleInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setInfoOpen((v) => !v);
  };

  const handleDeposit = () => {
    Alert.alert("Depositar", "Abrir modal / pantalla de depósito (demo).");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/(auth)/login");
    }
  };

  const handleEdit = () => {
    // ajusta a tu ruta real (si tu archivo es app/(main)/profile/EditProfile.tsx)
    router.push("/(auth)/EditProfile");
    // o si usas edit.tsx: router.push("/profile/edit");
  };

  // ✅ valores con fallback para que no explote el render
  const name = user.name ?? "—";
  const email = user.email ?? "—";
  const avatarSource = user.avatar_url
    ? { uri: user.avatar_url }
    : require("../../assets/images/R.jpg");

  const balance = user.balance ?? 0;
  const betsOpen = user.bets_open ?? 0;
  const winRate = user.win_rate ?? 0;

  const username = user.username ?? "usuario";
  const bio = user.bio ?? "";
  const phone = user.phone ?? "";
  const gender = user.gender ?? "";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={avatarSource} style={styles.avatar} contentFit="cover" />
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      {/* Card con saldo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo</Text>
        <Text style={styles.balance}>
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpi}>
            <Text style={styles.kpiNum}>{betsOpen}</Text>
            <Text style={styles.kpiLabel}>Apuestas</Text>
          </View>

          <View style={styles.kpi}>
            <Text style={styles.kpiNum}>{winRate}%</Text>
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

      {/* Información personal (plegable) */}
      <View style={[styles.section, { marginTop: 12 }]}>
        <TouchableOpacity
          onPress={toggleInfo}
          accessibilityRole="button"
          accessibilityLabel="Mostrar u ocultar información personal"
          style={[styles.optionRow, { borderBottomWidth: 0 }]}
        >
          <Text style={styles.sectionTitle}>Información personal</Text>
          <Text style={styles.optionChevron}>{infoOpen ? "˄" : "˅"}</Text>
        </TouchableOpacity>

        {infoOpen && (
          <View style={styles.infoContainer}>
            <InfoItem label="Nombre" value={name} />
            <InfoItem label="Usuario" value={`@${username}`} />
            <InfoItem label="Bio" value={bio} multiline />
            <InfoItem label="Teléfono" value={phone} />
            <InfoItem label="Género" value={gender} />
          </View>
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoItem({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, multiline && { flexWrap: "wrap" }]} numberOfLines={multiline ? undefined : 1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, backgroundColor: "#F8FBF8" },
  header: { flexDirection: "row", alignItems: "center", marginTop: 50, marginBottom: 18 },
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
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  primaryBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", textAlign: "center" },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
  },
  outlineBtnText: { color: "#2E7D32", fontWeight: "700", textAlign: "center" },
  section: { marginTop: 8, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, elevation: 2 },
  sectionTitle: { color: "#2E7D32", fontWeight: "700" },
  optionRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EEF8EE", alignItems: "center" },
  optionText: { color: "#145A32", fontWeight: "600" },
  optionChevron: { color: "#9CC39C", fontWeight: "700", fontSize: 18, marginLeft: 8 },
  infoContainer: { marginTop: 8, paddingBottom: 8 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#F7FBF7", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8 },
  infoLabel: { width: 100, color: "#145A32", fontWeight: "700" },
  infoValue: { flex: 1, color: "#0F3D12", fontWeight: "500" },
  logoutBtn: { marginTop: 18, backgroundColor: "#fff", borderRadius: 10, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#F0F0F0" },
  logoutText: { color: "#D32F2F", fontWeight: "700" },
});
