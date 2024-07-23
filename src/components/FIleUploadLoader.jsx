import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Ionicons, Entypo } from "react-native-vector-icons";
import { useTheme } from "../../context/ThemeContext";

const FileUploadLoader = ({
  uploadProgress,
  media,
  setLocalMediaUri,
  setMedia,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={38}
        width={3}
        fill={uploadProgress || 0}
        rotation={0}
        tintColor={uploadProgress === 100 ? "transparent" : theme.primaryColor}
        backgroundColor={
          uploadProgress === 100
            ? "transparent"
            : media
            ? theme.grayText
            : "rgba(0,0,0,0.1)"
        }
        style={styles.loader}
      >
        {() => (
          <View style={styles.innerCircle}>
            {media ? (
              <Pressable
                onPress={() => {
                  setLocalMediaUri(null);
                  setMedia(null);
                }}
              >
                <Entypo name="controller-stop" size={16} color="#fff" />
              </Pressable>
            ) : (
              <Ionicons name="document" size={25} color="gray" />
            )}
            {children}
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "relative",
  },
  innerCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FileUploadLoader;
