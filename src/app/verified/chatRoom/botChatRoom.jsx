import { StyleSheet, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import Chatbot from '../../../components/Bot/ChatBot';
import Header from '../../../components/Chat/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const botChatRoom = () => {
  const [chats, setChats] = useState([]);

  const handleClearBotChats = async () => {
    try {
      await AsyncStorage.removeItem('BotChats');
      setChats([]);
    } catch (error) {
      console.error('Error clearing BotChats:', error);
    }
  };

  const confirmClearBotChats = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to clear all messages with your AI?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => handleClearBotChats(),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title="My AI" handleClearChats={confirmClearBotChats} />
      <Chatbot chats={chats} setChats={setChats} />
    </SafeAreaView>
  );
}

export default botChatRoom;

const styles = StyleSheet.create({});
