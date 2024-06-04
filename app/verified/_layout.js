import React from "react";
import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;
