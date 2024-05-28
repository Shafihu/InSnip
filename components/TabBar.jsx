import React from 'react';
import { View,StyleSheet, Text, TouchableOpacity } from 'react-native';
import {FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons} from 'react-native-vector-icons'; 

const TabBar = ({ onPressChat, onPressCamera, onPressStories, onPressMaps }) => {
  
  return (
    <View className="h-28 absolute bottom-0 left-0 right-0 bg-white pt-1 px-5 flex justify-start items-center rounded-t-[1.7rem]">
             <View style={[styles.container, styles.shadow]}>
      <TouchableOpacity onPress={onPressChat} className="flex-1 items-center justify-center">
        <Ionicons name="location-outline" size={27} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressCamera} className="items-center justify-center">
          <MaterialIcons name="chat-bubble-outline" size={25} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressStories} className="flex-1 items-center justify-center">
        <FontAwesome name="camera" size={25} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressMaps} className="flex-1 items-center justify-center">
        <MaterialCommunityIcons name="account-supervisor-outline" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressMaps} className="flex-1 items-center justify-center">
        <Ionicons name="play-outline" size={28} color="black" />
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
      alignItems: 'center',
      borderRadius: 9999,
      paddingLeft: 20,
      paddingRight: 20,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
  });