import React, { useState, useEffect } from "react";
import { Text, Pressable, Image, StyleSheet, View, Animated, Dimensions } from "react-native";
import { signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import { useUser } from "../../../../context/UserContext";
import { pickAndUploadBanner } from "../../../../utils/pickAndUploadBanner";
import { FIREBASE_AUTH } from "../../../../Firebase/config";
import processUserImage from "../../../../utils/processUserImage";
import { router } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from 'react-native-vector-icons';

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const {width} = Dimensions.get('window');
const CARD_WIDTH = width/3;

const UserProfile = () => {
  const { userData, loading, updateProfilePicture } = useUser();
  const [profilePic, setProfilePic] = useState(null);
  const [tab, setTab] = useState(true);
  const scrollY = new Animated.Value(0);

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
      const downloadURL = await pickAndUploadBanner();
      setProfilePic(downloadURL);
      if (userData && userData.id) {
        await updateProfilePicture(userData.id, downloadURL);
      } else {
        console.error("User data or ID is not available");
        showErrorToast("User data or ID is not available");
      }
    } catch (error) {
      console.error("Error handling image:", error);
      showErrorToast("Error handling image");
    }
  };

  const toggleTab = () => {
    setTab(prev => !prev);
}

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });


  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <FontAwesome6 name="chevron-left" color="#fff" size={20} />
        </Pressable>
        <Pressable onPress={handlePickImage} style={styles.button}>
          <MaterialCommunityIcons name="image-edit-outline" color="#fff" size={20} />
        </Pressable>
      </View>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={profilePic ? { uri: profilePic } : processUserImage(userData?.avatar)}
          style={[
            styles.headerImage,
            { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] },
          ]}
        />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.scrollViewInner}>
          {userData ? (
            <>
              <View className="flex-1 flex-row items-center gap-4">
                <Pressable style={{ borderWidth: 3, borderColor: '#2ecc71', borderRadius: '100%' }}>
                  <Image source={processUserImage(userData.avatar)} style={styles.userImage} />
                </Pressable>
                <View className="w-full h-full items-start justify-center gap-2">
                  <Text style={styles.userInfo} className="font-bold tracking-wide">{userData.FirstName} {userData.LastName}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 500, color: '#7f8c8d'}}>{userData.Username}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text>No user data available</Text>
          )}
          <Pressable onPress={handleSignOut} className="w-full">
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                <Pressable onPress={toggleTab} style={{borderBottomWidth: tab && 3, borderColor: '#333333', width: '50%', padding: 10}}>
                      <Text style={{color: tab ? '#333333' : '#7f8c8d', fontWeight: 'bold', fontSize: 15, textAlign: 'center'}}>Stories</Text>
                </Pressable>
                <Pressable onPress={toggleTab} style={{borderBottomWidth: !tab && 3, borderColor: '#333333', width: '50%', padding: 10}}>
                      <Text style={{color: !tab ? '#333333' : '#7f8c8d', fontWeight: 'bold', fontSize: 15, textAlign: 'center'}}>Spotlight</Text>
                </Pressable>
            </View>
        </View>
        <View style={{ height: '100%', width: '100%', flexWrap: 'wrap', flexDirection: 'row'}}>
              {tab && 
                  <>
                      <View style={{backgroundColor: 'red', width: CARD_WIDTH, height: 200}}></View>
                  </>
              }
              {!tab && 
                  <>
                      <View style={{backgroundColor: 'blue', width: CARD_WIDTH, height: 200}}></View>
                  </>
              }
                </View>
      </Animated.ScrollView>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2ecc71',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewInner: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  userInfo: {
    fontSize: 20,
    color: '#333333'
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 999,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,.35)',
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: 40,
    width: 40,
    zIndex: 99999
  }
});
