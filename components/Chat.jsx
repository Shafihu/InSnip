import { View, Text, ScrollView, ActivityIndicator, Pressable, Image, Button, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import { Entypo, MaterialIcons, Feather } from 'react-native-vector-icons';
import getUserStories from '../utils/getUserStories';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatarMap = {
  avatar1: require('../assets/avatars/avatar_1.png'),
  avatar2: require('../assets/avatars/avatar_11.png'),
  avatar3: require('../assets/avatars/avatar_3.webp'),
  avatar4: require('../assets/avatars/avatar_4.webp'),
  avatar5: require('../assets/avatars/avatar_5.png'),
  avatar6: require('../assets/avatars/avatar_6.png'),
  avatar7: require('../assets/avatars/avatar_7.jpg'),
  avatar8: require('../assets/avatars/avatar_8.jpg'),
  avatar9: require('../assets/avatars/avatar_9.png'),
  avatar10: require('../assets/avatars/avatar_10.webp'),
};

const Chat = ({ handleChatCam }) => {
  const circleSize = 60;

  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStories = useCallback(async () => {
    setLoading(false);
    try {
      const res = await getUserStories();
      setUserStories(res);
      await AsyncStorage.setItem('userStories', JSON.stringify(res));
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const cachedStories = await AsyncStorage.getItem('userStories');
        if (cachedStories) {
          setUserStories(JSON.parse(cachedStories));
        } else {
          await fetchStories();
        }
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, [fetchStories]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStories();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <Header header="Chat" />
      <View style={{ flex: 1, backgroundColor: 'rgb(243, 244, 246)' }}>
        {/* <Button title="Refresh" onPress={fetchStories} /> */}
        <View
          style={{
            backgroundColor: '#00BFFF',
            borderRadius: circleSize / 2,
            width: circleSize,
            height: circleSize,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 90,
            right: 15,
            marginBottom: 28,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
            zIndex: 99,
          }}
        >
          <Entypo name="new-message" size={25} color="white" />
        </View>
        <ScrollView
          className="flex-1 mb-28"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="flex flex-row items-center justify-between gap-4 bg-white p-3 m-2 rounded-2xl">
            <View className="w-[60px] h-[60px] bg-yellow-200 rounded-full flex items-center justify-center">
              <Entypo name="archive" size={30} color="black" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-lg">Archived</Text>
            </View>
            <View className="items-center justify-center">
              <Text className="text-xl tracking-widest font-semibold text-[#FFD700]">New</Text>
              <Entypo name="new" size={25} color="#FFD700" />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              {userStories.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-row items-center justify-between gap-4 bg-white py-2 px-3 pr-5 border border-t-1 border-b-0 border-l-0 border-r-0 border-gray-200"
                >
                  <View className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden">
                    <Image
                      source={avatarMap[`avatar${item.avatarId}`] || require('../assets/avatars/user.png')}
                      style={{ width: '100%', height: '100%' }}
                      onError={(error) => console.error('Image loading error:', error)}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-lg tracking-wider capitalize">{item.nickName}</Text>
                    <View className="flex flex-row items-center gap-2">
                      <MaterialIcons
                        name="chat-bubble-outline"
                        size={12}
                        color="#00BFFF"
                        className="transform scale-x-[-1]"
                      />
                      <Text className="text-[11px] font-medium text-gray-500">Tap to chat</Text>
                    </View>
                  </View>
                  <Pressable onPress={handleChatCam}>
                    <Feather name="camera" size={20} color="#B0B0B0" />
                  </Pressable>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Chat;
