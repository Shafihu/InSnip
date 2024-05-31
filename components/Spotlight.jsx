import { View, FlatList, Dimensions, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import {
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  MaterialIcons,
  Fontisto
} from 'react-native-vector-icons';
import Header from './Header'


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
           <View className="absolute bottom-48 right-2 h-[300px] w-[50px]  flex flex-col justify-between items-center">
              <Pressable className=" w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                  <MaterialIcons name="bookmark-add" size={36} color="white" />
              </Pressable>
              <Pressable className=" w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                  <AntDesign name="heart" size={32} color="white"  />
              </Pressable>
              <Pressable className=" w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                  <MaterialIcons name="mode-comment" size={30} color="white" />
              </Pressable>
              <Pressable className=" w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                  <Fontisto name="share-a" size={30} color="white"/>
              </Pressable>
              <Pressable className="bg-black/5 rounded-full w-[40px] h-[40px] flex justify-center items-center relative overflow-hidden">
                  <Fontisto name="more-v-a" size={22} color="white" className="transform rotate-90" />
              </Pressable>
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
    <View className="flex-1 bg-transparent rounded-t-2xl rounded-b-xl overflow-hidden relative mb-24">
          <Header header='Spotlight'/>
    <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        snapToAlignment="start"
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
    />
  </View>
  )
}

export default Spotlight

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  itemContainer: {
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});