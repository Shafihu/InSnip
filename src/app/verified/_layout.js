import React from "react";
import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="album"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="chatRoom"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="addChat"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="searchUsers"
        options={{ headerShown: false, presentation: "" }}
      />
      <Stack.Screen
        name="viewStory"
        options={{ headerShown: false, presentation: "" }}
      />
    </Stack>
  );
};

export default HomeLayout;
