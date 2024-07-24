import React from "react";
import LottieView from "lottie-react-native";

export default function DocShareLoader() {
  return (
    <LottieView
      source={require("../../lottie-animations/DocShareSpinner.json")}
      style={{ width: 35, height: 35 }}
      autoPlay
      loop
    />
  );
}
