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
  SafeAreaView,
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
      <SafeAreaView style={styles.container}>
        <Pressable style={styles.header} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-left" color="#888" size={20} />
        </Pressable>
        <View style={styles.contentContainer}>
            <View><Text style={styles.title}>What's your name?</Text></View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>FIRST NAME</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>LAST NAME</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <TouchableOpacity onPress={handleContinue} style={styles.signUpButton}>
            <Text style={styles.signUpText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default FullNameScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    borderRadius: 25,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 28,
    color: "#2F3E46",
    marginBottom: 40,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: "#00aaff",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#00aaff",
    borderRadius: 25,
    padding: 10,
    fontSize: 15,
    fontWeight: "500",
    backgroundColor: '#ffffff',
    width: '100%',
  },
  signUpButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    width: '70%',
    marginVertical: 20
  },
  signUpText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
