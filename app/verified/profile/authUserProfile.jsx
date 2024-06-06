import { Text, Pressable, Image, StyleSheet } from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../../../Firebase/config";
import { signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import processUserImage from "../../../utils/processUserImage";
import { useUser } from "../../../context/UserContext";

const UserProfile = () => {
  const { userData, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleSignOut = () => {
    try {
      signOut(FIREBASE_AUTH);
    } catch (error) {
      showErrorToast("Failed to logout!");
    }
  };


  return (
    <Pressable
      onPress={handleSignOut}
      style={styles.container}
    >
      {userData ? (
        <>
          <Image
            source={processUserImage(userData.UserImage)}
            style={styles.userImage}
          />
          <Text style={styles.userInfo}>{userData.Username}</Text>
        </>
      ) : (
        <Text>No user data available</Text>
      )}
      <Text style={styles.logoutText}>Log Out</Text>
    </Pressable>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});
