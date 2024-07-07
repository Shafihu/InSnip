import React from "react";
import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { UserProvider } from "../../context/UserContext";
import { UsersProvider } from "../../context/UsersContext";
import { ChatProvider } from "../../context/ChatContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../../context/ThemeContext";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <UserProvider>
          <UsersProvider>
            <ChatProvider>
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
            </ChatProvider>
          </UsersProvider>
        </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
