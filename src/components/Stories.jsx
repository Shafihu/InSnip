import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, SafeAreaView, Pressable, Modal, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
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
    <SafeAreaView style={{ flex: 1 }}>
      <Header header="Stories" />
        <View>
          {showLoader && 
            <View style={styles.loaderContainer}>
              <CustomLoader />
            </View>
          }
            <ScrollView
            contentContainerStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor='transparent'/>
          }
        >
          <View className="ml-2">
            <Text className="text-[16px] font-medium" style={{ color: '#3B2F2F' }}>Friends</Text>
            <ScrollView className="h-fit w-full py-2" horizontal showsHorizontalScrollIndicator={false}>
              {users && users.length > 0 ? (
                users.map((item) => (
                  <View key={item.id} className="flex flex-col item-center justify-center gap-3 mr-3 w-[80px]">
                    <View className="w-[80px] h-[80px] rounded-full bg-white border-2 relative" style={{ borderColor: '#2F3E46' }}>
                      <View className=" w-[50px] h-[23px] rounded-full absolute -bottom-3 left-[50%] flex items-center justify-center overflow-hidden z-50" style={{ backgroundColor: '#2F3E46', transform: [{ translateX: -25 }] }}>
                        <MaterialCommunityIcons
                          name="account"
                          size={18}
                          color="white"
                        />
                      </View>
                      <View className="w-full h-full bg-gray-100 rounded-full border-2 border-white overflow-hidden">
                        <Image source={processUserImage(item.avatar)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '100%' }} />
                      </View>
                    </View>
                    <View className="flex flex-col items-center justify-center">
                      <Text className="font-medium text-center" style={{ color: '#3B2F2F' }} numberOfLines={1} ellipsizeMode="tail">{item.FirstName}</Text>
                      <Text className="text-[11px] text-gray-400 text-center" numberOfLines={1}>{item.Username}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No data available!</Text>
              )}
            </ScrollView>
          </View>
          <View className="mx-2">
            <Text className="text-[16px] font-medium mb-2" style={{ color: '#3B2F2F' }}>Discover</Text>
            {storiesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="gray" size="small" />
              </View>
            ) : (
              <View style={styles.scrollContainer}>
                {stories.map((story, index) => (
                  <Pressable onPress={() => handlePressStory(story)} key={index} style={styles.itemContainer}>
                    {story && story.type && story.type.startsWith('image/') ? (
                      <Image source={{ uri: story.url }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : story && story.type && story.type.startsWith('video/') ? (
                      <Video
                        source={{ uri: story.url }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text>Unsupported media type</Text>
                    )}
                    <LinearGradient colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.3)']} style={styles.background}>
                      <Text className="text-white text-[16px] font-bold">{story.userDetails ? story.userDetails.Username : 'Unknown'}</Text>
                    </LinearGradient>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
            </ScrollView>
        </View>

      {selectedStory && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: 'black', borderRadius: 30, overflow: 'hidden' }}>
            <Pressable onPress={handleClosePreview} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 15, overflow: 'hidden' }}>
              {selectedStory && selectedStory.type && selectedStory.type.startsWith('image/') ? (
                <Image source={{ uri: selectedStory.url }} style={{ width: '100%', height: '100%' }} contentFit='cover' />
              ) : selectedStory && selectedStory.type && selectedStory.type.startsWith('video/') ? (
                <Video
                  source={{ uri: selectedStory.url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  useNativeControls
                  shouldPlay
                  isLooping
                />
              ) : (
                <Text style={styles.errorText}>Oops! Something went wrong.</Text>
              )}
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} style={styles.overlay}>
                <Image
                  source={processUserImage(selectedStory.userDetails.avatar)}
                  style={{ width: 50, height: 50, borderRadius: '100%' }}
                  contentFit='cover'
                />
                <Text style={styles.username}>{selectedStory.userDetails ? selectedStory.userDetails.Username : 'Unknown'}</Text>
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
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  itemContainer: {
    width: '49%',
    maxHeight: 300,
    backgroundColor: 'yellow',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 8,
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
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});
