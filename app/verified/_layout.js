import React from "react";
import { Stack } from "expo-router";
// import "../global.css";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;
