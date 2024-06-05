import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../Firebase/config";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const fetchUserInfo = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
          console.log("Auth User: ", authUser); // Log authUser to check if it's undefined
          if (authUser) {
            try {
              const userDoc = await getDoc(doc(FIRESTORE_DB, "users", authUser.uid));
              if (userDoc.exists()) {
                const data = userDoc.data();
                console.log("User Data: ", data); // Log user data to check if it's fetched successfully
                setUserData(data);
                await storeUserDataLocally(data); // Save user data to local storage
              } else {
                console.log("No such document!");
              }
            } catch (error) {
              console.error("Error fetching user data: ", error);
            }
          } else {
            setUserData(null);
            await clearUserDataLocally(); // Clear local user data if user is not authenticated
          }
        });
    
        return () => unsubscribe();
      }, []);

    const storeUserDataLocally = async (userData) => {
        try {
            await AsyncStorage.setItem('@userData', JSON.stringify(userData));
        } catch (error) {
            console.error("Error storing user data locally: ", error);
        }
    };

    const clearUserDataLocally = async () => {
        try {
            await AsyncStorage.removeItem('@userData');
        } catch (error) {
            console.error("Error clearing user data locally: ", error);
        }
    };

    return userData;
}

export default fetchUserInfo;
