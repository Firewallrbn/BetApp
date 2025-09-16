import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(AuthContext); // Acceder al contexto de autenticación
  const router = useRouter();
   


  const handleLogin = async () => {
    console.log("Login", { email, password });
    const success = await context.login(email, password);
    if (success) {
      router.push("/(main)/home");
    }
  };
  const handleLogin1 = async () => {
    const success = await context.login(email, password);
    if (success) {
      console.log("Login successful");
    }
  };

  const hola= async()=>{
    router.push("/(main)/home")}

  const handleRegister = () => {
    console.log("Register", { email, password });
    context.register(email, password);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/Logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>BetMaster</Text>
      <Text style={styles.phrase}>Apuesta, gana, repite</Text>

      <View style={styles.modeBadge}>
        <Text style={styles.modeText}>SIGN IN</Text>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
        value={email}                  
        onChangeText={setEmail}        
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        secureTextEntry 
        placeholderTextColor="#888"
        value={password}               
        onChangeText={setPassword}    
      />

      <View style={styles.rememberContainer}>
        <TouchableOpacity style={styles.checkbox} />
        <Text style={styles.rememberText}>Recuérdame</Text>
        <Link href="/(auth)/resetpas" asChild>
          <Text style={styles.link}>                   ¿Olvidaste tu contraseña?</Text>
        </Link>
      </View>

      <TouchableOpacity
        style={styles.buttonAlt}
        activeOpacity={0.8}
        onPress={handleLogin1}          
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>
 
      <TouchableOpacity style={[styles.buttonAlt, styles.socialButton, { backgroundColor: '#000000' }]}
      onPress={hola}>
        <Image
          source={require('@/assets/images/apple.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.buttonText}>Iniciar sesión con Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttonAlt, styles.socialButton, { backgroundColor: '#4285F4' }]}>
        <Image
          source={require('@/assets/images/google.png')}
          style={styles.socialIcon}
        />
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
    backgroundColor: "#4CAF50",
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

