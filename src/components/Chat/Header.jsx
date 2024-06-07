import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { FontAwesome5, FontAwesome } from 'react-native-vector-icons'
import { router } from 'expo-router'

const Header = () => {
  return (
    <View className="h-[60px] flex flex-row items-center justify-between gap-2 px-2 bg-white">
      <Pressable onPress={()=>router.back()} className="w-[40px] h-[40px] rounded-full items-center justify-center ">
        <FontAwesome5 name="chevron-left" size={25} color="gray" />
      </Pressable>
      <View className="flex-1 flex-row items-center gap-3">
        <View className="bg-red-500 w-[30px] h-[30px] rounded-full"></View>
        <Text className="font-bold tracking-wider text-[20px]" numberOfLines={1} ellipsizeMode='tail'>John</Text>
      </View>
      <View className="flex flex-row gap-2">
      <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center bg-black/5">
        <FontAwesome name="phone" size={21} color="gray" />
      </Pressable>
      <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center bg-black/5">
        <FontAwesome name="video-camera" size={18} color="gray" />
      </Pressable>
      </View>
    </View>
  )
}

export default Header