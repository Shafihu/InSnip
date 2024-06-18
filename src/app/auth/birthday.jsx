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
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

const BirthdayScreen = () => {
  const { firstName, lastName } = useLocalSearchParams();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthdate, setBirthdate] = useState(new Date());

  const showToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleContinue = () => {
    if (!birthdate) {
      showToast("Birthday is required!");
    } else {
      router.push({
        pathname: "/auth/pickUserName",
        params: {
          firstName: firstName,
          lastName: lastName,
          birthday: birthdate,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.header} onPress={() => router.back()}>
        <FontAwesome6 name="chevron-left" color="#888" size={20} />
      </Pressable>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>What's your birthday?</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="BIRTHDAY"
              placeholderTextColor="#00AFFF"
              value={birthdate.toDateString()}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={birthdate}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setBirthdate(selectedDate);
                }
              }}
            />
          )}
          <TouchableOpacity onPress={handleContinue} style={styles.signUpButton}>
            <Text style={styles.signUpText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BirthdayScreen;

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
