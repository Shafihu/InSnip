import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "flip",
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "flip",
        }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "flip",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
