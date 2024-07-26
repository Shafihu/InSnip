import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../../../context/UserContext";
import { Audio } from "expo-av";
import { router } from "expo-router";

const PlaylistScreen = () => {
  //STATES
  const { url, title } = useLocalSearchParams();
  const [sound, setSound] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  //HOOKS
  const { userData, setMusic } = useUser();
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    if (title) {
      navigation.setOptions({
        headerTitle: title,
        headerTintColor: theme.textColor,
        headerStyle: {
          backgroundColor: theme.backgroundColor,
        },
      });
    }
  }, [title, navigation, theme]);

  useEffect(() => {
    fetchTracks();
  }, [url]);

  async function fetchTracks() {
    if (!url) {
      return;
    }
    try {
      const response = await fetch(`${url}`);
      const data = await response.json();
      setTracks(data.data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  }

  async function playSound(preview) {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: preview,
    });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  const togglePlay = async (preview) => {
    if (isPlaying && currentTrack === preview) {
      await pauseSound();
    } else {
      await playSound(preview);
      setCurrentTrack(preview);
    }
  };

  const chooseMusic = async () => {
    setMusic(currentTrack);
    pauseSound();
    router.navigate("/verified/home");
  };

  const renderTrackItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          source={require("../../../../assets/headphone.png")}
          style={{ width: 50, height: 50, borderRadius: 8 }}
        />
        <View style={{ gap: 4, flex: 0.9 }}>
          <Text
            style={{
              color:
                isPlaying && currentTrack === item.preview
                  ? theme.primaryColor
                  : theme.textColor,
              fontSize: 15,
              letterSpacing: 0.3,
              fontWeight: "500",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: theme.grayText, fontSize: 12 }}
          >
            {item.artist?.name}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => togglePlay(item.preview)}>
        <Ionicons
          name={isPlaying && currentTrack === item.preview ? "stop" : "play"}
          size={20}
          color={theme.primaryColor}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: theme.backgroundColor,
      }}
    >
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <FlatList
          data={tracks}
          keyExtractor={(item) => item?.id}
          showsVerticalScrollIndicator={false}
          renderItem={renderTrackItem}
        />
      </View>

      {currentTrack && isPlaying && (
        <TouchableOpacity
          onPress={chooseMusic}
          style={{
            position: "absolute",
            bottom: 50,
            alignSelf: "center",
            width: "60%",
            paddingVertical: 15,
            backgroundColor: theme.primaryColor,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "500" }}>
            Next
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PlaylistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
