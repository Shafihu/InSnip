import React from "react";
import LottieView from "lottie-react-native";

export default function CustomLoader() {
  return (
    <LottieView
      source={require("../../lottie-animations/Animation - 1718578138643.json")}
      style={{width: 50, height: 50, }}
      autoPlay
      loop
    />
  );
}