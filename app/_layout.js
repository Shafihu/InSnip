import React from "react";
import { Stack } from "expo-router";
import "../global.css";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Ionicons } from "react-native-vector-icons";

const RootLayout = () => {
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#32cc2d",
          justifyContent: "center",
          alignItems: "center",
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 14,
          fontWeight: "600",
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 14,
          fontWeight: "600",
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
  };

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="verified"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
};

export default RootLayout;
