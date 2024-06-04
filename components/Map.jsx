import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from './Header'
import MapView from 'react-native-maps';

const Map = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', position: 'relative' }}>
      <Header header='Map' />
      <MapView style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} className="w-full h-full"/>
    </View>
  )
}

export default Map