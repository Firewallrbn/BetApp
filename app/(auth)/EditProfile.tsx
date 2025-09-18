// app/(main)/profile/EditProfile.tsx
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function EditProfile() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useContext(AuthContext);

  // Local form state (prefilled from user)
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [birthDate, setBirthDate] = useState(user?.birth_date ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // si user cambia en el contexto, actualizamos el formulario
    setName(user?.name ?? "");
    setBio(user?.bio ?? "");
    setPhone(user?.phone ?? "");
    setGender(user?.gender ?? "");
    setLocation(user?.location ?? "");
    setWebsite(user?.website ?? "");
    setBirthDate(user?.birth_date ?? "");
    setAvatarUrl(user?.avatar_url ?? "");
  }, [user]);

  const onSave = async () => {
    if (!name || name.trim() === "") {
      Alert.alert("Validación", "El nombre es obligatorio.");
      return;
    }

    const payload = {
      name: name.trim(),
      bio: bio || null,
      phone: phone || null,
      gender: gender || null,
      location: location || null,
      website: website || null,
      birth_date: birthDate || null,
      avatar_url: avatarUrl || null,
    };

    setSaving(true);
    const ok = await updateProfile(payload);
    setSaving(false);

    if (ok) {
      Alert.alert("Éxito", "Perfil actualizado correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", "No fue posible actualizar el perfil. Intenta de nuevo.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar perfil</Text>

      <Text style={styles.label}>Nombre *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre completo" />

      <Text style={styles.label}>Biografía</Text>
      <TextInput style={[styles.input, styles.multiline]} value={bio} onChangeText={setBio} placeholder="Sobre ti" multiline />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+57 3xx xxx xxxx" keyboardType="phone-pad" />

      <Text style={styles.label}>Género</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Masculino / Femenino / Otro" />

      <Text style={styles.label}>Ubicación</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ciudad, País" />

      <Text style={styles.label}>Sitio web</Text>
      <TextInput style={styles.input} value={website} onChangeText={setWebsite} placeholder="https://midominio.com" autoCapitalize="none" />

      <Text style={styles.label}>Fecha de nacimiento (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="1990-01-31" />

      <Text style={styles.label}>Avatar URL</Text>
      <TextInput style={styles.input} value={avatarUrl} onChangeText={setAvatarUrl} placeholder="https://..." autoCapitalize="none" />

      <View style={styles.buttonWrap}>
        {saving || isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Guardar" onPress={onSave} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonWrap: {
    marginTop: 20,
  },
});
