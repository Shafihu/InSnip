import React from "react";
import LottieView from "lottie-react-native";

export default function MusicRain() {
  return (
    <LottieView
      source={require("../../lottie-animations/MusicRain.json")}
      style={{ width: 200, height: 200 }}
      autoPlay
      loop={true}
    />
  );
}
