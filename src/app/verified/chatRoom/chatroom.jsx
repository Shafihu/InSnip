import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Header from '../../../components/Chat/Header';
import Bottom from '../../../components/Chat/Bottom';
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../../Firebase/config';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '../../../../context/UserContext';
import { pickAndUploadImage } from '../../../../utils/pickAndUploadImage';
import { Entypo } from 'react-native-vector-icons';
import Modal from 'react-native-modal';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const ChatRoom = () => {
    const { userData } = useUser();
    const { chatId, userId, firstname, lastname, avatar, username } = useLocalSearchParams();
    const [chat, setChat] = useState(null);
    const [img, setImg] = useState(null);
    const [localImageUri, setLocalImageUri] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const scrollViewRef = useRef();
    const currentUserId = userData.id;

    const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


    useEffect(() => {
        const fetchInitialData = async () => {
            if (chatId) {
                const chatDoc = await getDoc(doc(FIRESTORE_DB, 'chats', chatId));
                if (chatDoc.exists()) {
                    setChat(chatDoc.data());
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                }

                const unSub = onSnapshot(doc(FIRESTORE_DB, 'chats', chatId), (doc) => {
                    setChat(doc.data());
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                });

                return () => {
                    unSub();
                };
            }
        };

        fetchInitialData();
    }, [chatId]);

    const handleSend = async (message) => {
        setLocalImageUri(null);
        try {
            if (!message && !img) return;

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
                        userChatsData.chats[chatIndex].lastMessage = img ? img + message : message;
                        userChatsData.chats[chatIndex].isSeen = id === currentUserId;
                        userChatsData.chats[chatIndex].updatedAt = new Date();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats, 
                        });

                        setImg(null);
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

    const handleLongPress = (message) => {
        setSelectedMessage(message.text);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedMessage(null);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Header title={firstname + " " + lastname} avatar={avatar} firstname={firstname} lastname={lastname} id={userId} username={username}/>
            <ImageBackground
                source={require('../../../../assets/chatBackground.png')} 
                style={{ flex: 1 }}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                >
                    <ScrollView 
                        ref={scrollViewRef}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingVertical: 10, paddingHorizontal: 5 }}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                        {chat && chat.messages &&
                            chat.messages.map((message, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    activeOpacity={.9}
                                    onLongPress={() => handleLongPress(message)}
                                    style={{ 
                                        alignSelf: message.senderId === currentUserId ? 'flex-end' : 'flex-start',
                                        padding: 8, 
                                        borderRadius: 6, 
                                        borderLeftWidth: message.senderId === currentUserId ? 0 : 4, 
                                        borderRightWidth: message.senderId === currentUserId ? 4 : 0, 
                                        borderColor: message.senderId === currentUserId ? '#00BFFF' : 'red', 
                                        marginBottom: 8,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <View style={{marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={{fontSize: 13, color: message.senderId === currentUserId ? '#00BFFF' : 'red' }}>
                                            {message.senderId === currentUserId ? 'Me' : firstname}
                                        </Text>
                                        <Text style={{ color: 'gray', fontSize: 10 }}>
                                            {message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>

                                    <View>
                                        {message.imageUrl ? (
                                            <>
                                                <Image
                                                    source={{ uri: message.imageUrl }}
                                                    style={{ width: width * 0.8, height: 200, borderRadius: 20, marginVertical: 5 }}
                                                    placeholder={{ blurhash }}
                                                    contentFit="cover"
                                                    transition={1000}
                                                />
                                                <Text style={{ letterSpacing: 0.2, fontSize: 16, color: 'rgba(0,0,0,.8)' }}>
                                                    {message.text}
                                                </Text>
                                            </>
                                        ) : (
                                            <Text style={{ letterSpacing: 0.2, fontSize: 15, color: 'rgba(0,0,0,.8)' }}>
                                                    {message.text}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        {localImageUri && (
                            <View style={{ 
                                alignSelf: 'center', 
                                padding: 8, 
                                paddingTop: 4,
                                borderRadius: 20, 
                                borderWidth: 4, 
                                borderColor: '#00bfff', 
                                marginBottom: 8,
                                backgroundColor: 'white' 
                            }}>
                                <TouchableOpacity onPress={()=>setLocalImageUri(null)}>
                                    <Entypo name='cross' size={20} color='gray' style={{textAlign: 'right'}}/>
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: localImageUri }}
                                    style={{ width: width * 0.5, height: 100, borderRadius: 20,  }}
                                    placeholder={{ blurhash }}
                                    contentFit="cover"
                                    transition={1000}
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
                    <Modal 
                        isVisible={isModalVisible}
                        onBackdropPress={handleCloseModal}
                        style={{ justifyContent: 'flex-end', margin: 0 }}
                    >
                        <View style={{ 
                            backgroundColor: 'white', 
                            padding: 20, 
                            borderTopLeftRadius: 20, 
                            borderTopRightRadius: 20,
                            paddingBottom: 50,
                            gap: 15
                        }}>
                            <Text style={{textAlign: 'center'}}>{selectedMessage}</Text>
                            <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: 'red'}}>Delete</Text>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ChatRoom;
