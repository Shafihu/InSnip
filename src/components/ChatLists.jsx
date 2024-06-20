import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import { Entypo } from 'react-native-vector-icons';
import Header from './Header';
import ChatItem from './Chat/ChatItem';
import { useUser } from '../../context/UserContext';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../Firebase/config';
import { router } from 'expo-router';
import CustomLoader from './CustomLoader';
import { Image } from 'expo-image';

const Chat = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const { userData } = useUser();

  useEffect(() => {
    const userId = userData?.id;
    if (!userId) return;

    setLoading(true);
    const unSub = onSnapshot(doc(FIRESTORE_DB, "userchats", userId), async (res) => {
      try {
        if (!res.exists()) {
          await setDoc(doc(FIRESTORE_DB, "userchats", userId), { chats: [] });
          setChats([]);
        } else {
          const items = res.data()?.chats || [];
          const promises = items.map(async (item) => {
            const userDocRef = doc(FIRESTORE_DB, 'users', item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data();
            return { ...item, user };
          });
          const chatData = await Promise.all(promises);
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unSub();
    };
  }, [userData?.id]);

  const handleNewMessagePress = useCallback(() => {
    router.push('/verified/addChat');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header header="Chat" />
      <View style={styles.content}>
        <Pressable  onPress={handleNewMessagePress} style={styles.newMessageButton}>
          <Entypo name="new-message" size={25} color="white" />
        </Pressable>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.archiveContainer}>
            <View style={styles.archiveIcon}>
              <Entypo name="archive" size={30} color="#2F3E46" />
            </View>
            <View style={styles.archiveTextContainer}>
              <Text style={styles.archiveText}>Archived</Text>
            </View>
            <View style={styles.newIndicator}>
              <Text style={styles.newText}>New</Text>
              <Entypo name="new" size={25} color="#FFD700" />
            </View>
          </View>

          {
  loading ? (
    <View style={styles.loaderContainer}>
      <CustomLoader />
    </View>
  ) : (
      chats.map((chat) => (
        <MemoizedChatItem
          key={chat.chatId}
          id={chat.id}
          isSeen={chat.isSeen}
          chat={chat}
          avatar={chat.user?.avatar}
          firstName={chat.user?.FirstName}
          lastName={chat.user?.LastName}
          lastMessage={chat.lastMessage}
        />
      ))
  )
}
        </ScrollView>
      <View style={{flex: 1, flexGrow: 4}}>
      {!loading && chats.length < 1 && (
                <View style={{flexGrow: 1,paddingBottom: 130, justifyContent: 'center', alignItems: 'center', gap: 10}}>
                        <Image
                          source={require('../../assets/chatlistImage.png')}
                          style={{width: '80%', height: '40%'}}
                          contentFit="cover"
                        />
                  <Text style={{color: 'rgba(0,0,0,0.3)', fontWeight: '500'}}>Add friends to start conversations</Text>
                </View>
              )
            }
      </View>
      </View>
    </SafeAreaView>
  );
};

const MemoizedChatItem = React.memo(ChatItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    
  },
  newMessageButton: {
    backgroundColor: '#2F3E46',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,
    right: 15,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 99,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  archiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: 'white', 
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 10
  },
  archiveIcon: {
    width: 60,
    height: 60,
    // backgroundColor: '#ffd700',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveTextContainer: {
    flex: 1,
  },
  archiveText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F3E46', // Text Color: Charcoal Black
  },
  newIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700', // Accent Color: Neon Green
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
