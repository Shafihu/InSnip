import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, View, Pressable, ScrollView } from "react-native";

import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  FontAwesome6,
  FontAwesome5,
  FontAwesome,
  AntDesign,
} from "react-native-vector-icons";

const index = () => {
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <>
      <View className="flex-1 bg-black pt-[50px] relative">
        <View className="h-fit rounded-t-[20px] overflow-hidden">
          <CameraView className="flex-1 rounded-full" facing={facing}>
            <View className="flex-1 bg-transparent my-96 rounded-full bg-green-500"></View>

            {/*  LEFT CAMERA ICONS  */}
            <View className="absolute top-0 flex flex-row gap-2 items-center ml-[0.75rem]">
              <Pressable className="bg-black/20 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                <MaterialCommunityIcons
                  name="account"
                  size={50}
                  color="yellow"
                  className="absolute top-0 right-1"
                />
              </Pressable>
              <Pressable className="bg-black/20 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                <Ionicons name="search" size={20} color="white" />
              </Pressable>
            </View>

            {/* RIGHT SIDE ICONS  */}

            <View className="absolute top-0 right-0 flex flex-row items-start gap-2  mr-[0.75rem] h-auto">
              <Pressable className="bg-black/20 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                <MaterialCommunityIcons
                  name="account-plus"
                  size={20}
                  color="white"
                />
              </Pressable>

              <View className="flex flex-col gap-2">
                <View className="mt-2 w-[40px] h-auto bg-black/20 rounded-full flex flex-col py-2 items-center gap-2">
                  <Pressable
                    onPress={toggleCameraFacing}
                    className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden"
                  >
                    <Feather
                      name="repeat"
                      size={20}
                      color="white"
                      className="transform rotate-90"
                    />
                  </Pressable>
                  <Pressable className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                    <FontAwesome6 name="bolt" size={20} color="white" />
                  </Pressable>
                  <Pressable className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                    <MaterialCommunityIcons
                      name="video-plus"
                      size={25}
                      color="white"
                    />
                  </Pressable>
                  <Pressable className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                    <Ionicons name="musical-notes" size={30} color="white" />
                  </Pressable>
                  <Pressable className="w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                    <FontAwesome name="camera" size={20} color="white" />
                  </Pressable>
                  <Pressable className="bg-black/25 rounded-full w-[30px] h-[30px] flex justify-center items-center relative overflow-hidden">
                    <FontAwesome5 name="plus" size={15} color="white" />
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => router.push("/test")}
                  className="bg-black/20 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden"
                >
                  <AntDesign name="scan1" size={21} color="white" />
                </Pressable>
              </View>
            </View>
          </CameraView>
        </View>
      </View>
    </>
  );
};

export default index;
