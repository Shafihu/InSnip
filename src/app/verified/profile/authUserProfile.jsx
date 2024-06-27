import React, { useState, useEffect } from "react";
import { Text, Pressable, Image, StyleSheet, View, Animated, Dimensions, FlatList, ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import { useUser } from "../../../../context/UserContext";
import { pickAndUploadBanner } from "../../../../utils/pickAndUploadBanner";
import { FIREBASE_AUTH } from "../../../../Firebase/config";
import processUserImage from "../../../../utils/processUserImage";
import { router } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from 'react-native-vector-icons';
import { fetchStories } from "../../../../utils/fetchStories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../Firebase/config";
import { Video } from "expo-av";
import CustomLoader from "../../../components/CustomLoader";
import { MaterialIcons} from 'react-native-vector-icons';


const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 3;

const UserProfile = () => {
  const { userData, loading, updateProfilePicture } = useUser();
  const [profilePic, setProfilePic] = useState(null);
  const [stories, setStories] = useState([]);
  const [tab, setTab] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const scrollY = new Animated.Value(0);

  const currentUserId = userData?.id;

  useEffect(() => {
    if (userData) {
      setProfilePic(userData.picture);
      loadCurrentUserStories(currentUserId);
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

  const loadCurrentUserStories = async (currentUserId) => {
    try {
      setStoriesLoading(true);
      const fetchedStories = await fetchStories();
      const storiesWithUserDetails = await Promise.all(fetchedStories.map(async (story) => {
        const userDetails = await fetchUserDetails(story.userId);
        return { ...story, userDetails };
      }));

      const currentUserStories = storiesWithUserDetails.filter((item) => item.userId === currentUserId);
      setStories(currentUserStories);
      await AsyncStorage.setItem('currentUserStories', JSON.stringify(currentUserStories));
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const docRef = doc(FIRESTORE_DB, 'users', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    return null;
  };

  const renderItem = ({ item }) => (
    <View style={styles.storyContainer}>
      {item.type.startsWith('image/') && (
        <Image source={{ uri: item.url }} style={styles.storyImage} />
      )}
      {item.type.startsWith('video/') && (
        <Video source={{ uri: item.url }} style={styles.storyVideo} resizeMode="cover" shouldPlay isLooping/>
      )}
      <View style={{position: 'absolute', top: 5, right: 5, zIndex: 50}}>
        <MaterialIcons name= {item.type.startsWith('image/') ? 'photo' : 'video-collection'} size={15} color="#fff" />
      </View>
    </View>
  );

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
      <Animated.View style={{ flex: 1, paddingTop: HEADER_MAX_HEIGHT }}>
        <View style={styles.scrollViewInner}>
          {userData ? (
            <>
              <View style={styles.userContainer}>
                <Pressable style={styles.userImageContainer}>
                  <Image source={processUserImage(userData.avatar)} style={styles.userImage} />
                </Pressable>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.userInfo}>{userData.FirstName} {userData.LastName}</Text>
                  <Text style={styles.userUsername}>{userData.Username}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text>No user data available</Text>
          )}
          <Pressable onPress={handleSignOut} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
          <View style={styles.tabContainer}>
            <Pressable onPress={toggleTab} style={[styles.tabButton, tab && styles.activeTab]}>
              <Text style={[styles.tabText, tab && styles.activeTabText]}>Stories</Text>
            </Pressable>
            <Pressable onPress={toggleTab} style={[styles.tabButton, !tab && styles.activeTab]}>
              <Text style={[styles.tabText, !tab && styles.activeTabText]}>Spotlight</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.contentContainer}>
          {storiesLoading && (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomLoader />
          </View>
          )}
          {tab ? (
            <FlatList
              data={stories}
              renderItem={renderItem}
              keyExtractor={(item) => item.url}
              showsHorizontalScrollIndicator={false}
              numColumns={3}
              contentContainerStyle={styles.storiesList}
            />
          ) : (
            <ScrollView contentContainerStyle={styles.spotlightContainer}>
              <View style={styles.spotlightContent}>
                <Text style={styles.spotlightText}>Spotlight content here</Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
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
  scrollViewInner: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userImageContainer: {
    borderWidth: 3,
    borderColor: '#2ecc71',
    borderRadius: '100%',
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  userInfoContainer: {
    justifyContent: 'center',
    gap: 2,
  },
  userInfo: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
  userUsername: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  logoutButton: {
    width: '100%',
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    textAlign: 'center',
    fontWeight: 'bold',
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
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,.35)',
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    zIndex: 99999,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    width: '50%',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#333333',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#333333',
  },
  contentContainer: {
    flex: 1,
  },
  storiesList: {
    justifyContent: 'space-between',
  },
  storyContainer: {
    width: CARD_WIDTH,
    height: 200,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  spotlightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spotlightContent: {
    backgroundColor: 'blue',
    width: '100%',
    height: 200,
  },
  spotlightText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});
