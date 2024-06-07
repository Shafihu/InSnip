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
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../Firebase/config";
import Toast from "react-native-toast-message";
import { doc, setDoc } from "firebase/firestore";

const PickAvatarScreen = () => {
  const { firstName, lastName, birthday, userName, email, password } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
          <View className="flex-[0.5]" style={{flex: 0.35, justifyContent: 'flex-end'}}>
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
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
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
    flexWrap: 'wrap',
    justifyContent: "center",
    alignItems: 'center',
    marginBottom: 20,
    flex: 0.5,
    gap: 10
  },
  imageWrapper: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 30,
    backgroundColor: 'white',
  },
  selectedImage: {
    borderColor: "#00AFFF",
    borderRadius: 50,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
