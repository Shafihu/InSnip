import React from "react";
import { Stack } from "expo-router";
import Entypo from "react-native-vector-icons";

const NewChatLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="newChat"
        options={{
          headerShown: true,
          presentation: "modal",
          headerTitle: `New Chat`,
          headerTintColor: "#3B2F2F",
        }}
      />
    </Stack>
  );
};

export default NewChatLayout;
