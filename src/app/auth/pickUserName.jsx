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
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 justify-center">
        <View style={styles.safeArea}>
          <Pressable style={styles.header} onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" color="#888" size={20} />
          </Pressable>
          <View style={styles.container}>
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
                Pick a username
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="USERNAME"
              placeholderTextColor="#00AFFF"
              value={userName}
              onChangeText={setUserName}
            />
          </View>
          <TouchableOpacity
              onPress={handleContinue}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpText}>Continue</Text>
            </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PickUserNameScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 30
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
    fontSize: 15,
    padding: 10,
  },
  signUpButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
  signUpText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
