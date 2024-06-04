import { router, useLocalSearchParams } from "expo-router";
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
  ActivityIndicator,
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../Firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
  const { firstName, lastName, birthday, userName } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Account Created Successfully!🎉",
    });
  };

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      showErrorToast("Email and password are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      try {
        await setDoc(doc(FIRESTORE_DB, "users", response.user.uid), {
          Email: email,
          Password: password,
          FirstName: firstName,
          LastName: lastName,
          Birthday: birthday,
          Username: userName,
        });

        showSuccessToast();
      } catch (e) {
        console.log("Error adding document: " + e);
      }
    } catch (error) {
      console.log("Registration Failed: " + error);
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
          <View className="flex-1 justify-center">
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: 22,
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
            <Text className="text-[12px] font-medium text-gray-400">
              By tapping Sign Up & Accept, you acknowledge that you have read
              the Privacy Policy and agree to the Terms of Service.
            </Text>
          </View>
          <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.signUpText}>Sign Up & Accept</Text>
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
