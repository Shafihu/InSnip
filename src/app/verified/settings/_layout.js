import React from "react";
import { Stack } from "expo-router";

const SettingsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="setting"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
};

export default SettingsLayout;
