import { Text, Pressable, Image, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import { useUser } from "../../../../context/UserContext";
import { pickAndUploadImage } from "../../../../utils/pickAndUploadImage";
import processUserImage from "../../../../utils/processUserImage";
import { FIREBASE_AUTH } from "../../../../Firebase/config";

const UserProfile = () => {
  const { userData, loading, updateProfilePicture } = useUser();
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (userData) {
      setProfilePic(userData.picture);
    }
  }, [userData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
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

  const handlePickImage = async () => {
    try {
      const downloadURL = await pickAndUploadImage();
      setProfilePic(downloadURL);
      if (userData && userData.id) {
        await updateProfilePicture(userData.id, downloadURL);
      } else {
        console.error("User data or UID is not available");
        showErrorToast("User data or UID is not available");
      }
    } catch (error) {
      console.error("Error handling image:", error);
      showErrorToast("Error handling image");
    }
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Pressable onPress={handlePickImage}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.userImage} />
            ) : (
              <View>
                <Text>No banner pic</Text>
              </View>
            )}
            <Image source={processUserImage(userData.UserImage)} style={styles.userImage} />
          </Pressable>
          <Text style={styles.userInfo}>{userData.Username}</Text>
        </>
      ) : (
        <Text>No user data available</Text>
      )}
      <Pressable onPress={handleSignOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
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
