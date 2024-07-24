import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";

export const ZoomSlider = ({ setZoom }) => {
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const handleZoomChange = (value) => {
    setZoom(value);
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        theme={{
          maximumTrackTintColor: "rgba(0,0,0,0.2)",
          minimumTrackTintColor: "#fff",
          bubbleBackgroundColor: "rgba(0,0,0,0.3)",
          heartbeatColor: "#999",
        }}
        onValueChange={handleZoomChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    height: 120,
  },
  slider: {
    width: 100,
    height: 300,
    transform: [{ rotate: "-90deg" }],
    transformOrigin: "center center",
  },
});
