import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from './Header'

const Map = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <Header header='Map' />
          <View className="flex-1 items-center justify-center">
              <Text>Maps</Text>
          </View>
    </View>
  )
}

export default Map