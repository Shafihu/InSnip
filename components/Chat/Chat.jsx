import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { MaterialIcons, Feather } from 'react-native-vector-icons';
import { router } from 'expo-router';

const Chat = ({ handleChatCam }) => {
  return (
    <Pressable
    onPress={()=>router.push('/verified/chatRoom')}
    className="flex flex-row items-center justify-between gap-4 bg-white py-2 px-3 pr-5 border border-t-1 border-b-0 border-l-0 border-r-0 border-gray-200"
  >
    <View className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden">
      <Image
        source={require('../../assets/avatars/user.png')}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
    <View className="flex-1">
      <Text className="font-medium text-lg tracking-wider capitalize">John</Text>
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
  </Pressable>
  )
}

export default Chat