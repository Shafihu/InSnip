import { StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import Chatbot from '../../../components/Bot/ChatBot'
import Header from '../../../components/Chat/Header'

const botChatRoom = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
    <>
        <Header title='My AI'/>
        <Chatbot />
    </>
    </SafeAreaView>
  )
}

export default botChatRoom

const styles = StyleSheet.create({})