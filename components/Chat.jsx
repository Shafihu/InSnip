import { View, Text } from 'react-native'
import React from 'react'
import Header from './Header'

const Chat = () => {
  return (
    <View className="flex-1 bg-white ">
        <Header header='Chat'/>
        <Text>Chat</Text>
    </View>
  )
}

export default Chat