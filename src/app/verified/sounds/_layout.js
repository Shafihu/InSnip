import React from "react";
import { Stack } from "expo-router";

const SearchLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="soundScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[playlistScreen]"
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};

export default SearchLayout;
