import React, { useRef } from "react";
import { View, TouchableOpacity } from "react-native";

const DoubleTap = ({ onDoubleTap, children }) => {
  const lastTap = useRef(null);
  const timeout = 300;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < timeout) {
      onDoubleTap();
    } else {
      lastTap.current = now;
    }
  };

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: "transparent",
      }}
      activeOpacity={1}
      onPress={handleDoubleTap}
    >
      {children}
    </TouchableOpacity>
  );
};

export default DoubleTap;
