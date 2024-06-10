import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Chat/Header';
import Bottom from '../../../components/Chat/Bottom';
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../../Firebase/config';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '../../../../context/UserContext';
import { useChatStore } from '../../../../context/ChatContext';
import { pickAndUploadImage } from '../../../../utils/pickAndUploadImage';

const { width } = Dimensions.get('window');

const ChatRoom = () => {
    const { userData } = useUser();
    // const { user } = useChatStore();
    const { chatId, userId, firstname, lastname, avatar } = useLocalSearchParams();
    const [chat, setChat] = useState(null);
    const [img, setImg] = useState(null);
    const [localImageUri, setLocalImageUri] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);


    const currentUserId = userData.id;

    useEffect(() => {
        if (chatId) {
            const unSub = onSnapshot(doc(FIRESTORE_DB, 'chats', chatId), (doc) => {
                setChat(doc.data());
                // console.log(doc.data()?.messages);
            });

            return () => {
                unSub();
            };
        }
    }, [chatId]);

    const handleSend = async (message) => {
        try {
            if (!message && !img) return;  // Do nothing if both message and image are absent

            const chatRef = doc(FIRESTORE_DB, 'chats', chatId);

            let messageData = {
                senderId: currentUserId,
                text: message,
                createdAt: new Date(),
            };

            if (img) {
                messageData.imageUrl = img;
            }

            await updateDoc(chatRef, {
                messages: arrayUnion(messageData)
            });

            const userIDs = [currentUserId, userId];

            for (const id of userIDs) {
                const userChatsRef = doc(FIRESTORE_DB, 'userchats', id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = img ? 'Img ' + message : message;
                        userChatsData.chats[chatIndex].isSeen = id === currentUserId;
                        userChatsData.chats[chatIndex].updatedAt = new Date();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });

                        setImg(null);
                        setLocalImageUri(null);
                    }
                }
            }
        } catch (error) {
            console.log('Error sending message: ' + error);
        }
    };

    const handlePickImage = async () => {
        await pickAndUploadImage(setUploadProgress, setLocalImageUri).then((res) => {
            setImg(res);
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Header title={firstname + " " + lastname} avatar={avatar}/>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#F8F8FF' }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'flex-end', padding: 10, gap: 8 }}>
                    {chat && chat.messages &&
                        chat.messages.map((message, index) => (
                            <View 
                                key={index} 
                                style={{ 
                                    alignSelf: 'flex-start', 
                                    padding: 8, 
                                    borderRadius: 4, 
                                    borderLeftWidth: 4, 
                                    borderLeftColor: message.senderId === currentUserId ? '#00BFFF' : 'red', 
                                    marginBottom: 8,
                                    backgroundColor: 'white',
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ color: message.senderId === currentUserId ? '#00BFFF' : 'red' }}>{message.senderId === currentUserId ? 'Me' : firstname}</Text>
                                    <Text style={{ color: 'gray', fontSize: 10 }}>{message.createdAt.toDate().toLocaleTimeString()}</Text>
                                </View>
                                <View>
                                    {message.imageUrl ? (
                                        <>
                                            <Image
                                                source={{ uri: message.imageUrl }}
                                                style={{ width: width * 0.8, height: 200, borderRadius: 20, marginVertical: 5 }}
                                            />
                                            <Text style={{ letterSpacing: 1, fontSize: 16, color: 'gray' }}>
                                                {message.text}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={{ letterSpacing: 1, fontSize: 16, color: 'gray' }}>
                                            {message.text}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    {localImageUri && (
                        <View style={{ 
                            alignSelf: 'flex-start', 
                            padding: 8, 
                            borderRadius: 4, 
                            borderLeftWidth: 4, 
                            borderLeftColor: '#00BFFF', 
                            marginBottom: 8,
                            backgroundColor: 'white' 
                        }}>
                            <Image
                                source={{ uri: localImageUri }}
                                style={{ width: width * 0.8, height: 200, borderRadius: 20, marginVertical: 5 }}
                            />
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <View style={{ padding: 10, display:'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Text>Upload Progress: {uploadProgress.toFixed(2)}%</Text>
                                    <ActivityIndicator size="small" color="gray" />
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
                <Bottom handleSend={handleSend} handlePickImage={handlePickImage} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatRoom;
