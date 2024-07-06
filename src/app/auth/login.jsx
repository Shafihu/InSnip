import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../Firebase/config";
import { Image, ImageBackground } from "expo-image";
import { router, useNavigation } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    validateInput();
  }, [email, password]);

  const validateInput = () => {
    setValid(email.trim() !== "" && password.trim() !== "");
  };

  const handleLogin = async () => {
    if (!valid) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      setEmail("");
      setPassword("");
      navigation.goBack();
    } catch (error) {
      console.log("Sign In Failed: " + error);
      Alert.alert("Error", "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={require("../../../assets/login2.png")}
            style={styles.logo}
            contentFit="cover"
          />
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Welcome Back</Text>
            <Text style={styles.loginSubtitle}>
              Please enter your details to continue
            </Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email.toLowerCase()}
                onChangeText={setEmail}
                keyboardType="email-address"
                selectionColor="#2ecc71"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  selectionColor="#2ecc71"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome6
                    name={showPassword ? "eye" : "eye-slash"}
                    size={18}
                    color="#7f8c8d"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              disabled={!valid}
              onPress={handleLogin}
              style={[
                styles.loginButton,
                {
                  backgroundColor: valid ? "#2ecc71" : "rgba(0,0,0,0.2)",
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.loginText}>Sign-in</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    borderRadius: 25,
    marginHorizontal: 10,
    zIndex: 99
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    marginHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    backgroundColor: '#2F3E46',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingBottom: 12,
  },
  logo: {
    width: '100%',
    height: '38%',
  },
  logoText: {
    fontWeight: '500',
    fontSize: 35,
    letterSpacing: 0.8,
    color: '#2F3E46',
    marginLeft: 10,
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginTitle: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 28,
    color: "#333333",
    marginBottom: 4,
  },
  loginSubtitle: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: "#333333",
    marginBottom: 5,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: "#2ecc71",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    fontWeight: "500",
    backgroundColor: '#ffffff',
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  loginButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: '100%',
    marginVertical: 8
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#7f8c8d",
    textAlign: "center",
    fontWeight: "500",
  },
});
