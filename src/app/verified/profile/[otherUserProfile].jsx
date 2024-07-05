import React, { useState, useEffect } from "react";
import { Text, Pressable, StyleSheet, View, Animated, Dimensions, Alert } from "react-native";
import Toast from "react-native-toast-message";
import processUserImage from "../../../../utils/processUserImage";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons, FontAwesome } from 'react-native-vector-icons';
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../Firebase/config";
import { Image } from "expo-image";
import { useUser } from "../../../../context/UserContext";
import { useChatStore } from "../../../../context/ChatContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 3;

const UserProfile = () => {
    const { id, firstname, lastname, username, avatar } = useLocalSearchParams();
    const [profilePic, setProfilePic] = useState(null);
    const [tab, setTab] = useState(true);
    const scrollY = new Animated.Value(0);
    const { userData } = useUser();
    const { changeBlock, isReceiverBlocked, isCurrentUserBlocked } = useChatStore();

    const currentUser = userData;
    const currentUserId = currentUser.id;

    useEffect(() => {
        if (id) {
            getUserPic();
        }
    }, [id]);

    const getUserPic = async () => {
        try {
            const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', id));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.picture) {
                    setProfilePic(userData.picture);
                } else {
                    console.log('No picture found in user data');
                }
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user document:', error);
        }
    };

    const handleBlock = async () => {
        changeBlock();
        const userDocRef = doc(FIRESTORE_DB, 'users', currentUserId);
        await updateDoc(userDocRef, {
            blocked: isReceiverBlocked ? arrayRemove(id) : arrayUnion(id)
        });
    };

    const showErrorToast = (message) => {
        Toast.show({
            type: "error",
            text1: message,
        });
    };

    const toggleTab = () => {
        setTab(prev => !prev);
    };

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    const imageTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => router.back()} style={styles.button}>
                    <FontAwesome6 name="chevron-left" color="#fff" size={20} />
                </Pressable>
                <Pressable style={styles.button}>
                    <FontAwesome name="share-square-o" color="#fff" size={20} />
                </Pressable>
            </View>
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <Animated.Image
                    source={id === undefined ? require('../../../../assets/aiBannerPic.png') : isReceiverBlocked ? require('../../../../assets/placeholder.png') : profilePic ? { uri: profilePic } : processUserImage(avatar)}
                    style={[
                        styles.headerImage,
                        { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] },
                    ]}
                    onError={() => {
                        console.error('Error loading image');
                    }}
                    contentFit="cover"
                    transition={1000}
                />
            </Animated.View>

            <Animated.ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.scrollViewInner}>
                    <View style={styles.profileContainer}>
                        <Pressable style={styles.avatarWrapper}>
                            <Image source={id === undefined ? require('../../../../assets/aiChatPic.png') : isReceiverBlocked ? require('../../../../assets/placeholder.png') : processUserImage(avatar)} style={styles.userImage} contentFit="cover" transition={500} />
                        </Pressable>
                        <View style={styles.userInfoContainer}>
                            <Text style={styles.userInfo}>
                                {id === undefined ? 'My AI' : `${firstname} ${lastname}`}
                            </Text>
                            <Text style={styles.usernameText}>
                                {id === undefined ? 'myai' : `${username}`}
                            </Text>
                        </View>
                    </View>

                    {id !== undefined && (
                        <View style={styles.tabContainer}>
                            <Pressable onPress={toggleTab} style={[styles.tabButton, tab && styles.activeTab]}>
                                <Text style={[styles.tabText, tab && styles.activeTabText]}>Stories</Text>
                            </Pressable>
                            <Pressable onPress={toggleTab} style={[styles.tabButton, !tab && styles.activeTab]}>
                                <Text style={[styles.tabText, !tab && styles.activeTabText]}>Spotlight</Text>
                            </Pressable>
                        </View>
                    )}

                    {id !== undefined && (
                        <View style={styles.cardsContainer}>
                            {tab ? (
                                    <View style={styles.card} />
                            ) : (
                                <View style={[styles.card, styles.blueCard]} />
                            )}
                        </View>
                    )}
                </View>
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2ecc71',
        overflow: 'hidden',
    },
    headerImage: {
        width: '100%',
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewInner: {
        paddingVertical: 20,
        flex: 1,
        justifyContent: 'space-between',
        gap: 20,
    },
    profileContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
    },
    avatarWrapper: {
        borderWidth: 3,
        borderColor: '#2ecc71',
        borderRadius: 50,
        padding: 3,
    },
    userImage: {
        width: 90,
        height: 90,
        borderRadius: 50,
    },
    userInfoContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        gap: 2,
    },
    userInfo: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1.1,
        color: '#333333',
    },
    usernameText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'gray',
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabButton: {
        width: '50%',
        padding: 10,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderColor: '#333333',
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        color: '#7f8c8d',
    },
    activeTabText: {
        color: '#333333',
    },
    cardsContainer: {
        height: '100%',
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    card: {
        backgroundColor: 'red',
        width: CARD_WIDTH,
        height: 200,
    },
    blueCard: {
        backgroundColor: 'blue',
    },
    buttonContainer: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        zIndex: 999,
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        backgroundColor: 'rgba(0,0,0,.35)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: 40,
        width: 40,
        zIndex: 99999,
    },
    logoutText: {
        fontSize: 16,
        color: "white",
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default UserProfile;
