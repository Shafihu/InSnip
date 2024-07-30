import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";

export default function MusicWave({ isPlaying }) {
  const animationRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current.play();
    } else {
      animationRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <LottieView
      ref={animationRef}
      source={require("../../lottie-animations/MusicWave.json")}
      style={{ width: 400, height: 35 }}
      autoPlay={false}
      loop={true}
    />
  );
}
