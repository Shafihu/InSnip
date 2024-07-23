import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Ionicons,
  Entypo,
  FontAwesome,
  FontAwesome6,
} from "react-native-vector-icons";
import { useChatStore } from "../../../context/ChatContext";
import { useTheme } from "../../../context/ThemeContext";

const Bottom = ({
  handleSend,
  handlePickMedia,
  from,
  handleFocusedInput,
  handleFileUpload,
  go,
  user,
}) => {
  const [message, setMessage] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { theme } = useTheme();
  const { isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const onSend = () => {
    if (message.trim() || handlePickMedia || handleFileUpload) {
      handleSend(message.trim());
      setMessage("");
    }
  };

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <>
      {showMore && (
        <View
          style={{
            backgroundColor: "transparent",
            alignItems: "flex-end",
            marginBottom: 5,
            marginHorizontal: 5,
          }}
        >
          <View
            style={{
              backgroundColor: theme.backgroundColor,
              gap: 10,
              borderRadius: 5,
              padding: 8,
              flexDirection: "row",
            }}
          >
            <Pressable
              onPress={handleFileUpload}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.innerTabContainerColor,
              }}
            >
              <Ionicons
                name="document-attach"
                size={23}
                color={theme.textColor}
              />
            </Pressable>
            <Pressable
              onPress={handlePickMedia}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.innerTabContainerColor,
              }}
            >
              <Ionicons name="images" size={23} color={theme.textColor} />
            </Pressable>
          </View>
        </View>
      )}
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        {from && from === "bot" ? (
          <View />
        ) : (
          <View style={styles.cameraButtonWrapper}>
            <Pressable
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              style={[
                styles.cameraButton,
                { backgroundColor: theme.innerTabContainerColor },
              ]}
            >
              <FontAwesome
                name="camera"
                size={18}
                color={isReceiverBlocked ? "gray" : theme.textColor}
              />
            </Pressable>
          </View>
        )}
        <View style={styles.textInputWrapper}>
          <TextInput
            placeholder="Chat"
            placeholderTextColor={
              isReceiverBlocked ? "rgba(0,0,0,.1)" : theme.grayText
            }
            style={[
              styles.textInput,
              {
                backgroundColor: theme.innerTabContainerColor,
                color: theme.textColor,
              },
            ]}
            value={message}
            onChangeText={(text) => setMessage(text)}
            onSubmitEditing={onSend}
            returnKeyType="send"
            selectionColor="#2ecc71"
            onFocus={() => handleFocusedInput}
            keyboardAppearance={
              theme.backgroundColor === "#ffffff" ? "light" : "dark"
            }
          />
        </View>
        <View style={styles.actionsWrapper}>
          <Pressable
            disabled={isCurrentUserBlocked || isReceiverBlocked}
            onPress={onSend}
            style={styles.actionButton}
          >
            <Ionicons
              name="send"
              size={25}
              color={message.trim() !== "" || go ? "#2ecc71" : "gray"}
            />
          </Pressable>
          {from && from === "bot" ? (
            <View />
          ) : (
            <Pressable
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              onPress={toggleShowMore}
              style={[
                styles.actionButton,
                { backgroundColor: theme.innerTabContainerColor },
              ]}
            >
              <FontAwesome6
                name="plus"
                size={21}
                color={isReceiverBlocked ? "gray" : theme.textColor}
              />
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 3,
    paddingBottom: 5,
    gap: 8,
    height: 65,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  cameraButtonWrapper: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 50,
    height: 40,
  },
  textInput: {
    height: "100%",
    borderRadius: 50,
    fontSize: 17,
    paddingHorizontal: 15,
  },
  actionsWrapper: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Bottom;
