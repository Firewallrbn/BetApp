// app/(auth)/reset.tsx
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSend = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
      return;
    }
    // Simulación: aquí iría la llamada al backend para enviar el email
    Alert.alert("Enviado", `Hemos enviado instrucciones a ${email}`);
    setEmail("");
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/Logo.png')} style={styles.logo} />

      <Text style={styles.title}>BetMaster</Text>

      <Text style={styles.phrase}>Restablecer contraseña</Text>

      <View style={styles.modeBadge}>
        <Text style={styles.modeText}>RESET</Text>
      </View>

      <Text style={styles.subtitle}>
        Ingresa el correo asociado a tu cuenta y te enviaremos instrucciones para
        restablecer tu contraseña.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar instrucciones</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>¿Recordaste tu contraseña?</Text>

      <TouchableOpacity
        style={[styles.buttonAlt, { backgroundColor: "#1E90FF" }]}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Volver a Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttonAlt, styles.socialButton, { backgroundColor: '#000000' }]}>
        <Image source={require('@/assets/images/apple.png')} style={styles.socialIcon} />
        <Text style={styles.buttonText}>Iniciar sesión con Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttonAlt, styles.socialButton, { backgroundColor: '#4285F4' }]}>
        <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
        <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    // quitado `gap` por compatibilidad con web
  },
  logo: {
    height: 90,
    width: 290,
    marginBottom: 0,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  modeBadge: {
    marginTop: 2,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E6F4EA",
  },
  modeText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 12,
  },

  phrase: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 12,
    paddingHorizontal: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginVertical: 8, // sustituye gap
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 1,
    marginBottom: 50,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginRight: 8,
  },
  rememberText: {
    fontSize: 14,
  },
  link: {
    color: "#1E90FF",
    fontSize: 14,
    alignSelf: "flex-start",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    width: "100%",
    marginVertical: 8,
  },
  buttonAlt: {
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    width: "100%",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  orText: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 8,
    color: "#444",
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  socialIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    resizeMode: "contain",
  },
});
