import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const QRCodeButton = ({ handleOpenQRCode }) => {
  return (
    <TouchableOpacity
      onPress={handleOpenQRCode}
      style={{
        width: 200,
        alignItems: "center",
        alignSelf: "center",
        padding: 6,
        borderWidth: 3,
        borderRadius: 10,
        borderStyle: "dashed",
        borderColor: "#fff",
      }}
    >
      <Text style={{ color: "#fff" }}>QR Code Detected</Text>
    </TouchableOpacity>
  );
};

export default QRCodeButton;
