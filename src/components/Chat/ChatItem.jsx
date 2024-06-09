import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { MaterialIcons, Feather } from 'react-native-vector-icons';
import { useRouter } from 'expo-router';
import processUserImage from '../../../utils/processUserImage';
import { useChatStore } from '../../../context/ChatContext';
import { FIRESTORE_DB } from '../../../Firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '../../../context/UserContext';

const ChatItem = ({ handleChatCam, chat, isSeen, avatar, firstName, lastName, lastMessage }) => {
  const { userData } = useUser();
  const { changeChat } = useChatStore();
  const router = useRouter(); // Corrected to useRouter hook

  const currentUserId = userData.id;

  const handleSelect = async (selectedChat) => {
    const userChatsRef = doc(FIRESTORE_DB, 'userchats', currentUserId);
    const userChatsSnapshot = await getDoc(userChatsRef);
    
    if (userChatsSnapshot.exists()) {
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chats.findIndex(item => item.chatId === selectedChat.chatId);

      if (chatIndex !== -1) {
        userChatsData.chats[chatIndex].isSeen = true;

        try {
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          });
          changeChat(selectedChat.chatId, selectedChat.user);
        } catch (error) {
          console.log('Error updating document: ', error);
        }
      }
    }
  };

  return (
    <Pressable
      onPress={async () => {
        router.push({
          pathname: '/verified/chatRoom/chatroom',
          params: {
            chatId: chat.chatId,
            userId: chat.user.id
          }
        });
        await handleSelect(chat);
      }}
      className={`flex flex-row items-center justify-between gap-4 py-2 px-3 pr-5 border border-t-1 border-b-0 border-l-0 border-r-0 border-gray-200 ${isSeen ? 'bg-white' : 'bg-green-500'}`}
    >
      <View className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden">
        <Image
          source={processUserImage(avatar)}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-lg tracking-wider capitalize">{firstName} {lastName}</Text>
        <View className="flex flex-row items-center gap-2">
          <MaterialIcons
            name="chat-bubble-outline"
            size={12}
            color="#00BFFF"
            className="transform scale-x-[-1]"
          />
          <Text className="text-[11px] font-medium text-gray-500">{lastMessage === '' ? 'Tap to chat' : lastMessage}</Text>
        </View>
      </View>
      <Pressable onPress={handleChatCam}>
        <Feather name="camera" size={20} color="#B0B0B0" />
      </Pressable>
    </Pressable>
  );
};

export default ChatItem;
