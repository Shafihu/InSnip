import { View, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, Entypo, FontAwesome } from 'react-native-vector-icons';
import { useChatStore } from '../../../context/ChatContext';

const Bottom = ({ handleSend, handlePickImage, user }) => {
  const [message, setMessage] = useState("");

  const {isCurrentUserBlocked, isReceiverBlocked} = useChatStore();

  const onSend = () => {
    if (message.trim() || handlePickImage) {
      handleSend(message.trim());
      setMessage("");
    }
  };

  return (
    <View className="flex flex-row justify-between items-start p-3 gap-3 h-[60px] bg-white">
      <View className="w-[35px] h-[35px] rounded-full items-center justify-center">
        <Pressable disabled={isCurrentUserBlocked || isReceiverBlocked} className="w-[40px] h-[40px] rounded-full items-center justify-center bg-black/5">
          <FontAwesome name="camera" size={18} color={isReceiverBlocked ? 'gray' : "rgb(50,50,50)"} />
        </Pressable>
      </View>
      <View className="flex-1 bg-black/5 rounded-full h-full px-3">
        <TextInput
          placeholder="Chat"
          placeholderTextColor={isReceiverBlocked ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.5)'}
          className="h-full rounded-full text-[17px]"
          value={message}
          onChangeText={(text) => setMessage(text)}
          onSubmitEditing={onSend}
          returnKeyType='send'
          readOnly={isCurrentUserBlocked || isReceiverBlocked}
        />
      </View>
      <View className="flex flex-row">
        <Pressable disabled={isCurrentUserBlocked || isReceiverBlocked} onPress={onSend} className="w-[40px] h-[40px] rounded-full items-center justify-center">
          <Ionicons name="send" size={25} color={isReceiverBlocked ? 'gray' : "#00bfff"} />
        </Pressable>
        {/* <Pressable disabled={isCurrentUserBlocked || isReceiverBlocked} className="w-[40px] h-[40px] rounded-full items-center justify-center">
          <Entypo name="emoji-flirt" size={25} color={isReceiverBlocked ? 'gray' : "rgb(50,50,50)"}  />
        </Pressable> */}
        <Pressable disabled={isCurrentUserBlocked || isReceiverBlocked} onPress={handlePickImage} className="w-[40px] h-[40px] rounded-full items-center justify-center">
          <Ionicons name="images-outline" size={23} color={isReceiverBlocked ? 'gray' : "rgb(50,50,50)"}  className="transform rotate-90" />
        </Pressable>
      </View>
    </View>
  );
};

export default Bottom;
