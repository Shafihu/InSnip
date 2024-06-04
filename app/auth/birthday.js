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
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";

const FullNameScreen = () => {
  const { firstName, lastName } = useLocalSearchParams();
  const [birthdate, setBirthdate] = useState();

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
                fontSize: "22",
                color: "#333",
                marginBottom: 40,
              }}
            >
              What's your birthday?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="BIRTHDAY"
              placeholderTextColor="#00AFFF"
              value={birthdate}
              onChangeText={setBirthdate}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/auth/pickUserName",
                params: {
                  firstName: firstName,
                  lastName: lastName,
                  birthday: birthdate,
                },
              })
            }
            style={styles.signUpButton}
          >
            <Text style={styles.signUpText}>Continue</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default FullNameScreen;

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
