import { View, Text, Pressable } from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../../../Firebase/config";
import { signOut } from "firebase/auth";

const UserProfile = () => {
  return (
    <Pressable
      onPress={() => signOut(FIREBASE_AUTH)}
      className="flex-1 items-center justify-center"
    >
      <Text>Log Out</Text>
    </Pressable>
  );
};

export default UserProfile;
