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
            style={{flex: 1, backgroundColor: 'gray'}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end', padding: 10,}}>
                <Text>Chatroom</Text>
            </ScrollView>
            <Bottom />
        </KeyboardAvoidingView>
        </SafeAreaView>
    </>
  )
}

export default chatroom