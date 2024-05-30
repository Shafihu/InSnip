import { useState } from "react";
import { View } from "react-native";

import TabBar from "../components/TabBar";
import Chat from "../components/Chat";
import Stories from "../components/Stories";
import Map from "../components/Map";
import Spotlight from "../components/Spotlight";
import Camera from "../components/Camera";

const index = () => {
  const [camera, setCamera] = useState(true);
  const [maps, setMaps] = useState(false);
  const [chat, setChat] = useState(false);
  const [stories, setStories] = useState(false);
  const [spotlight, setSpotlight] = useState(false);

  const handleCameraPress = () => {
    setCamera(true);
    setStories(false);
    setMaps(false);
    setChat(false);
    setSpotlight(false);
    console.log("Camera Pressed");
  };

  const handleChatPress = () => {
    setChat(true);
    setStories(false);
    setMaps(false);
    setCamera(false);
    setSpotlight(false);
    console.log("Chat Pressed");
  };

  const handleStoriesPress = () => {
    setStories(true);
    setMaps(false);
    setCamera(false);
    setChat(false);
    setSpotlight(false);
    console.log("Stories Pressed");
  };

  const handleMapsPress = () => {
    setMaps(true);
    setCamera(false);
    setChat(false);
    setStories(false);
    setSpotlight(false);
    console.log("Maps Pressed");
  };

  const handleSpotlightPress = () => {
    setSpotlight(true);
    setMaps(false);
    setCamera(false);
    setChat(false);
    setStories(false);
    console.log("Spotlight Pressed");
  };

  return (
    <>
      <View
        className={`flex-1 ${stories || chat ? "bg-[#faf9f6]" : "bg-black"} ${
          camera || stories || chat ? "pt-[50px]" : "pt-0"
        } relative`}
      >
        <View className=" rounded-t-[20px] rounded-b-[5px] overflow-hidden">
          {camera && <Camera />}
        </View>

        {maps && <Map />}
        {chat && <Chat />}
        {stories && <Stories />}
        {spotlight && <Spotlight />}

        <TabBar
          onPressCamera={handleCameraPress}
          onPressChat={handleChatPress}
          onPressStories={handleStoriesPress}
          onPressMaps={handleMapsPress}
          onPressSpotlight={handleSpotlightPress}
        />
      </View>
    </>
  );
};

export default index;
