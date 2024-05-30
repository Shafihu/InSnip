import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';

const TabBarPreview = ({ onPressChat, onPressCamera, onPressStories, onPressMaps, onPressSpotlight, photo }) => {
  const [activeTab, setActiveTab] = useState('camera');

  const handlePress = (tab, callback) => {
    setActiveTab(tab);
    if (callback) {
      callback();
    }
  };

  return (
      <View style={styles.tabBarContainer}>
        <View style={styles.photoMessageContainer}>
          <Text style={styles.photoMessageText}>Photo Captured</Text>
        </View>
      </View>
  );
} 

export default TabBarPreview;

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 70, 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  container: {
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  photoMessageContainer: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  photoMessageText: {
    color: 'black', 
    fontSize: 18, 
    fontWeight: 'bold'
  },
  notificationDot: {
    position: 'absolute',
    right: 1,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 9999,
    width: 8,
    height: 8,
  },
});
