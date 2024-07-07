import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import CustomLoader from './CustomLoader';
import { Image } from 'expo-image';
import processUserImage from '../../utils/processUserImage';
import { useUser } from '../../context/UserContext';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../Firebase/config';

const BottomSheetModals = ({ toggleBackSheetModal, setToggleBackSheetModal, comments, setComments, commentLoading, postUrl, postOwnerId }) => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [userComment, setUserComment] = useState('');

  const { userData } = useUser();

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    setCurrentIndex(index);
    if (index === -1) {
      setToggleBackSheetModal(prev => !prev);
    }
  }, [setToggleBackSheetModal]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const handleInputBlur = () => {
    bottomSheetModalRef.current?.snapToIndex(1);
  };

  const handleSendComment = async () => {
    if (postOwnerId) {
        try {
            console.log('Sending comment...');
            const docRef = doc(FIRESTORE_DB, 'users', postOwnerId);
            const userDoc = await getDoc(docRef);

            if (userDoc.exists()) {
                const posts = userDoc.data().posts;
                const updatedPosts = posts.map(post => {
                    if (post.url === postUrl) {
                        return {
                            ...post,
                            comments: [
                                ...post.comments,
                                {
                                    avatar: userData?.avatar,
                                    username: userData?.Username,
                                    text: userComment
                                }
                            ]
                        };
                    }
                    return post;
                });

                await updateDoc(docRef, {
                    posts: updatedPosts
                });

                console.log('Comment sent!');
                
                // Update local comments state
                setComments(prevComments => [
                    ...prevComments,
                    {
                        avatar: userData?.avatar,
                        username: userData?.Username,
                        text: userComment
                    }
                ]);

                setUserComment('');

            } else {
                console.log('No such document!');
            }

        } catch (error) {
            console.log('Failed to send comment: ' + error);
        }
    } else {
        console.log('No owner id found');
    }
}

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
    >
      <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: '600', textAlign: 'center' }}>
          {commentLoading ? '-' : !comments ? '0' : comments?.length} comments
        </Text>
      </View>
      <BottomSheetScrollView contentContainerStyle={styles.mainContentContainer}>
        <View style={styles.contentContainer}>
          {commentLoading ? 
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.5 }}>
              <CustomLoader />
            </View>
            : 
            <View style={{ flex: 1 }}>
              {comments ? comments.map((comment) => (
                <View key={comment.text} style={styles.commentContainer}>
                  <Image source={processUserImage(comment.avatar)} style={styles.avatar} />
                  <View style={styles.commentTextContainer}>
                    <Text style={styles.username}>{comment.username}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                </View>
              )) : 
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 0.5 }}>
                  <Text style={{ textAlign: 'center', color: 'gray' }}>Be the first to comment</Text>
                </View>
              }
            </View>
          }
        </View>
      </BottomSheetScrollView>
      <View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15}}>
          <View>
            <Image source={processUserImage(userData.avatar)} style={styles.avatar} />
          </View>
          <BottomSheetTextInput
          style={styles.input}
          // onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          selectionColor="#2ecc71"
          placeholder='Add comment...'
          returnKeyType='send'
          value={userComment}
          onChangeText={setUserComment}
          onSubmitEditing={handleSendComment}
        />
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  mainContentContainer: {
    paddingHorizontal: 15,
  },
  contentContainer: {
    paddingBottom: 20, 
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingVertical: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'orange',
  },
  commentTextContainer: {
    gap: 1,
  },
  username: {
    fontWeight: '500',
    fontSize: 13,
    color: 'gray',
  },
  commentText: {
    color: '#333',
  },
  input: {
    margin: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    flex: 1
  },
});

export default BottomSheetModals;
