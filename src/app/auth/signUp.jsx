import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, Platform , ActivityIndicator} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { FontAwesome, FontAwesome6 } from "react-native-vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../Firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from 'expo-router';

const SignUpScreen = () => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const images = [
    { id: 1, source: require("../../../assets/avatars/avatar_1.png"), path: "avatar_1.png" },
    { id: 2, source: require("../../../assets/avatars/avatar_11.png"), path: "avatar_11.png" },
    { id: 3, source: require("../../../assets/avatars/avatar_3.webp"), path: "avatar_3.webp" },
    { id: 4, source: require("../../../assets/avatars/avatar_4.webp"), path: "avatar_4.webp" },
    { id: 5, source: require("../../../assets/avatars/avatar_5.png"), path: "avatar_5.png" },
    { id: 6, source: require("../../../assets/avatars/avatar_6.png"), path: "avatar_6.png" },
    { id: 7, source: require("../../../assets/avatars/avatar_7.jpg"), path: "avatar_7.jpg" },
    { id: 8, source: require("../../../assets/avatars/avatar_8.jpg"), path: "avatar_8.jpg" },
    { id: 9, source: require("../../../assets/avatars/avatar_9.png"), path: "avatar_9.png" },
    { id: 10, source: require("../../../assets/avatars/avatar_10.webp"), path: "avatar_10.webp" },
  ];

  const handleImageSelect = (item) => {
    setSelectedAvatar(item);
  };

  const steps = [
    { 
      title: `What's your name?`, 
      fields: (
        <>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>FIRSTNAME</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              selectionColor="#2ecc71"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>LASTNAME</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              selectionColor="#2ecc71"
            />
          </View>
        </>
      )
    },
    { 
      title: `What's your birthday?`, 
      fields: (
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>DATE OF BIRTH</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={[styles.input, {marginBottom: 0}]}
              value={dob.toDateString()}
              editable={false}
              pointerEvents="none"
              selectionColor="#2ecc71"
            />
          </TouchableOpacity>
        </View>
      )
    },
    { 
      title: 'Pick a username', 
      fields: (
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>USERNAME</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            selectionColor="#2ecc71"
          />
        </View>
      )
    },
    { 
      title: 'Choose an avatar', 
      fields: (
        <View style={{flex: 1}}>
          <FlatList 
            data={images}
            contentContainerStyle={styles.imageContainer}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleImageSelect(item)}
                style={[
                  styles.imageWrapper,
                  selectedAvatar?.id === item.id && styles.selectedAvatar,
                ]}
              >
                <Image source={item.source} style={styles.image} />
              </TouchableOpacity>
            )}
          />
        </View>
      )
    },
    { 
      title: `Completing your registration`, 
      fields: (
        <>
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
                <FontAwesome6 name={showPassword ? "eye" : "eye-slash"} size={18} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
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
                <FontAwesome6 name={showPassword ? "eye" : "eye-slash"} size={18} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.privacyText}>
              By tapping sign up, you acknowledge that you have read the Privacy Policy and agree to the Terms of Service.
            </Text>
          </View>
        </>
      )
    },
  ];

  const progress = (step + 1) / steps.length;

  useEffect(() => {
    validateStep();
  }, [firstName, lastName, dob, username, selectedAvatar, email, password, step]);

  const validateStep = () => {
    switch (step) {
      case 0:
        setValid(firstName.trim() !== '' && lastName.trim() !== '');
        break;
      case 1:
        setValid(dob !== null);
        break;
      case 2:
        setValid(username.trim() !== '');
        break;
      case 3:
        setValid(selectedAvatar !== null);
        break;
      case 4:
        setValid(email.trim() !== '' && password.trim() !== '');
        break;
      default:
        setValid(false);
    }
  };

  const handleNext = async () => {
    if (!valid) return;

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const response = await createUserWithEmailAndPassword(
          FIREBASE_AUTH,
          email,
          password
        );

        navigation.goBack();

        await setDoc(doc(FIRESTORE_DB, "users", response.user.uid), {
          id: response.user.uid,
          Email: email,
          Password: password,
          FirstName: firstName,
          LastName: lastName,
          Birthday: dob,
          Username: username,
          avatar: selectedAvatar.path,
          blocked: []
        });

        await setDoc(doc(FIRESTORE_DB, "userchats", response.user.uid), {
          chats: []
        });
      } catch (error) {
        console.log("Registration Failed: " + error);
        alert('Failed to sign up. Try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={{ flexGrow: 1 }}>
          <ProgressBar progress={progress} style={styles.progressBar} color='#2ecc71' />
          <Image
            source={require('../../../assets/signUpImage.png')}
            style={styles.logo}
            contentFit="cover"
          />
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flex: 1, gap: 20 }}>
              <Text style={styles.title}>{steps[step].title}</Text>
              {steps[step].fields}
              {step === 1 && showDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={dob}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setDob(selectedDate);
                    }
                  }}
                  textColor='#333333'
                />
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {step > 0 &&
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backText}><FontAwesome name='chevron-left' size={18} color='#fff' /></Text>
              </TouchableOpacity>
            }
            <TouchableOpacity disabled={!valid} style={[styles.continueButton, { backgroundColor: valid ? '#2ecc71' : 'rgba(0,0,0,0.2)' }]} onPress={handleNext}>
            {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.continueText}>{step === steps.length - 1 ? "Sign-up" : "Continue"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '35%',
  },
  title: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 24,
    color: "#333333",
  },
  inputWrapper: {
    width: '100%',
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
  imageContainer: {
    flexDirection: "column",
    alignItems: 'center',
    flex: 1,
  },
  imageWrapper: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 30,
    backgroundColor: 'white',
    margin: 5
  },
  selectedAvatar: {
    borderColor: "#2ecc71",
    borderRadius: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '20%'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  continueButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  continueText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    alignItems: "center",
    justifyContent: 'center',
    flex: .2
  },
  backText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  privacyText: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
  },
});

export default SignUpScreen;
