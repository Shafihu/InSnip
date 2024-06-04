import { View, Text, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH } from "../../../Firebase/config";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Toast from "react-native-toast-message";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  const showSuccessToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleSignOut = () => {
    try {
      signOut(FIREBASE_AUTH);
      // showSuccessToast("Logout Successful!");
    } catch (error) {
      showErrorToast("Failed to logout!");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Pressable
      onPress={handleSignOut}
      className="flex-1 items-center justify-center"
    >
      <Text>{user && user.email}</Text>
      <Text>Log Out</Text>
    </Pressable>
  );
};

export default UserProfile;
