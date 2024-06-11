import React, { useState, useEffect } from "react";
import { Text, Pressable, StyleSheet, View, Animated } from "react-native";
import Toast from "react-native-toast-message";
import processUserImage from "../../../../utils/processUserImage";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from 'react-native-vector-icons';
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../Firebase/config";
import { Image } from "expo-image";
import { useUser } from "../../../../context/UserContext";
import { useChatStore } from "../../../../context/ChatContext";

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const UserProfile = () => {
    const { id, firstname, lastname, username, avatar, } = useLocalSearchParams();
    const [profilePic, setProfilePic] = useState(null);
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
                console.log(userData);
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
    }

    const showErrorToast = (message) => {
        Toast.show({
            type: "error",
            text1: message,
        });
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
                    <MaterialCommunityIcons name="image-edit-outline" color="#fff" size={20} />
                </Pressable>
            </View>
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <Animated.Image
                    source={isReceiverBlocked ? require('../../../../assets/placeholder.png') : profilePic ? { uri: profilePic } : processUserImage(avatar)} 
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
                    <>
                        <View className="flex-1 flex-row items-center gap-4">
                            <Pressable style={{ borderWidth: 3, borderColor: 'pink', borderRadius: '100%' }}>
                                <Image source={isReceiverBlocked ? require('../../../../assets/placeholder.png') : processUserImage(avatar)} style={styles.userImage} contentFit="cover" transition={500} />
                            </Pressable>
                            <View className="w-full h-full items-start justify-center gap-2">
                                <Text style={styles.userInfo} className="font-bold tracking-wide">{firstname} {lastname}</Text>
                                <Text style={{ fontSize: 12, fontWeight: 500, color: 'gray' }}>{username}</Text>
                            </View>
                        </View>
                    </>
                        <View style={{gap: 10}}>
                            <Pressable onPress={handleBlock} style={{backgroundColor: 'red', padding: 10, borderRadius: 8}}>
                                <Text style={styles.logoutText}>{isCurrentUserBlocked ? 'Block' : isReceiverBlocked ? 'Unblock' : 'Block' }</Text>
                            </Pressable>
                        </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
        justifyContent: 'space-between'
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
        backgroundColor: '#03A9F4',
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
        paddingHorizontal: 20,
        paddingVertical: 20,
        flex: 1,
        justifyContent: 'space-between',
        gap: 20
    },
    userImage: {
        width: 90,
        height: 90,
        borderRadius: 50,
    },
    userInfo: {
        fontSize: 20,
    },
    logoutText: {
        fontSize: 16,
        color: "white",
        textAlign: 'center',
        fontWeight: 'bold'
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
        borderRadius: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: 40,
        width: 40,
        zIndex: 99999
    }
});
