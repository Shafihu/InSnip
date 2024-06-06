import { View, Text, ScrollView, ActivityIndicator, Pressable, Image, Button, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import { Entypo, MaterialIcons, Feather } from 'react-native-vector-icons';
import getUserStories from '../utils/getUserStories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatList from './Chat/Chat';

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

const Chat = () => {
  const circleSize = 60;

  const [loading, setLoading] = useState(false);


  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <Header header="Chat" />
      <View style={{ flex: 1, backgroundColor: 'rgb(243, 244, 246)' }}>
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
                <ChatList />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Chat;
