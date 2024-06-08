import { View, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import MapView from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';

const Map = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'transparent', position: 'relative' }}>
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          style={styles.background}
        >
          <Header header='Map' />
        </LinearGradient>
        <MapView style={{ width: '100%', height: '100%' }} />
      </View>
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
  },
});
