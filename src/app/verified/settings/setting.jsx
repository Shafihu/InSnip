import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Switch,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../context/ThemeContext";
import { useUser } from "../../../../context/UserContext";
import { format } from "date-fns";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../../Firebase/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { CommonActions, useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const { userData } = useUser();
  const { theme, darkMode, setDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData?.Birthday) {
      try {
        const date = userData.Birthday.toDate();
        const formattedDate = format(date, "MMMM d, yyyy");
        setBirthDate(formattedDate);
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  }, [userData]);

  const settingsData = [
    { label: "Name", value: userData?.FirstName + " " + userData?.LastName },
    { label: "Username", value: userData?.Username },
    { label: "Birthday", value: birthDate },
    { label: "Mobile Number", value: "059 530 3985" },
    { label: "Email", value: userData?.Email, isEmail: true },
    { label: "InSnip+" },
    { label: "Bitmoji" },
    { label: "Cameos" },
    { label: "AI selfies" },
    { label: "Password" },
    { label: "Two-Factor Authentication" },
    { label: "Notifications" },
    { label: "Memories" },
  ];
  const accountActionData = [
    { label: "Delete Account", isEmail: true },
    {
      label: "Sign Out",
      method: () => {
        handleSignOut();
      },
      isSignOut: true,
      isEmail: true,
    },
  ];

  const showToast = (message) => {
    Toast.show({
      type: "customInfoToast",
      text1: message,
      visibilityTime: 2000,
    });
  };

  const showErrorToast = (message) => {
    Toast.show({
      type: "customErrorToast",
      text1: message,
      visibilityTime: 2000,
    });
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    await AsyncStorage.setItem("@settings", JSON.stringify(newDarkMode));
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(FIREBASE_AUTH);
      await AsyncStorage.removeItem("@userData");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "index" }],
        })
      );
      showToast("Signed out successfully");
    } catch (error) {
      showErrorToast("Oops! something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.backgroundColor,
        paddingTop: Platform.OS === "android" && StatusBar.currentHeight,
      }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <View
          style={[
            styles.headerContainer,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: theme.textColor }]}>
            Settings
          </Text>
        </View>
        <View
          style={[styles.section, { backgroundColor: theme.backgroundColor }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            MY ACCOUNT
          </Text>
          {settingsData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, { backgroundColor: theme.backgroundColor }]}
            >
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: theme.textColor },
                    item.isEmail && styles.email,
                  ]}
                >
                  {item.label}
                </Text>
                {item.value && (
                  <Text style={[styles.value, item.isEmail && styles.email]}>
                    {item.value}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundColor }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            APPEARANCE
          </Text>
          <View style={styles.option}>
            <Ionicons
              name={darkMode ? "moon" : "sunny"}
              size={24}
              color="#2ecc71"
              style={styles.optionIcon}
            />
            <Text style={[styles.optionText, { color: theme.textColor }]}>
              Dark Mode
            </Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#bdc3c7", true: "#2ecc71" }}
              thumbColor={darkMode ? "#ffffff" : "#ffffff"}
            />
          </View>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundColor }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            ACCOUNT ACTIONS
          </Text>
          {accountActionData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, { backgroundColor: theme.backgroundColor }]}
              onPress={item?.method}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "50%",
                }}
              >
                <Text
                  style={[
                    styles.label,
                    { color: theme.textColor },
                    item.isEmail && styles.email,
                  ]}
                >
                  {item.label}
                </Text>
                {item.value && (
                  <Text style={[styles.value, item.isEmail && styles.email]}>
                    {item.value}
                  </Text>
                )}
                {item.isSignOut && loading && (
                  <ActivityIndicator size="small" />
                )}
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            marginVertical: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: theme.grayText, textAlign: "center" }}>
            InSnip v1.0.0 🤳
          </Text>
          <Text style={{ color: theme.grayText, textAlign: "center" }}>
            Made In Ghana, Kumasi
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#34495e",
    flex: 1,
    fontWeight: 500,
    paddingLeft: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  email: {
    color: "#e74c3c",
  },
});

export default SettingsScreen;
