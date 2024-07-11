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
  Image
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../Firebase/config";
import { useNavigation } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    validateEmail();
    validatePassword();
  }, [email, password]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidEmail(emailRegex.test(email.trim()));
  };

  const validatePassword = () => {
    if (password.trim() !== '') {
      if (password.trim().length < 6) {
        setValidPassword(1);
        console.log('Weak password');
      } else if (password.trim().length >= 6 && password.trim().length < 12) {
        setValidPassword(2);
        console.log('Strong password');
      } else if (password.trim().length >= 12) {
        setValidPassword(3);
        console.log('Very Strong password');
      }
    } else {
      setValidPassword(0);
    }
  };

  const handleLogin = async () => {
    if (!validEmail || password.trim() === '') {
      Alert.alert("Error", "Please enter a valid email and password");
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
      console.log('Response: ' + [...response]);
      navigation.goBack();
    } catch (error) {
      console.log("Sign In Failed: " + error);
      Alert.alert("☹️", "Invalid email or password. Please try again.");
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
                style={[
                  styles.input,
                  {
                    borderColor:
                      email.trim() === ""
                        ? "gray"
                        : validEmail
                        ? "#2ecc71"
                        : "red",
                  },
                ]}
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
                  style={[
                    styles.input,
                    {
                      borderColor:
                        validPassword === 0
                          ? "gray"
                          : validPassword === 1
                          ? "red"
                          : validPassword === 2
                          ? "orange"
                          : validPassword === 3 && "#2ecc71",
                    },
                  ]}
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
              disabled={!validEmail}
              onPress={handleLogin}
              style={[
                styles.loginButton,
                {
                  backgroundColor: validEmail ? "#2ecc71" : "rgba(0,0,0,0.2)",
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

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 0,
    marginHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "30%",
  },
  loginContainer: {
    width: "100%",
    alignItems: "center",
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
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%'
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: '25%'
  },
  loginButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginVertical: 8,
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
