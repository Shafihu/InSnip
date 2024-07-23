import React from "react";
import LottieView from "lottie-react-native";

export default function BreathLoader() {
  return (
    <LottieView
      source={require("../../lottie-animations/BreathLoader.json")}
      style={{ width: 800, height: 800 }}
      autoPlay
      loop
      colorFilters={[
        {
          keypath: "Shape Layer 6",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 7",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 8",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 9",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 10",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 11",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 12",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 13",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 14",
          color: "#2ecc71",
        },
        {
          keypath: "Shape Layer 15",
          color: "#2ecc71",
        },
      ]}
    />
  );
}
