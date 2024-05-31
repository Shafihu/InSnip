import React, { useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Pressable, Text } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  MaterialIcons,
  Fontisto,
} from 'react-native-vector-icons';
import Header from './Header';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const INITIAL_DATA = [
  { id: '1', color: '#FF0000' },
  { id: '2', color: '#00FF00' },
  { id: '3', color: '#0000FF' },
  { id: '4', color: '#FFFF00' },
  { id: '5', color: '#FF00FF' },
  { id: '6', color: '#00FFFF' },
];

const renderItem = ({ item }) => (
  <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
    <View className="absolute bottom-16 right-2 mr-1 flex flex-col gap-6 justify-between items-center">
      <Pressable className="w-[40px] flex justify-center items-center relative overflow-hidden mb-2">
        <MaterialIcons name="bookmark-add" size={36} color="white" />
      </Pressable>
      <Pressable className="w-[40px] flex justify-center items-center relative overflow-hidden mb-2">
        <AntDesign name="heart" size={32} color="white" />
      </Pressable>
      <Pressable className="w-[40px] flex justify-center items-center relative overflow-hidden gap-2">
        <MaterialIcons name="mode-comment" size={30} color="white" />
        <Text className="text-white font-semibold text-[12px] tracking-wider">80</Text>
      </Pressable>
      <Pressable className="w-[40px] flex justify-center items-center relative overflow-hidden gap-2">
        <Fontisto name="share-a" size={30} color="white" />
        <Text className="text-white font-semibold text-[12px] tracking-wider">135</Text>
      </Pressable>
      <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
        <Fontisto name="more-v-a" size={22} color="white" className="transform rotate-90" />
      </Pressable>
    </View>
    <View className="absolute left-2 bottom-16 w-1/2 py-2 flex flex-col justify-center">
      <View className="flex flex-row items-center gap-2">
        <View className="w-[30px] h-[30px] bg-green-500 rounded-full"></View>
        <Text className="text-white font-bold text-[18px] tracking-wide">Maron Logan</Text>
      </View>
    </View>
  </View>
);

const Spotlight = () => {
  const [data, setData] = useState(INITIAL_DATA);

  const handleEndReached = () => {
    const moreData = INITIAL_DATA.map((item, index) => ({
      ...item,
      id: `${item.id}-${Date.now()}-${index}`,
    }));
    setData([...data, ...moreData]);
  };

  return (
    <View className="flex-1  bg-transparent rounded-t-2xl rounded-b-xl overflow-hidden relative mb-24">
      <Header header='Spotlight' />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        snapToAlignment="start"
        snapToInterval={SCREEN_HEIGHT - 112}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default Spotlight;

const styles = StyleSheet.create({
  itemContainer: {
    height: SCREEN_HEIGHT - 112, // 7rem ≈ 112dp
    justifyContent: 'center',
    alignItems: 'center',
  },
});