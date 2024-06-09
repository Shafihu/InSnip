import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Chat/Header';
import Bottom from '../../../components/Chat/Bottom';
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../../Firebase/config';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '../../../../context/UserContext';
import { useChatStore } from '../../../../context/ChatContext';

const ChatRoom = () => {
    const { userData } = useUser();
    const { user } = useChatStore();
    const { chatId, userId } = useLocalSearchParams();
    const [chat, setChat] = useState(null);

    const currentUserId = userData.id;

    useEffect(() => {
        if (chatId) {
            const unSub = onSnapshot(doc(FIRESTORE_DB, 'chats', chatId), (doc) => {
                setChat(doc.data());
                console.log(doc.data()?.messages);
            });

            return () => {
                unSub();
            };
        }
    }, [chatId]);

    const handleSend = async (message) => {
        try {
            const chatRef = doc(FIRESTORE_DB, 'chats', chatId);

            await updateDoc(chatRef, {
                messages: arrayUnion({
                    senderId: currentUserId,
                    text: message,
                    createdAt: new Date(),
                })
            });

            const userIDs = [currentUserId, userId];

            for (const id of userIDs) {
                const userChatsRef = doc(FIRESTORE_DB, 'userchats', id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = message;
                        userChatsData.chats[chatIndex].isSeen = id === currentUserId ? true : false;
                        userChatsData.chats[chatIndex].updatedAt = new Date();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            }
        } catch (error) {
            console.log('Error sending message: ' + error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Header />
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#F8F8FF' }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 10, gap: 8 }}>
                    {chat && chat.messages &&
                        chat.messages.map((message, index) => (
                            <View key={index} style={{ backgroundColor: 'white', width: '95%', padding: 8, borderRadius: 4, borderLeftWidth: 4, borderLeftColor: '#00BFFF', marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: '#00BFFF' }}>ME</Text>
                                    <Text style={{ color: 'gray', fontSize: 10 }}>{message.createdAt.toDate().toLocaleTimeString()}</Text>
                                </View>
                                <View>
                                    {message.imageUrl ? (
                                        <>
                                            <Image
                                                source={{ uri: message.imageUrl }}
                                                style={{ width: '100%', height: 200, borderRadius: 8, objectFit: 'cover', marginVertical: 5 }}
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
                </ScrollView>
                <Bottom handleSend={handleSend} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatRoom;
