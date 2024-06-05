import { router } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable, Image } from 'react-native';
import {
    MaterialCommunityIcons,
    Ionicons,
    Fontisto,
    Feather,
    FontAwesome,
    FontAwesome5,
    AntDesign,
    Foundation
} from 'react-native-vector-icons';
import processUserImage from "../utils/processUserImage";
import { useUser } from "../Context/userContext";


const Header = ({ header, toggleCameraFacing, toggleCameraFlash }) => {
    const [isFlash, setIsFlash] = useState(false);
    const { userData } = useUser();


    const FlashMode = () => {
        setIsFlash((prev) => !prev);
        toggleCameraFlash();
    }

    return (
        <View className={`flex flex-row justify-between px-2 pt-0 mb-4  ${header === 'Chat' || header === 'Stories' ? 'bg-white' : 'bg-transparent'} ${header === 'Spotlight' || header === '' ? 'absolute top-0 left-0 z-50 w-full mx-0 mb-0 pr-4 mt-2' : ''} ${header === '' ? 'items-start' : 'items-center'} ${header === 'Map' ? 'pt-[50px] pb-[10px]' : ''}`}>
            <View className="flex flex-row gap-2 items-center">
                <Pressable 
                    onPress={()=> router.push('/verified/profile')} 
                    className="bg-orange-500 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                        {userData ? 
                            <Image source={processUserImage(userData.UserImage)} className="w-full h-full" />
                                : 
                            <Image source={require('../assets/avatars/user.png')} className="w-full h-full" /> 
                        }
                </Pressable>
                <Pressable className={`rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden transform scale-x-[-1] ${header === 'Map' ? 'bg-black/15' : 'bg-black/5'}`}>
                    <Foundation name="magnifying-glass" size={20} color={header === 'Spotlight' || header === '' || header === 'Map' ? 'white' : '#555c57'} />
                </Pressable>
            </View>
            <Text className={`text-[1.35rem] font-semibold tracking-wider text-center ${header === 'Spotlight' || header === '' || header === 'Map' ? 'text-white mr-[40px]' : ''}`}>{header}</Text>

            <View className="flex flex-row gap-2 items-start">
                {header !== 'Spotlight' && header !== 'Map' && (
                    <Pressable className={`bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative`}>
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

                {header === 'Map' ? (
                    <Pressable className={`rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden ${header === 'Map' ? 'bg-black/15' : 'bg-black/5'}`}>
                        <Ionicons name="settings-sharp" size={25} color="white" />
                    </Pressable>
                ) : (
                    <View>
                                            {header === '' ? (
                    <View className="flex flex-row items-start gap-2 h-auto">
                        <View className="flex flex-col gap-2">
                            <View className="mt-0 w-[40px] h-auto bg-black/15 rounded-full flex flex-col py-2 items-center gap-2">
                                <Pressable onPress={toggleCameraFacing} className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                    <Feather name="repeat" size={20} color="white" className="transform rotate-90" />
                                </Pressable>
                                <Pressable onPress={FlashMode} className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                    <Ionicons name={`${isFlash ? 'flash' : 'flash-off'}`} size={25} color="white" />
                                </Pressable>
                                <Pressable className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                    <MaterialCommunityIcons name="video-plus" size={25} color="white" />
                                </Pressable>
                                <Pressable className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                    <Ionicons name="musical-notes" size={30} color="white" />
                                </Pressable>
                                <Pressable className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                    <FontAwesome name="camera" size={20} color="white" />
                                </Pressable>
                                <Pressable className="bg-black/20 rounded-full w-[30px] h-[30px] flex justify-center items-center relative overflow-hidden">
                                    <FontAwesome5 name="plus" size={15} color="white" />
                                </Pressable>
                            </View>
                            <Pressable className="bg-black/20 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                <AntDesign name="scan1" size={21} color="white" />
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View>
                        {header === 'Spotlight' ? (
                            <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                <MaterialCommunityIcons name="plus-box-outline" size={25} color="white" className="transform rotate-90" />
                            </Pressable>
                        ) : (
                            <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                                <Fontisto name="more-v-a" size={20} color={header === '' ? 'white' : '#555c57'} className="transform rotate-90" />
                            </Pressable>
                        )}
                    </View>
                )}
                    </View>
                )}
            </View>
        </View>
    );
};

export default Header;
