import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Chat/Header'
import Bottom from '../../../components/Chat/Bottom'
import { onSnapshot } from 'firebase/firestore'
import { FIRESTORE_DB } from '../../../../Firebase/config'

const chatroom = () => {
    const [chat, setChat] = useState()

    useEffect(() => {
        const unSub = onSnapshot(doc(FIRESTORE_DB, 'chats', '4jC7XaXeQVcgC5JWZYGrGG4etQf2'), (res) => {
            setChat(res.data());
        });
    
        return () => {
            unSub();
        };
    }, []);
    

    console.log(chat)

  return (
    <>
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Header />
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#F8F8FF'}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end', padding: 10, gap: 8}}>
                <View className="bg-white w-[95%] p-2 rounded-sm rounded-tr-lg rounded-br-lg gap-2  border-l-4 border-[#00BFFF]">
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-[#00BFFF]">ME</Text>
                        <Text className="text-gray-400 text-[10px]">1:32</Text>
                    </View>
                    <View>
                        <Text className="tracking-wider font-normal text-[16px] text-gray-800">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                        </Text>
                    </View>
                </View>
                <View className="bg-white w-[95%] p-2 rounded-sm rounded-zzztr-lg rounded-br-lg gap-2  border-l-4 border-red-400">
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-red-500">MY AI</Text>
                        <Text className="text-gray-400 text-[10px]">1:33</Text>
                    </View>
                    <View>
                        <Text className="tracking-wider font-normal text-[16px] text-gray-800">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <Bottom />
        </KeyboardAvoidingView>
        </SafeAreaView>
    </>
  )
}

export default chatroom