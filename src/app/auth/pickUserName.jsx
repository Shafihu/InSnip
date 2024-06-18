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
  Platform
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import Toast from "react-native-toast-message";

const PickUserNameScreen = () => {
  const { firstName, lastName, birthday } = useLocalSearchParams();
  const [userName, setUserName] = useState("");
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

  const showToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleContinue = () => {
    if (!userName) {
      showToast("Username is required!");
    } else {
      router.push({
        pathname: "/auth/register",
        params: {
          firstName: firstName,
          lastName: lastName,
          birthday: birthday,
          userName: userName,
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <SafeAreaView style={styles.safeArea}>
        <Pressable style={styles.header} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-left" color="#888" size={20} />
        </Pressable>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Pick a username</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="USERNAME"
            placeholderTextColor="#00AFFF"
            value={userName}
            onChangeText={setUserName}
          />
          <TouchableOpacity onPress={handleContinue} style={styles.signUpButton}>
            <Text style={styles.signUpText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PickUserNameScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  title: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 28,
    color: "#2F3E46",
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#00aaff",
    borderRadius: 25,
    padding: 10,
    fontSize: 15,
    fontWeight: "500",
    backgroundColor: '#ffffff',
    color: "#00AFFF",
    width: '100%',
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    width: '70%',
    marginVertical: 20,
  },
  signUpText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
