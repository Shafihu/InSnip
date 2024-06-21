import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { fetchSpotlights } from '../../utils/fetchSpotlights';
import VideoCard from '../components/VideoCard';
import Header from '../components/Header';
import CustomLoader from './CustomLoader';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const Spotlight = () => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadSpotlights = async () => {
      setLoading(true);
      console.log('fetching...');
      const spotlights = await fetchSpotlights();
      setLoading(false);
      setData(spotlights);
    };

    loadSpotlights();
  }, []);

  const reloadSpotlights = async () => {
    try {
      setRefreshing(true);
      console.log('fetching...');
      const spotlights = await fetchSpotlights();
      setData(spotlights);
    } catch (error) {
      console.log('Failed to reload spotlights: ' + error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEndReached = () => {
    console.log('No videos available');
  };

  const renderItem = ({ item, index }) => (
    <VideoCard video={item} isActive={index === activeIndex} />
  );

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'transparent', position: 'relative' }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 999 }}>
          <Header header='Spotlight' />
        </View>
        {(loading || refreshing) && (
          <View style={{ position: 'absolute', left: 0, right: 0, top: 50, alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <CustomLoader />
          </View>
        )}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
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
    </SafeAreaView>
  );
};

export default Spotlight;
