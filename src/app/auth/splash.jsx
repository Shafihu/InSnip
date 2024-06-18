import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/snapchat.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => router.push("/auth/fullName")}
          style={styles.signUpButton}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.loginText}>
            Already have an account?
            <Text style={styles.loginLink}> Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFC00",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 50,
  },
  signUpButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#333",
    fontWeight: "500",
    marginTop: 20,
  },
  loginLink: {
    color: "#00AFFF",
    fontWeight: "500",
  },
});
