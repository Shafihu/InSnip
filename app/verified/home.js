"use client";

import { CameraView, useCameraPermissions } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  Pressable,
  Button,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";

import { Ionicons, Foundation } from "react-native-vector-icons";
import FilterScrollView from "../../components/FilitersScroll";

import TabBar from "../../components/TabBar";
import Chat from "../../components/Chat";
import Stories from "../../components/Stories";
import Map from "../../components/Map";
import Spotlight from "../../components/Spotlight";
import TabBarPreview from "../../components/TabBarPreview";
import Header from "../../components/Header";

const HomeScreen = () => {
  const [facing, setFacing] = useState("front");
  const [flash, setFlash] = useState("off");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState();
  const cameraRef = useRef();
  const [camera, setCamera] = useState(true);
  const [maps, setMaps] = useState(false);
  const [chat, setChat] = useState(false);
  const [stories, setStories] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (savedVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setSavedVisible(false));
    }
  }, [savedVisible, fadeAnim]);

  const handleCameraPress = () => {
    setCamera(true);
    setStories(false);
    setMaps(false);
    setChat(false);
    setSpotlight(false);
  };

  const handleChatPress = () => {
    setChat(true);
    setStories(false);
    setMaps(false);
    setCamera(false);
    setSpotlight(false);
  };

  const handleChatCam = () => {
    setCamera(true);
    setStories(false);
    setMaps(false);
    setChat(false);
    setSpotlight(false);
  };

  const handleStoriesPress = () => {
    setStories(true);
    setMaps(false);
    setCamera(false);
    setChat(false);
    setSpotlight(false);
  };

  const handleMapsPress = () => {
    setMaps(true);
    setCamera(false);
    setChat(false);
    setStories(false);
    setSpotlight(false);
  };

  const handleSpotlightPress = () => {
    setSpotlight(true);
    setMaps(false);
    setCamera(false);
    setChat(false);
    setStories(false);
  };

  useEffect(() => {
    if (!mediaPermission) {
      requestMediaPermission();
    }
  }, []);

  if (!cameraPermission || !mediaPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center text-white">
          We need your permission to access the camera
        </Text>
        <Button onPress={requestCameraPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleCapture = async () => {
    const options = { quality: 1, base64: true, exif: false };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleCameraFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  let handleDownload = () => {
    MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      // setPhoto(undefined);
      setSavedVisible(true);
    });
  };

  let handleStory = () => {};

  let handleShare = async () => {
    await shareAsync(photo.uri);
    setPhoto(undefined);
  };

  return (
    <>
      <View
        className={`flex-1 ${stories && "bg-white"} ${
          chat ? "bg-white" : "bg-black"
        } ${
          camera || stories || chat || spotlight ? "pt-[50px]" : "pt-0"
        } relative`}
      >
        <View className=" rounded-t-[20px] rounded-b-[5px] overflow-hidden">
          {camera && (
            <CameraView
              className="flex-1 rounded-full"
              facing={facing}
              flash={flash}
              autofocus="on"
              zoom={0}
              ref={cameraRef}
            >
              <View className="flex-1 bg-transparent my-96 rounded-full bg-green-500"></View>

              {photo && (
                <>
                  <View className="flex-1 h-full w-full z-50 absolute left-0 top-0 right-0 bottom-0 ">
                    <Image
                      source={{ uri: photo.uri }}
                      className="flex-1"
                      resizeMode="cover"
                    />

                    <View className="absolute top-5 w-full flex-row justify-between px-6">
                      <TouchableOpacity
                        className="text-white font-bold text-[20px]"
                        onPress={() => setPhoto(undefined)}
                      >
                        <Ionicons name="close" color="white" size={30} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="text-white font-bold text-[20px]"
                        onPress={() => setPhoto(null)}
                      >
                        <Text className="text-white">Discard</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              {!photo && (
                <>
                  <Header
                    header=""
                    toggleCameraFacing={toggleCameraFacing}
                    toggleCameraFlash={toggleCameraFlash}
                  />

                  {/* BOTTOM CAMERA ICONS  */}
                  <View className="flex flex-row items-center justify-between px-4 w-full absolute left-0 bottom-32 right-0">
                    <Pressable className="bg-black/25 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                      <Ionicons
                        name="images-outline"
                        size={23}
                        color="white"
                        className="transform rotate-90"
                      />
                    </Pressable>

                    <Pressable className="bg-black/25 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                      <Foundation
                        name="magnifying-glass"
                        size={25}
                        color="white"
                        className="transform scale-x-[-1]"
                      />
                    </Pressable>
                  </View>

                  {/* FILTERS */}
                  <FilterScrollView handleCapture={handleCapture} />
                </>
              )}
            </CameraView>
          )}
        </View>

        {maps && <Map />}
        {chat && <Chat handleChatCam={handleChatCam} />}
        {stories && <Stories />}
        {spotlight && <Spotlight />}

        {!photo && (
          <TabBar
            onPressCamera={handleCameraPress}
            onPressChat={handleChatPress}
            onPressStories={handleStoriesPress}
            onPressMaps={handleMapsPress}
            onPressSpotlight={handleSpotlightPress}
          />
        )}

        {photo && (
          <TabBarPreview
            handleDownload={handleDownload}
            handleShare={handleShare}
            handleStory={handleStory}
          />
        )}

        {savedVisible && (
          <Animated.View
            style={{ opacity: fadeAnim }}
            className="absolute top-20 left-0 right-0 z-50 flex flex-row items-center justify-center gap-1"
          >
            <Text className="text-center text-white text-xl font-bold">
              Saved
            </Text>
            <Ionicons name="checkmark-circle" size={25} color="white" />
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default HomeScreen;
