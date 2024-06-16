import { View, Text, Pressable, Image, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { collection, getDocs, query, serverTimestamp, setDoc, updateDoc, arrayUnion, doc, where, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../../../../Firebase/config';
import processUserImage from '../../../../utils/processUserImage';
import { useUser } from "../../../../context/UserContext";

const NewChat = () => {
    const navigation = useNavigation();
    const { userData } = useUser();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearchQuery = async (text) => {
        setLoading(true);
        try {
            const userRef = collection(FIRESTORE_DB, "users");

            // Query for Username
            const usernameQuery = query(userRef, where("Username", "==", text));
            const usernameSnapshot = await getDocs(usernameQuery);

            // Query for FirstName
            const firstNameQuery = query(userRef, where("FirstName", "==", text));
            const firstNameSnapshot = await getDocs(firstNameQuery);

            // Combine the results
            let combinedResults = [];
            usernameSnapshot.forEach((doc) => {
                combinedResults.push({ id: doc.id, ...doc.data() });
            });
            firstNameSnapshot.forEach((doc) => {
                combinedResults.push({ id: doc.id, ...doc.data() });
            });

            if (combinedResults.length > 0) {
                setUser(combinedResults[0]);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        const chatRef = collection(FIRESTORE_DB, 'chats');
        const userChatsRef = collection(FIRESTORE_DB, 'userchats');

        try {
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            const currentTime = Date.now();

            const userChatDocRef = doc(userChatsRef, user.id);
            const currentUserChatDocRef = doc(userChatsRef, userData.id);

            // Check if the user chat document exists, if not create it
            const userChatDocSnap = await getDoc(userChatDocRef);
            if (!userChatDocSnap.exists()) {
                await setDoc(userChatDocRef, { chats: [] });
            }

            // Check if the current user chat document exists, if not create it
            const currentUserChatDocSnap = await getDoc(currentUserChatDocRef);
            if (!currentUserChatDocSnap.exists()) {
                await setDoc(currentUserChatDocRef, { chats: [] });
            }

            await updateDoc(userChatDocRef, {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: userData.id,
                    updatedAt: currentTime
                })
            });

            await updateDoc(currentUserChatDocRef, {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: user.id,
                    updatedAt: currentTime
                })
            });

        } catch (error) {
            console.log(error);
        }
    };

    const handleChatRoomPress = () => {
        router.back();
        setTimeout(() => {
            navigation.navigate('chatRoom');
        }, 0);
    };

    const onActualChange = (text) => {
        // Call handleSearchQuery when the text changes
        handleSearchQuery(text);
    };

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <SearchBar onChangeText={handleSearchQuery} onActualChange={onActualChange} color='#f5f5f5' />
            <View style={{ paddingHorizontal: 15, backgroundColor: '#f5f5f5', flex: 1 }}>
                <View style={{ marginVertical: 15 }}>
                    {/* <Text className="font-semibold tracking-wider text-[16px]">Friends & Groups</Text> */}
                </View>
                {loading ? (
                    <ActivityIndicator size="small" color="#2F3E46" />
                ) : (
                    user &&
                    <Pressable
                        onPress={handleChatRoomPress}
                        style={[styles.pressable, styles.shadow]}
                        className="flex flex-row items-center justify-between gap-4 bg-white py-2 px-3 pr-5 rounded-xl"
                    >
                        <View className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden">
                            <Image source={processUserImage(user.avatar)} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View className="flex-1 gap-1">
                            <Text className="font-medium text-medium tracking-wider capitalize text-[#3B2F2F]">{user.FirstName} {user.LastName}</Text>
                            <View className="flex flex-row items-center gap-2">
                                <MaterialIcons name="chat-bubble-outline" size={12} color="gray" className="transform scale-x-[-1]" />
                                <Text className="text-[11px] font-semibold text-gray-500">{user.Username}</Text>
                            </View>
                        </View>
                        <Pressable onPress={handleAdd} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, backgroundColor: '#f5f5f5', borderRadius: '100%', paddingHorizontal: 20, paddingVertical: 5 }}>
                            <MaterialCommunityIcons
                                name="account-plus"
                                size={18}
                                color='#3B2F2F'
                            />
                            <Text style={{ fontWeight: 'bold', color: '#3B2F2F' }}>Add</Text>
                        </Pressable>
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 15,
        backgroundColor: 'white',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
});

export default NewChat;
