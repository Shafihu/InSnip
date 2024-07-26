import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { useRouter } from "expo-router";
import { useUser } from "../../../../context/UserContext";
import { useTheme } from "../../../../context/ThemeContext";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { Ionicons } from "react-native-vector-icons";

const SoundScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [sound, setSound] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlists, setPlaylists] = useState();
  const { userData, setMusic } = useUser();
  const currentUserId = userData.id;
  const { theme } = useTheme();
  const router = useRouter();

  const onActualChange = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    searchSongs();
    fetchPlaylists();
  }, [searchText]);

  async function fetchPlaylists() {
    try {
      const response = await fetch(
        "https://api.deezer.com/chart/playlist/albums"
      );
      const data = await response.json();
      setPlaylists(data.data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  }

  async function fetchPopularSongs() {
    try {
      const response = await fetch("https://api.deezer.com/chart");
      const data = await response.json();
      setTracks(data.tracks.data);
    } catch (error) {
      console.error("Error fetching popular tracks:", error);
    }
  }

  async function searchSongs() {
    if (!searchText) {
      fetchPopularSongs();
      return;
    }
    try {
      const response = await fetch(
        `https://api.deezer.com/search?q=${searchText}`
      );
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
    router.back();
  };

  const handlePlaylistPressed = (url, title) => {
    router.push({
      pathname: "/verified/sounds/[playlistScreen]",
      params: {
        url: url,
        title: title,
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}
    >
      <SearchBar
        onActualChange={onActualChange}
        placeholder="Search artists and sounds"
        isPlaying={isPlaying}
      />

      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme.textColor,
            }}
          >
            Playlists
          </Text>
        </View>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.backgroundColor, flex: 0.25 },
          ]}
        >
          <FlatList
            data={playlists}
            keyExtractor={(item) => item?.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  handlePlaylistPressed(item.tracklist, item.title)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 15,
                  width: "50%",
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
                    source={{ uri: item.cover }}
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                  />
                  <View style={{ gap: 4, flex: 0.9 }}>
                    <Text
                      style={{
                        color: theme.textColor,
                        fontSize: 15,
                        letterSpacing: 0.3,
                        fontWeight: "700",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            numColumns={2}
          />
        </View>
        <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme.textColor,
            }}
          >
            {searchText ? "Search Results" : "Popular"}
          </Text>
        </View>
        <View
          style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        >
          <FlatList
            data={tracks}
            keyExtractor={(item) => item?.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }) => (
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
                  {/* <Text
                    style={{
                      color: theme.textColor,
                      fontSize: 15,
                      textAlign: "left",
                    }}
                  >
                    #{item.position}
                  </Text> */}
                  <Image
                    source={{ uri: item.album.cover }}
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
                      {item.artist.name}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => togglePlay(item.preview)}>
                  <Ionicons
                    name={
                      isPlaying && currentTrack === item.preview
                        ? "stop"
                        : "play"
                    }
                    size={20}
                    color={theme.primaryColor}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
});

export default SoundScreen;
