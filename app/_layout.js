import React from "react";
import { Stack } from "expo-router";
import "../global.css";

const RootLayout = () => {
  return (
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
  );
};

export default RootLayout;
