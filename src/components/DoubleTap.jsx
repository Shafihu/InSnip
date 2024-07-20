import React, { useRef } from "react";
import { TouchableOpacity } from "react-native";

const DoubleTap = ({ onDoubleTap, children, singleTap, source }) => {
  const lastTap = useRef(null);
  const timeout = 300;
  const tapTimeout = useRef(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < timeout) {
      clearTimeout(tapTimeout.current);
      onDoubleTap();
    } else {
      lastTap.current = now;
      tapTimeout.current = setTimeout(() => {
        singleTap();
      }, timeout);
    }
  };

  return (
    <TouchableOpacity
      style={
        source === "camera"
          ? { flex: 1, backgroundColor: "transparent" }
          : {
              position: "absolute",
              bottom: 150,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: 16,
              paddingHorizontal: 6,
              height: "100%",
              backgroundColor: "transparent",
            }
      }
      activeOpacity={1}
      onPress={handleDoubleTap}
    >
      {children}
    </TouchableOpacity>
  );
};

export default DoubleTap;
