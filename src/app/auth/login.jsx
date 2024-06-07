import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../Firebase/config";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const showSuccessToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorToast("Email and password are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setEmail("");
      setPassword("");
      showSuccessToast("Login successful!");
    } catch (error) {
      console.log("Sign In Failed: " + error);
      showErrorToast("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable style={styles.header} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-left" color="#888" size={20} />
        </Pressable>
        <View style={styles.container}>
          <View className="flex-1 justify-center">
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 22,
                  color: "#333",
                  marginBottom: 40,
                }}
              >
                Log in to InSnip
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="EMAIL"
              placeholderTextColor="#00AFFF"
              value={email.toLowerCase()}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="PASSWORD"
              placeholderTextColor="#00AFFF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.loginText}>Log In</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    borderRadius: 25,
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#00AFFF",
    textAlign: "center",
    fontWeight: "500",
  },
});
