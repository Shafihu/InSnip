import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Image, Text, View } from 'react-native';
import Header from '../components/Header';
import MapView, { Callout, Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
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
    const fetchUserLocation = async () => {
      const userDocRef = doc(FIRESTORE_DB, 'users', userData.id);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.location) {
          const storedLocation = userData.location;
          const currentLocation = await getCurrentLocation();

          if (isLocationDifferent(storedLocation, currentLocation)) {
            setLocation(currentLocation);
            updateLocationInFirestore(userDocRef, currentLocation);
          } else {
            setLocation(storedLocation);
          }
          animateMap(storedLocation);
        } else {
          await fetchAndSetLocation(userDocRef);
        }
      } else {
        await fetchAndSetLocation(userDocRef);
      }

      const usersSnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
      const usersData = usersSnapshot.docs.map(doc => doc.data());
      setOtherUsers(usersData.filter(user => user.id !== userData.id));
    };

    fetchUserLocation();
  }, [userData.id]);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }
    const { coords } = await Location.getCurrentPositionAsync({});
    return coords;
  };

  const isLocationDifferent = (location1, location2, threshold = 0.001) => {
    const latDiff = Math.abs(location1.latitude - location2.latitude);
    const lonDiff = Math.abs(location1.longitude - location2.longitude);
    return latDiff > threshold || lonDiff > threshold;
  };

  const fetchAndSetLocation = async (userDocRef) => {
    const currentLocation = await getCurrentLocation();
    if (currentLocation) {
      setLocation(currentLocation);
      updateLocationInFirestore(userDocRef, currentLocation);
      animateMap(currentLocation);
    }
  };

  const updateLocationInFirestore = async (userDocRef, coords) => {
    try {
      await setDoc(userDocRef, { location: coords }, { merge: true });
    } catch (error) {
      console.error('Error updating user location in Firestore:', error);
    }
  };

  const animateMap = (coords) => {
    mapRef.current?.animateToRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
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

  const renderUserMarker = useCallback((user) => (
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
  ), [calloutPressed]);

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
        userLocationAnnotationTitle=""
      >
        {location && (
          <Marker coordinate={location} >
            <Text style={styles.youText}>Me</Text>
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
