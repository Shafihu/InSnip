import React, { createContext, useContext, useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(
            doc(FIRESTORE_DB, "users", authUser.uid)
          );
          if (userDoc.exists()) {
            const data = userDoc.data();
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
      setLoading(false); // Update loading state after fetching user data
    });

    return () => unsubscribe();
  }, []);

  const storeUserDataLocally = async (userData) => {
    try {
      await AsyncStorage.setItem("@userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data locally: ", error);
    }
  };

  const clearUserDataLocally = async () => {
    try {
      await AsyncStorage.removeItem("@userData");
    } catch (error) {
      console.error("Error clearing user data locally: ", error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
