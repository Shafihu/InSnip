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
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import Toast from "react-native-toast-message";

const FullNameScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const showToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleContinue = () => {
    if (!firstName) {
      showToast("First name is required!");
    } else if (!lastName) {
      showToast("Last name is required!");
    } else {
      router.push({
        pathname: "/auth/birthday",
        params: { firstName: firstName, lastName: lastName },
      });
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
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
              What's your name?
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="FIRST NAME"
            placeholderTextColor="#00AFFF"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="LAST NAME"
            placeholderTextColor="#00AFFF"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <TouchableOpacity onPress={handleContinue} style={styles.signUpButton}>
          <Text style={styles.signUpText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FullNameScreen;

const styles = StyleSheet.create({
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
    paddingBottom: 30
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
    gap: 5,
    paddingTop: 50,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    fontSize: 15,
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
