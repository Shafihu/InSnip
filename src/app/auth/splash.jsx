import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { router } from "expo-router";

export default function SplashScreen() {
  return (
    <ImageBackground
      blurRadius={0}
      source={require("../../../assets/testing.jpg")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" hidden />
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logoMain.png")}
            style={styles.logo}
          />
          <Text style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
            Capture the moment{" "}
            <Text style={{ color: "#2ecc71" }}>instantly</Text>
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            style={styles.signUpButton}
          >
            <Ionicons name="mail" size={22} color="white" />
            <Text style={styles.signUpText}>Continue with email</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/auth/signUp")}>
            <Text style={styles.loginText}>
              Don't have an account yet?
              <Text style={styles.loginLink}> Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  logo: {
    width: 175,
    height: 114,
    objectFit: "cover",
    marginRight: 5,
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 50,
  },
  signUpButton: {
    backgroundColor: "#333333",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    color: "white",
    fontWeight: "500",
    marginTop: 20,
  },
  loginLink: {
    color: "#2ecc71",
    fontWeight: "700",
  },
  uploadProgress: {
    color: "white",
    fontWeight: "500",
    marginTop: 10,
  },
});

// import { useEffect, useState } from "react";
// import { View, StyleSheet, Button } from "react-native";
// import { Audio } from "expo-av";

// export default function App() {
//   const [sound, setSound] = useState();

//   async function playSound() {
//     console.log("Loading Sound");
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../../assets/sounds/mixkit-intro-news-sound-1151.wav")
//     );
//     setSound(sound);

//     console.log("Playing Sound");
//     await sound.playAsync();
//   }

//   async function pauseSound() {
//     if (sound) {
//       console.log("Pausing Sound");
//       await sound.pauseAsync();
//     }
//   }

//   useEffect(() => {
//     return sound
//       ? () => {
//           console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.container}>
//       <Button title="Play Sound" onPress={playSound} />
//       <Button title="Pause Sound" onPress={pauseSound} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "#ecf0f1",
//     padding: 10,
//   },
// });
