import React from "react";
import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

const Waveform = ({ waveform }) => {
  const points = waveform
    .map((amplitude, index) => `${index * 1.75},${100 - amplitude * 100}`)
    .join(" ");

  return (
    <Svg height="35" width="200">
      <Polyline points={points} fill="none" stroke="#fff" strokeWidth="2" />
    </Svg>
  );
};

const generateWaveform = () => {
  return new Array(150).fill(0).map(() => Math.random());
};

const WaveScreen = () => {
  const waveform = generateWaveform();

  return (
    <View>
      <Waveform waveform={waveform} />
    </View>
  );
};

export default WaveScreen;
