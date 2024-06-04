import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Pressable,
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../Firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      try {
        setDoc(doc(FIRESTORE_DB, "users", response.user.uid), {
          Email: email,
          Password: password,
        });
        alert("Created!");
      } catch (e) {
        console.log("Error adding document : " + e);
      }
    } catch (error) {
      console.log("Registration Failed : " + error);
      alert("Check your email!");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.header} onPress={() => router.back()}>
        <FontAwesome6 name="chevron-left" color="#888" size={20} />
      </Pressable>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "600",
              fontSize: "25",
              color: "#333",
              marginBottom: 40,
            }}
          >
            Create a new account
          </Text>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#00AFFF"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            placeholderTextColor="#00AFFF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.signUpText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
    fontSize: 13,
    padding: 10,
  },
  signUpButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: "center",
  },
  signUpText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
