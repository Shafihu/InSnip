import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../Firebase/config";
import Toast from "react-native-toast-message";
import { doc, setDoc } from "firebase/firestore";

const PickAvatarScreen = () => {
  const { firstName, lastName, birthday, userName, email, password } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, source: require("../../assets/avatars/user.png"), path: "user.png" },
    { id: 2, source: require("../../assets/avatars/avatar_5.png"), path: "avatar_5.png" },
  ];

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Account Created Successfully!🎉",
    });
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    console.log("Selected Image: ", image);
  };

  const handleSignUp = async () => {
    if (!selectedImage) {
      showErrorToast("Please select an avatar!");
      return;
    }

    console.log("Sign Up Data: ", {
      email,
      password,
      firstName,
      lastName,
      birthday,
      userName,
      UserImage: selectedImage.path,
    });

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      showSuccessToast();

      try {
        await setDoc(doc(FIRESTORE_DB, "users", response.user.uid), {
          Email: email,
          Password: password,
          FirstName: firstName,
          LastName: lastName,
          Birthday: birthday,
          Username: userName,
          UserImage: selectedImage.path,
        });

      } catch (e) {
        console.log("Error adding document: " + e);
        showErrorToast("Failed to add user data. Try again.");
      }
    } catch (error) {
      console.log("Registration Failed: " + error);
      showErrorToast('Failed to sign up. Try again.');
    } finally {
      setLoading(false);
    }
  };

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
                fontSize: 22,
                color: "#333",
                marginBottom: 40,
              }}
            >
              Choose an avatar
            </Text>
          </View>
          <View style={styles.imageContainer}>
            {images.map((image) => (
              <TouchableOpacity
                key={image.id}
                onPress={() => handleImageSelect(image)}
                style={[
                  styles.imageWrapper,
                  selectedImage?.id === image.id && styles.selectedImage,
                ]}
              >
                <Image source={image.source} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.loginText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default PickAvatarScreen;

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
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  imageWrapper: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
  },
  selectedImage: {
    borderColor: "#00AFFF",
    borderRadius: 50,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  loginButton: {
    backgroundColor: "#00AFFF",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
