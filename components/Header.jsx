import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
    MaterialCommunityIcons,
    Ionicons,
    Fontisto
} from 'react-native-vector-icons';

const Header = ({ header }) => {
    return (
        <View className={`flex flex-row items-center justify-between mx-2 mb-4 ${header === 'Spotlight' || header === '' ? 'absolute top-0 left-0 z-50 w-full mx-0 mb-0 pr-4 mt-2' : ''}`}>
            <View className="flex flex-row gap-2 items-center">
                <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                    <MaterialCommunityIcons
                        name="account"
                        size={50}
                        color="yellow"
                        className="absolute top-0 right-1"
                    />
                </Pressable>
                <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                    <Ionicons name="search" size={20} color={header === 'Spotlight' || header === '' ? 'white' : '#555c57'} />
                </Pressable>
            </View>
            <Text className={`text-[1.35rem] font-semibold tracking-wider ${header === 'Spotlight' || header === '' ? 'text-white mr-[40px]' : ''}`}>{header}</Text>
            <View className="flex flex-row gap-2 items-center">
                {header !== 'Spotlight'  && (
                    <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative">
                        <MaterialCommunityIcons
                            name="account-plus"
                            size={20}
                            color={header === '' ? 'white' : '#555c57'}
                        />
                        <View className="absolute top-[-4px] right-0 bg-red-500 py-[0.05rem] px-[0.2rem] rounded-xl">
                            <Text className="text-white text-[11px] font-medium">43</Text>
                        </View>
                    </Pressable>
                )}
                <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                    {header === 'Spotlight' || header === 'Camera' ? (
                        <MaterialCommunityIcons name="plus-box-outline" size={25} color="white" className="transform rotate-90" />
                    ) : (
                        <Fontisto name="more-v-a" size={20} color={header === '' ? 'white' : '#555c57'} className="transform rotate-90" />
                    )}
                </Pressable>
            </View>
        </View>
    );
};

export default Header;
