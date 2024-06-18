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
  Platform,
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
  const { firstName, lastName, birthday, userName } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleContinue = () => {
    if (!email || !password) {
      showErrorToast("Email and password are required!");
    } else {
      router.push({
        pathname: "/auth/pickAvatar",
        params: {
          firstName,
          lastName,
          birthday,
          userName,
          email,
          password,
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <Pressable style={styles.header} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-left" color="#888" size={20} />
        </Pressable>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Completing Your Registration</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View>
            <Text style={styles.privacyText}>
              By tapping Continue, you acknowledge that you have read the Privacy Policy and agree to the Terms of Service.
            </Text>
          </View>
          <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    alignItems: "center",
    marginHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 22,
    color: "#333",
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: "#00AFFF",
    marginBottom: 5,
    textAlign: "left",
  },
  input: {
    borderWidth: 1,
    borderColor: "#00AFFF",
    borderRadius: 25,
    padding: 10,
    fontSize: 15,
    fontWeight: "500",
    backgroundColor: "#ffffff",
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    width: "70%",
    marginVertical: 20,
  },
  continueText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  privacyText: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 20,
  },
});
