import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import CustomLoader from './CustomLoader';
import { Image } from 'expo-image';
import processUserImage from '../../utils/processUserImage';

const BottomSheetModals = ({ toggleBackSheetModal, setToggleBackSheetModal , comments, commentLoading}) => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  useEffect (() => {
    bottomSheetModalRef.current?.present();
  }, [])

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
        setToggleBackSheetModal(prev => !prev);
    }
  }, []);

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

  return (
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
        >
        <View style={{padding: 10, justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{fontWeight: '600', textAlign: 'center'}}>Comments {commentLoading ? '-' : !comments ? '0' : comments?.length}</Text>
        </View>
        <BottomSheetScrollView contentContainerStyle={styles.mainContentContainer}>
        <BottomSheetView style={styles.contentContainer}>
          {commentLoading ? 
            <View style={{justifyContent: 'center', alignItems: 'center', flex: .5}}>
              <CustomLoader />
            </View>
             : 
            <View style={{ flex: 1 }}>
              {comments ? comments.map((comment) => (
                <View key={comment.username} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 8, paddingVertical: 15}}>
                    <Image source={processUserImage(comment.avatar)} style={{width: 35, height: 35, borderRadius: 17.5, backgroundColor: 'orange'}} />
                    <View style={{gap: 1}}>
                      <Text style={{fontWeight: '500', fontSize: 13, color: 'gray'}}>{comment.username}</Text>
                      <Text style={{color: '#333'}}>{comment.text}</Text>
                    </View>
                </View>
              )) : 
                <View style={{alignItems: 'center', justifyContent: 'center', flex: .5}}>
                  <Text style={{textAlign: 'center', color: 'gray'}}>Be the first to comment</Text>
                </View>
              }
            </View>
          }
        </BottomSheetView>
        </BottomSheetScrollView>
        <BottomSheetTextInput style={styles.input} />
        </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
    mainContentContainer: {
        flex: 1,
        paddingHorizontal: 15
      },
      contentContainer: {
        flex: 1,
      },
      input: {
        margin: 8,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: 'rgba(151, 151, 151, 0.25)',
      },
});

export default BottomSheetModals;