import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, SafeAreaView, Pressable, Modal, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import { useUsers } from '../../context/UsersContext';
import { Image } from 'expo-image';
import { Video } from 'expo-av';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../Firebase/config';
import processUserImage from '../../utils/processUserImage';
import { fetchStories } from '../../utils/fetchStories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoader from './CustomLoader';
import { MaterialIcons, MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
const { width } = Dimensions.get('window');

const Stories = () => {
  const { users, loading } = useUsers();
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const cachedStories = await AsyncStorage.getItem('stories');
      if (cachedStories) {
        setStories(JSON.parse(cachedStories));
        setStoriesLoading(false);
        return;
      }

      const fetchedStories = await fetchStories();
      const storiesWithUserDetails = await Promise.all(fetchedStories.map(async (story) => {
        const userDetails = await fetchUserDetails(story.userId);
        return { ...story, userDetails };
      }));

      setStories(storiesWithUserDetails);
      await AsyncStorage.setItem('stories', JSON.stringify(storiesWithUserDetails));
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const pullRefreshStories = async () => {
    const fetchedStories = await fetchStories();
    const storiesWithUserDetails = await Promise.all(fetchedStories.map(async (story) => {
      const userDetails = await fetchUserDetails(story.userId);
      return { ...story, userDetails };
    }));

    setStories(storiesWithUserDetails);
    await AsyncStorage.setItem('stories', JSON.stringify(storiesWithUserDetails));
  }

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

  const handlePressStory = (story) => {
    setSelectedStory(story);
    console.log(story?.type);
  };

  const handleClosePreview = () => {
    setSelectedStory(null);
  };

  const onRefresh = async () => {
    setShowLoader(true);
    setRefreshing(true);
    await pullRefreshStories();
    setRefreshing(false);
    setShowLoader(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header header="Stories" />
      <View>
        {showLoader &&
          <View style={styles.loaderContainer}>
            <CustomLoader />
          </View>
        }
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor='transparent' />
          }
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friends</Text>
            <ScrollView style={styles.horizontalScrollView} horizontal showsHorizontalScrollIndicator={false}>
              {users && users.length > 0 ? (
                users.map((item) => (
                  <View key={item.id} style={styles.userContainer}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.accountIconContainer}>
                        <MaterialCommunityIcons name="account" size={18} color="white" />
                      </View>
                      <View style={styles.avatar}>
                        <Image source={processUserImage(item.avatar)} style={styles.avatarImage} />
                      </View>
                    </View>
                    <View style={styles.userDetailsContainer}>
                      <Text style={styles.userFirstName} numberOfLines={1} ellipsizeMode="tail">{item.FirstName}</Text>
                      <Text style={styles.userUsername} numberOfLines={1}>{item.Username}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No data available!</Text>
              )}
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Discover</Text>
            {storiesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="gray" size="small" />
              </View>
            ) : (
              <View style={styles.storiesContainer}>
                {stories.map((story, index) => (
                  <Pressable onPress={() => handlePressStory(story)} key={index} style={styles.storyItem}>
                    <View style={{position: 'absolute', top: 5, right: 5, zIndex: 50}}>
                      <MaterialIcons name= {story.type.startsWith('image/') ? 'photo' : 'video-collection'} size={15} color="#fff" />
                    </View>
                    {story && story.type && story.type.startsWith('image/') ? (
                      <Image source={{ uri: story.url }} style={styles.storyMedia} />
                    ) : story && story.type && story.type.startsWith('video/') ? (
                      <Video source={{ uri: story.url }} style={styles.storyMedia} resizeMode="cover" />
                    ) : (
                      <Text>Unsupported media type</Text>
                    )}
                    <LinearGradient colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.3)']} style={styles.storyOverlay}>
                      <Text numberOfLines={1} ellipsizeMode='trail' style={styles.storyUsername}>{story.userDetails ? story.userDetails.Username : 'Unknown'}</Text>
                    </LinearGradient>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {selectedStory && (
        <Modal visible={true} transparent={true} animationType="fade">
          <SafeAreaView style={styles.modalContainer}>
            <Pressable onPress={handleClosePreview} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
            <View style={styles.modalContent}>
              {selectedStory && selectedStory.type && selectedStory.type.startsWith('image/') ? (
                <Image source={{ uri: selectedStory.url }} style={styles.modalMedia} />
              ) : selectedStory && selectedStory.type && selectedStory.type.startsWith('video/') ? (
                <Video source={{ uri: selectedStory.url }} style={styles.modalMedia} resizeMode="cover" useNativeControls shouldPlay isLooping />
              ) : (
                <Text style={styles.errorText}>Oops! Something went wrong.</Text>
              )}
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} style={styles.modalOverlay}>
                <Image source={processUserImage(selectedStory.userDetails.avatar)} style={styles.modalAvatar} />
                <Text numberOfLines={1} ellipsizeMode='trail' style={styles.modalUsername}>{selectedStory.userDetails ? selectedStory.userDetails.Username : 'Unknown'}</Text>
              </LinearGradient>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Stories;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  section: {
    marginHorizontal: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Text Color
    marginBottom: 8,
  },
  horizontalScrollView: {
    paddingVertical: 8,
  },
  userContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 80,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2ecc71', // Primary Color
    position: 'relative',
    marginBottom: 8,
  },
  accountIconContainer: {
    width: 50,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#2ecc71', // Primary Color
    position: 'absolute',
    bottom: -12,
    left: '50%',
    transform: [{ translateX: -25 }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  userDetailsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userFirstName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333', // Text Color
    textAlign: 'center',
  },
  userUsername: {
    fontSize: 11,
    color: '#7f8c8d', // Subtext Color
    textAlign: 'center',
  },
  storiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  storyItem: {
    width: '49%',
    height: 280,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  storyMedia: {
    width: '100%',
    height: '100%',
  },
  storyOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  storyUsername: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 30,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalMedia: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: 'red',
  },
  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  modalUsername: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
