import React from "react";
import { Slot, Stack } from "expo-router";
import "../global.css";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="test" options={{ headerShown: true }} />
    </Stack>
  );
};

export default _layout;
