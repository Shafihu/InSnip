import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { FontAwesome5, FontAwesome } from 'react-native-vector-icons'
import { router } from 'expo-router'
import processUserImage from '../../../utils/processUserImage'
import { useChatStore } from '../../../context/ChatContext'

const Header = ({title, avatar, firstname, lastname, id, username, user}) => {
  const {isReceiverBlocked} = useChatStore()
  return (
    <Pressable onPress={()=>router.push({
      pathname: '/verified/profile/[otherUserProfile]',
      params: {
        id: id,
        firstname: firstname,
        lastname: lastname,
        username: username,
        avatar: avatar,
        user: user,
      }
    })} className="h-[60px] flex flex-row items-center justify-between gap-2 px-2 bg-white">
      <Pressable onPress={()=>router.back()} className="w-[40px] h-[40px] rounded-full items-center justify-center ">
        <FontAwesome5 name="chevron-left" size={25} color="#3B2F2F" />
      </Pressable>
      <View className="flex-1 flex-row items-center gap-3">
        <View className="bg-red-500 w-[30px] h-[30px] rounded-full">
          <Image source={isReceiverBlocked ? require('../../../assets/placeholder.png') : processUserImage(avatar)}  style={{objectFit: 'cover', width: '100%', height: '100%', borderRadius: '100%'}} />
        </View>
        <Text className="font-bold tracking-wider text-[18px] text-[#3B2F2F]" numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
      </View>
      <View className="flex flex-row gap-2">
      <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center bg-black/5">
        <FontAwesome name="phone" size={21} color="#3B2F2F" />
      </Pressable>
      <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center bg-black/5">
        <FontAwesome name="video-camera" size={18} color="#3B2F2F" />
      </Pressable>
      </View>
    </Pressable>
  )
}

export default Header