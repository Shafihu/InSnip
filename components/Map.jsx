import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import Header from './Header'
import MapView from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';

const Map = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', position: 'relative' }}>
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          style={styles.background}>
            <Header header='Map' />
        </LinearGradient>
        <MapView style={{width: '100%', height: '100%',}} className="w-full h-full"/>
    </View>
  )
}

export default Map

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute',
    top: '50%',
    zIndex: 99
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
});