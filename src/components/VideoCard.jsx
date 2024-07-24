import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Video } from "expo-av";
import {
  AntDesign,
  MaterialIcons,
  Fontisto,
  Entypo,
} from "react-native-vector-icons";
import { FIRESTORE_DB } from "../../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Image } from "expo-image";
import processUserImage from "../../utils/processUserImage";
import { shareAsync } from "expo-sharing";
import Heart from "./Heart";
import DoubleTap from "./DoubleTap";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const VideoCard = ({ video, isActive, handleOpenPress, totalComments }) => {
  const videoRef = useRef(null);
  const [play, setPlay] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [like, setLike] = useState(false);
  const [commentsModal, setCommentsModal] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const userId = video?.userId;
  const username = video?.username;
  const avatar = video?.avatar;

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        const docRef = doc(FIRESTORE_DB, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      return null;
    };

    const manageVideo = async () => {
      if (isActive) {
        videoRef.current.playAsync();
        setPlay(true);
      } else {
        videoRef.current.stopAsync();
        setPlay(false);
      }
    };

    manageVideo();
  }, [isActive]);

  const togglePlay = () => {
    if (play) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setPlay(!play);
  };

  const toggleLikeIcon = () => {
    setLike((prev) => !prev);
    if (!like) {
      setShowLikeAnimation(true);
      setTimeout(() => {
        setShowLikeAnimation(false);
      }, 1000);
    }
  };

  const handleShare = async () => {
    try {
      await shareAsync(video.url, {
        dialogTitle: "Share this video",
        mimeType: "video/mp4",
        UTI: "public.movie",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View style={styles.itemContainer}>
      {showLikeAnimation && (
        <View style={{ position: "absolute", top: "20%", zIndex: 9999 }}>
          <Heart />
        </View>
      )}
      <Video
        ref={videoRef}
        source={{ uri: video.url }}
        style={styles.video}
        resizeMode="contain"
        shouldPlay={play}
        isLooping
      />
      <DoubleTap onDoubleTap={toggleLikeIcon} singleTap={togglePlay}>
        {!play && (
          <View style={styles.playIcon}>
            <Entypo
              name="controller-play"
              size={70}
              color="rgba(255,255,255,.5)"
            />
          </View>
        )}
        <View style={styles.leftControls}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Image
                source={processUserImage(avatar)}
                style={styles.avatarImage}
              />
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.username}
            >
              {username || ""}
            </Text>
          </View>
        </View>
        <View style={styles.rightControls}>
          <Pressable style={styles.icon}>
            <MaterialIcons name="bookmark-add" size={36} color="white" />
          </Pressable>
          <Pressable onPress={toggleLikeIcon} style={styles.icon}>
            <AntDesign
              name="heart"
              size={32}
              color={like ? "#E84855" : "white"}
            />
          </Pressable>
          <View style={{ alignItems: "center" }}>
            <Pressable
              onPress={() => handleOpenPress(video?.url, userId)}
              style={[styles.icon, totalComments && { marginBottom: 0 }]}
            >
              <MaterialIcons name="mode-comment" size={30} color="white" />
            </Pressable>
            {totalComments ? (
              <Text style={styles.text}>{totalComments}</Text>
            ) : (
              <></>
            )}
          </View>
          <Pressable onPress={handleShare} style={styles.icon}>
            <Fontisto name="share-a" size={28} color="white" />
          </Pressable>
          <Pressable style={styles.moreIcon}>
            <Fontisto
              name="more-v-a"
              size={25}
              color="white"
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </Pressable>
        </View>
      </DoubleTap>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
    paddingBottom: Platform.OS === "ios" ? 140 : 100,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 16,
    paddingHorizontal: 6,
    height: "100%",
    backgroundColor: "transparent",
  },
  rightControls: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    marginBottom: 12,
    alignItems: "center",
    padding: 5,
  },
  moreIcon: {
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  leftControls: {
    justifyContent: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 30,
    height: 30,
    backgroundColor: "#2ecc71",
    borderRadius: 15,
    marginRight: 8,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  playIcon: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -35 }],
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 50,
  },
});

export default VideoCard;
