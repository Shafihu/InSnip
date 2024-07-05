import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import { speak, isSpeakingAsync, stop, getAvailableVoicesAsync, VoiceQuality } from "expo-speech";
import Bottom from "../Chat/Bottom";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chatbot = ({ chats, setChats, modalVisible, setModalVisible }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const flatListRef = useRef(null);

  const API_KEY = process.env.EXPO_PUBLIC_GENERATIVE_AI_KEY;

  useEffect(() => {
    const fetchBotChatsFromStorage = async () => {
      try {
        const storageChats = await AsyncStorage.getItem('BotChats');
        if (storageChats) {
          setChats(JSON.parse(storageChats));
          flatListRef.current.scrollToEnd({ animated: true });
        }
      } catch (error) {
        console.error('Error fetching chats from storage:', error);
      }
    };

    const fetchVoices = async () => {
      const availableVoices = await getAvailableVoicesAsync();
      setVoices(availableVoices);
    };

    fetchBotChatsFromStorage();
    fetchVoices();
  }, []);

  const handleSend = async (message) => {
    if (message === '') return;

    let updatedChat = [
      ...chats,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    setChats(updatedChat);
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: updatedChat,
        }
      );

      const modelResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (modelResponse) {
        const updatedChatWithModel = [
          ...updatedChat,
          {
            role: "model",
            parts: [{ text: modelResponse }],
          },
        ];

        setChats(updatedChatWithModel);
        await AsyncStorage.setItem('BotChats', JSON.stringify(updatedChatWithModel));
      }
    } catch (error) {
      console.error("Error calling Gemini Pro API:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = async (text) => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      if (!(await isSpeakingAsync())) {
        speak(text, {
          voice: selectedVoice?.identifier,
          quality: VoiceQuality.Enhanced
        });
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem = ({ item }) => (
    <ChatBubble
      role={item.role}
      text={item.parts[0].text}
      onSpeech={() => handleSpeech(item.parts[0].text)}
    />
  );

  const renderVoiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.voiceItem}
      onPress={() => {
        setSelectedVoice(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.voiceText}>{item.name || item.identifier}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ImageBackground source={require('../../../assets/chat_background.jpg')} style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          />
        </View>
        {loading && 
          <View style={{paddingHorizontal: 10, backgroundColor: 'transparent'}}>
            <Image source={require('../../../assets/aiPic.png')} style={{width: 50, height: 50, objectFit: 'cover'}} />
          </View>
        }
        <Bottom handleSend={handleSend} from='bot' />
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={voices}
                renderItem={renderVoiceItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{backgroundColor: 'red', flexGrow: 1}}
              />
                <TouchableOpacity onPress={() => setModalVisible(false)}  style={{width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.2)'}}></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 50,
    marginRight: 10,
    padding: 8,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 25,
    color: "#333",
    backgroundColor: "#fff",
  },
  button: {
    padding: 10,
    backgroundColor: "#0074FF",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  loading: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  voiceButton: {
    padding: 10,
    backgroundColor: "#0074FF",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  voiceButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: '100%'
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    paddingVertical: 70,
    gap: 20,
  },
  voiceItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    width: "100%",
    
  },
  voiceText: {
    fontSize: 16,
    color: "#333",
    textAlign: 'center',
    width: '100%'
  },
});

export default Chatbot;
