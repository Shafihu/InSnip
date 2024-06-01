import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons, Feather} from 'react-native-vector-icons';

const TabBarPreview = ({handleDownload, handleStory, handleShare}) => {
  const [activeTab, setActiveTab] = useState('camera');

  const handlePress = (tab, callback) => {
    setActiveTab(tab);
    if (callback) {
      callback();
    }
  };

  return (
    <View className="h-28 absolute bottom-0 left-0 right-0 bg-white pt-2 pr-4 pl-4 flex flex-row justify-evenly items-start rounded-t-[1.7rem] gap-3">
        <Pressable onPress={handleDownload} className="items-center justify-center bg-red-500 rounded-full p-3 w-1/5 min-h-14">
          <Feather name='download' size={22} color="white" />
        </Pressable>
        <Pressable onPress={handleStory} className="flex-row items-center justify-center bg-green-400 rounded-full p-3 w-2/5 min-h-14 gap-2">
          <MaterialCommunityIcons name='shape-square-rounded-plus' size={25} color="white" className="transform scale-x-[-1]" />
          <Text className="font-bold text-white">Story</Text>
        </Pressable>
        <Pressable onPress={handleShare} className="flex-row items-center justify-center bg-blue-400 rounded-full p-3 w-2/5 min-h-14 gap-2">
          <Text className="font-bold text-white">Send To</Text>
          <Ionicons name='send' size={16} color="white" />
        </Pressable>
    </View>
  );
};

export default TabBarPreview;

const styles = StyleSheet.create({
});
