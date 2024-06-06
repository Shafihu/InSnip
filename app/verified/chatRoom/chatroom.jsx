import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../../components/Chat/Header'
import Bottom from '../../../components/Chat/Bottom'

const chatroom = () => {
  return (
    <>
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Header />
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#F8F8FF'}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end', padding: 10, gap: 8}}>
                <View className="bg-white w-[95%] p-2 rounded-lg gap-2">
                    <View>
                        <Text className="text-[#00BFFF]">ME</Text>
                    </View>
                    <View>
                        <Text className="tracking-wider font-normal text-[16px] text-gray-800">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                        </Text>
                    </View>
                </View>
                <View className="bg-white w-[95%] p-2 rounded-lg gap-2">
                    <View>
                        <Text className="text-red-500">MY AI</Text>
                    </View>
                    <View>
                        <Text className="tracking-wider font-normal text-[16px] text-gray-800">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
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