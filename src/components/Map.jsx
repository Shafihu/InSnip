import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Image, Text, Pressable } from 'react-native';
import Header from '../components/Header';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import { FIRESTORE_DB } from '../../Firebase/config';
import processUserImage from '../../utils/processUserImage';

const Map = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [otherUsers, setOtherUsers] = useState([]);
  const mapRef = useRef(null);
  const { userData } = useUser();

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      try {
        let { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);

        // Animate the map to the user's location
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Update user's location in Firestore
        await updateLocationInFirestore(coords);

        // Fetch other users' locations from Firestore
        const usersSnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
        const usersData = usersSnapshot.docs.map(doc => doc.data());
        setOtherUsers(usersData.filter(user => user.id !== userData.id));

      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  const updateLocationInFirestore = async (coords) => {
    try {
      await setDoc(doc(FIRESTORE_DB, 'users', userData.id), {
        location: coords,
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user location in Firestore:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={styles.background}
      >
        <Header header='Map' />
      </LinearGradient>

      <MapView
        style={[StyleSheet.absoluteFill, styles.map]}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        userLocationAnnotationTitle="Your custom title"
      >
        {location.latitude !== 0 && location.longitude !== 0 && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>You</Text>
            <Image source={processUserImage(userData?.avatar)} style={{ width: 50, height: 50, borderRadius: 20 }} />
          </Marker>
        )}

        {otherUsers.map(user => (
          user.location && (
            <Marker key={user?.id} coordinate={user?.location}>
                <Pressable key={user?.id} onPress={()=>console.log('Pam!!!')}>
                  <Text style={{ fontWeight: 'bold', color: 'pink', textAlign: 'center' }}>{user?.Username}</Text>
                  <Image source={processUserImage(user?.avatar)} style={{ width: 40, height: 40, borderRadius: 20 }} />
                </Pressable>
            </Marker>
          )
        ))}
      </MapView>
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
  map: {},
});
