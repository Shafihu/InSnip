import { View, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, Entypo, FontAwesome } from 'react-native-vector-icons';

const Bottom = () => {
  const [message, setMessage] = useState("");

  console.log(message)

  return (
    <View className="flex flex-row justify-between items-start p-3 gap-3 h-[60px] bg-white">
      <View className="w-[35px] h-[35px] rounded-full items-center justify-center">
        <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center bg-black/5">
          <FontAwesome name="video-camera" size={18} color="gray" />
        </Pressable>
      </View>
      <View className="flex-1 bg-black/5 rounded-full h-full px-3">
        <TextInput
          placeholder="Chat"
          className="h-full rounded-full text-[17px]"
          value={message}
          onChangeText={(text) => setMessage(text)}
          returnKeyType='send'
        />
      </View>
      <View className="flex flex-row">
        <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center">
          <Ionicons name="send" size={25} color="gray" />
        </Pressable>
        <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center">
          <Entypo name="emoji-flirt" size={25} color="gray" />
        </Pressable>
        <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center">
          <Ionicons name="images-outline" size={23} color="gray" className="transform rotate-90" />
        </Pressable>
      </View>
    </View>
  );
};

export default Bottom;
