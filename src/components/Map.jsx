import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Image, Text, View } from 'react-native';
import Header from '../components/Header';
import MapView, { Callout, Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import { FIRESTORE_DB } from '../../Firebase/config';
import processUserImage from '../../utils/processUserImage';
import { router } from 'expo-router';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const mapRef = useRef(null);
  const { userData } = useUser();

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      try {
        const { coords } = await Location.getCurrentPositionAsync({});
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
  }, [userData.id]);

  const updateLocationInFirestore = async (coords) => {
    try {
      await setDoc(doc(FIRESTORE_DB, 'users', userData.id), {
        location: coords,
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user location in Firestore:', error);
    }
  };

  const calloutPressed = useCallback((user) => {
    router.push({
      pathname: '/verified/profile/[otherUserProfile]',
      params: {
        id: user.id,
        firstname: user.FirstName,
        lastname: user.LastName,
        username: user.Username,
        avatar: user.avatar,
      },
    });
  }, []);

  const renderUserMarker = useCallback((user) => {
    return (
      user.location && (
        <Marker key={user.id} coordinate={user.location}>
          <Image source={processUserImage(user.avatar)} style={styles.markerImage} />
          <Callout onPress={() => calloutPressed(user)}>
            <View style={styles.calloutView}>
              <Text style={styles.calloutUsername}>{user.Username}</Text>
              <Image
                source={user.picture ? { uri: user.picture } : processUserImage(user.avatar)}
                style={styles.calloutImage}
              />
            </View>
          </Callout>
        </Marker>
      )
    );
  }, [calloutPressed]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.background}>
        <Header header='Map' />
      </LinearGradient>

      <MapView
        style={[StyleSheet.absoluteFill, styles.map]}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        userLocationAnnotationTitle="Your custom title"
      >
        {location && (
          <Marker coordinate={location} anchor={{ x: 0.8, y: 0.8 }}>
            <Text style={styles.youText}>You</Text>
            <Image source={processUserImage(userData?.avatar)} style={styles.userImage} />
          </Marker>
        )}

        {otherUsers.map(renderUserMarker)}
      </MapView>
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
  },
  youText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  calloutView: {
    width: 200,
    height: 200,
    flex: 1,
    gap: 5,
  },
  calloutUsername: {
    fontWeight: 'bold',
    color: '#00bfff',
    textAlign: 'center',
  },
  calloutImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    objectFit: 'cover',
  },
  map: {},
});
