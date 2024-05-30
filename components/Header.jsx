import { View, Text, Pressable, Button} from 'react-native'
import React from 'react'
import {
    MaterialCommunityIcons,
    Ionicons,
    Fontisto
  } from "react-native-vector-icons";

const Header = ({header}) => {
  return (
    <View className="flex flex-row items-center justify-between mx-4 mb-4">
        <View className="flex flex-row gap-2 items-center">
            <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                <MaterialCommunityIcons
                    name="account"
                    size={50}
                    color='yellow'
                    className="absolute top-0 right-1"
                />
            </Pressable>
            <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                <Ionicons name="search" size={20} color="#555c57" />
            </Pressable>
        </View>
        <View><Text className="text-[1.35rem] font-semibold tracking-wider">{header}</Text></View>
        <View className="flex flex-row gap-2 items-center">
            <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                <MaterialCommunityIcons
                    name="account-plus"
                    size={20}
                    color="#555c57"
                />
            </Pressable>
            <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                <Fontisto name="more-v-a" size={20} color="#555c57" className="transform rotate-90"/>
            </Pressable>
        </View>
    </View>
  )
}

export default Header