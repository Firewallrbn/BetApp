import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";



export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    if(password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    const success = await register(email, password,fullName);
    if (!success) {
      Alert.alert("Error", "No se pudo crear la cuenta. Inténtalo de nuevo.");
      return;
    }

    // Si el registro es exitoso, redirigir al usuario a la pantalla de inicio de sesión
    router.push("/login");
    //router.replace("/(auth)/login");
  };




  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/Logo.png')} style={styles.logo} />

      <Text style={styles.title}>BetMaster</Text>

      <Text style={styles.phrase}>Crea tu cuenta</Text>

      <View style={styles.modeBadge}>
        <Text style={styles.modeText}>SIGN UP</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>¿Ya tienes cuenta?</Text>
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity
          style={styles.buttonAlt}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  logo: {
    height: 90,
    width: 290,
    marginBottom: 0,
    resizeMode: "contain",
    marginTop: 50,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginVertical: 5,
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
    marginVertical: 5,
  },
  buttonAlt: {
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  orText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    resizeMode: "contain",
  },

});
