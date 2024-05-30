import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';

const TabBar = ({ onPressChat, onPressCamera, onPressStories, onPressMaps, onPressSpotlight, photo }) => {
  const [activeTab, setActiveTab] = useState('camera');
  const status = photo;

  const handlePress = (tab, callback) => {
    setActiveTab(tab);
    if (callback) {
      callback();
    }
  };

  if(status){
    console.log('CHECKED!')
  }

  return (
    <View className="h-28 absolute bottom-0 left-0 right-0 bg-white pt-1 px-5 flex justify-start items-center rounded-t-[1.7rem]">
      <View style={[styles.container, styles.shadow]}>
        <TouchableOpacity onPress={() => handlePress('maps', onPressMaps)} className="flex-1 items-center justify-center">
          <Ionicons name={activeTab === 'maps' ? 'location' : 'location-outline'} size={30} color="rgb(50,50,50)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('chat', onPressChat)} className="items-center justify-center">
          <MaterialIcons name={activeTab === 'chat' ? 'chat-bubble' : 'chat-bubble-outline'} size={27} color="rgb(50,50,50)" className="transform scale-x-[-1]" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('camera', onPressCamera)} className="flex-1 items-center justify-center">
          <MaterialCommunityIcons name={activeTab === 'camera' ? 'camera' : 'camera-outline'} size={30} color="rgb(50,50,50)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('stories', onPressStories)} className="flex-1 items-center justify-center">
          <MaterialCommunityIcons name={activeTab === 'stories' ? 'account-supervisor' : 'account-supervisor-outline'} size={32} color="rgb(50,50,50)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('spotlight', onPressSpotlight)} className="flex-1 items-center justify-center relative">
          <Ionicons name={activeTab === 'spotlight' ? 'play' : 'play-outline'} size={29} color="rgb(50,50,50)" />
          <View className="absolute right-1 top-0 bg-red-600 rounded-full w-3 h-3"></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 9999,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
