import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, Entypo, FontAwesome } from 'react-native-vector-icons';
import { useChatStore } from '../../../context/ChatContext';

const Bottom = ({ handleSend, handlePickMedia, from, user }) => {
  const [message, setMessage] = useState("");

  const { isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const onSend = () => {
    if (message.trim() || handlePickMedia) {
      handleSend(message.trim());
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      {from && from === 'bot' ? <View /> :
        <View style={styles.cameraButtonWrapper}>
          <Pressable disabled={isCurrentUserBlocked || isReceiverBlocked} style={styles.cameraButton}>
            <FontAwesome name="camera" size={18} color={isReceiverBlocked ? 'gray' : "#3B2F2F"} />
          </Pressable>
        </View>
      }
      <View style={styles.textInputWrapper}>
        <TextInput
          placeholder="Chat"
          placeholderTextColor={isReceiverBlocked ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.5)'}
          style={styles.textInput}
          value={message}
          onChangeText={(text) => setMessage(text)}
          onSubmitEditing={onSend}
          returnKeyType='send'
          editable={!isCurrentUserBlocked && !isReceiverBlocked}
          selectionColor="#2ecc71"
        />
      </View>
      <View style={styles.actionsWrapper}>
        <Pressable disabled={isCurrentUserBlocked || isReceiverBlocked} onPress={onSend} style={styles.actionButton}>
          <Ionicons name="send" size={25} color={isReceiverBlocked ? 'gray' : "#2ecc71"} />
        </Pressable>
        {from && from === 'bot' ? <View /> :
          <Pressable disabled={isCurrentUserBlocked || isReceiverBlocked} onPress={handlePickMedia} style={styles.actionButton}>
            <Ionicons name="images-outline" size={23} color={isReceiverBlocked ? 'gray' : "#3B2F2F"} style={styles.rotateIcon} />
          </Pressable>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 3,
    paddingBottom: 5,
    gap: 8,
    height: 65,
    backgroundColor: 'white',
    paddingHorizontal: 10
  },
  cameraButtonWrapper: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 50,
    height: 40,
  },
  textInput: {
    height: '100%',
    borderRadius: 50,
    fontSize: 17,
    paddingLeft: 15,
  },
  actionsWrapper: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Bottom;
