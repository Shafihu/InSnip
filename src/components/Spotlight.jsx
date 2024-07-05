import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, Dimensions, SafeAreaView, RefreshControl, Text, StyleSheet } from 'react-native';
import { fetchSpotlights } from '../../utils/fetchSpotlights';
import VideoCard from '../components/VideoCard';
import Header from '../components/Header';
import CustomLoader from './CustomLoader';
import { useUser } from '../../context/UserContext';
import { storyPostUpload } from '../../utils/storyPostUpload';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const Spotlight = ({ reload }) => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [spotlightUrl, setSpotlightUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { userData } = useUser();
  const currentUserId = userData?.id;
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  const bottomSheetRef = useRef(null);

  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const fetchAndSetSpotlights = async () => {
    const spotlights = await fetchSpotlights();
    await AsyncStorage.setItem('spotlights', JSON.stringify(spotlights));
    setData(spotlights);
  };

  useEffect(() => {
    const loadSpotlights = async () => {
      try {
        setLoading(true);
        const localSpotlights = await AsyncStorage.getItem('spotlights');
        if (localSpotlights) {
          setData(JSON.parse(localSpotlights));
        } else {
          await fetchAndSetSpotlights();
        }
      } catch (error) {
        console.log('Failed to get data from async storage: ' + error);
        setError('Failed to load spotlights.');
        showErrorToast(error);
      } finally {
        setLoading(false);
      }
    };

    loadSpotlights();

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [reload]);

  const reloadSpotlights = async () => {
    try {
      setRefreshing(true);
      await fetchAndSetSpotlights();
    } catch (error) {
      console.log('Failed to reload spotlights: ' + error);
      setError('Failed to reload spotlights.');
      showErrorToast(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEndReached = () => {
    console.log('No videos available');
  };


  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const addSpotlight = async () => {
    try {
      const downloadUrl = await storyPostUpload(null, currentUserId, setUploadProgress, 'spotlight', userData);
      if(downloadUrl){
        showToast('Spotlight uploaded');
        setSpotlightUrl(downloadUrl);
      }
      return downloadUrl;
    } catch (error) {
      setError('Failed to upload spotlight');
      showErrorToast(error);
      console.log(error);
    }
  };

  const snapPoints = useMemo(() => ['75%', '100%'], []);

  const snapToIndex = (index) => bottomSheetRef.current?.snapToIndex(index);
  const handleOpenPress = () => snapToIndex(0);
  const handleClosePress = () => snapToIndex(-1);

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

  const testData = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const renderItem = ({ item, index}) => (
    <VideoCard video={item} isActive={index === activeIndex} handleOpenPress={handleOpenPress}/>
  );


  return (
    <SafeAreaView style={styles.container}>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <View style={styles.overlay}>
          <CustomLoader />
          <Text style={styles.loaderText}>{uploadProgress.toFixed(2)}%</Text>
        </View>
      )}
      <View style={{ flex: 1, backgroundColor: 'transparent', position: 'relative', }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 999 }}>
          <Header header='Spotlight' addSpotlight={addSpotlight} />
        </View>
        {(loading || refreshing) && (
          <View style={{ position: 'absolute', left: 0, right: 0, top: 50, alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <CustomLoader />
          </View>
        )}
        <FlatList
          ref={flatListRef}  // Attach the ref to FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item?.id}
          snapToAlignment="start"
          snapToInterval={SCREEN_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          pagingEnabled
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          refreshControl={
            <RefreshControl onRefresh={reloadSpotlights} refreshing={refreshing} tintColor='transparent' />
          }
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>The creator has turned off comments</Text>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Spotlight;

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999999,
  },
  loaderText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
