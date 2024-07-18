import React from "react";
import { WebView } from "react-native-webview";
import { StyleSheet, View } from "react-native";

const FaceFilterWebView = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "http://localhost:3000/face-filter.html" }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FaceFilterWebView;
