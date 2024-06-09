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
        }}
      />
    </Stack>
  );
};

export default NewChatLayout;
