import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, profile, updateProfile } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [balance, setBalance] = useState("0");
  const [betsOpen, setBetsOpen] = useState("0");
  const [winRate, setWinRate] = useState("0");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const name =
      profile?.full_name ??
      user?.user_metadata?.display_name ??
      user?.user_metadata?.full_name ??
      "";
    setFullName(name);
    if (profile?.balance !== undefined && profile?.balance !== null) {
      setBalance(String(profile.balance));
    }
    if (profile?.bets_open !== undefined && profile?.bets_open !== null) {
      setBetsOpen(String(profile.bets_open));
    }
    if (profile?.win_rate !== undefined && profile?.win_rate !== null) {
      setWinRate(String(profile.win_rate));
    }
  }, [profile, user]);

  const parseDecimal = (value: string) => {
    const normalized = value.replace(/,/g, ".");
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const parseInteger = (value: string) => {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert("Error", "Necesitas iniciar sesión para editar tu perfil.");
      return;
    }

    const fullNameTrimmed = fullName.trim();
    if (!fullNameTrimmed) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    setIsSaving(true);
    const success = await updateProfile({
      full_name: fullNameTrimmed,
      balance: parseDecimal(balance),
      bets_open: parseInteger(betsOpen),
      win_rate: parseDecimal(winRate),
    });
    setIsSaving(false);

    if (!success) {
      Alert.alert("Error", "No se pudo actualizar tu perfil. Intenta nuevamente.");
      return;
    }

    Alert.alert("Perfil actualizado", "Se guardaron tus cambios correctamente.", [
      {
        text: "Aceptar",
        onPress: () => router.back(),
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>Inicia sesión para editar tu perfil.</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.secondaryButtonText}>Ir a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Editar perfil</Text>
        <Text style={styles.subtitle}>
          Modifica tus datos visibles y la información que se muestra en tu perfil.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre para mostrar</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nombre completo"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Saldo</Text>
          <TextInput
            style={styles.input}
            value={balance}
            onChangeText={setBalance}
            placeholder="0"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Apuestas abiertas</Text>
          <TextInput
            style={styles.input}
            value={betsOpen}
            onChangeText={setBetsOpen}
            placeholder="0"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Win rate (%)</Text>
          <TextInput
            style={styles.input}
            value={winRate}
            onChangeText={setWinRate}
            placeholder="0"
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>{isSaving ? "Guardando..." : "Guardar cambios"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()} disabled={isSaving}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBF8",
  },
  content: {
    padding: 24,
    paddingTop: 80,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F3D12",
  },
  subtitle: {
    color: "#3A6F3A",
    fontSize: 14,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#145A32",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CFE8D2",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  secondaryButtonText: {
    color: "#2E7D32",
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "#F8FBF8",
  },
  centeredText: {
    fontSize: 16,
    color: "#145A32",
    textAlign: "center",
  },
});
