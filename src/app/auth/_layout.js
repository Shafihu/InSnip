import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="fullName" options={{ headerShown: false }} />
      <Stack.Screen name="birthday" options={{ headerShown: false }} />
      <Stack.Screen name="pickUserName" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="pickAvatar" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
