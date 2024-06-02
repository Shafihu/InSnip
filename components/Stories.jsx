import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Header from './Header';
import getUserStories from '../utils/getUserStories';

const Stories = () => {
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      const res = await getUserStories();
      setUserStories(res);
      setLoading(false);
    };
    fetchStories();
  }, []);

  return (
    <View className="flex-1">
      <Header header='Stories' />
      {loading ? (
        <View className="">
          <ActivityIndicator color='gray' size='small' />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="ml-2">
              <Text className="text-[16px] font-medium">Friends</Text>
              <ScrollView className='h-fit w-full py-2' horizontal showsHorizontalScrollIndicator={false}>
                {userStories && userStories.length > 0 ? (
                  userStories.map((item, index) => (
                    <View key={index} className="flex flex-col item-center justify-center gap-3 mr-3 w-[80px]">
                      <View className="w-[80px] h-[80px] rounded-full bg-white border-2 border-purple-500 relative">
                        <View className="bg-purple-500 w-[50px] h-[23px] rounded-full absolute -bottom-3 left-[50%] flex items-center justify-center overflow-hidden z-50" style={{ transform: [{ translateX: -25 }] }}>
                          <MaterialCommunityIcons
                            name="account-plus"
                            size={18}
                            color="white"
                          />
                        </View>
                        <View className=" w-full h-full bg-gray-100 rounded-full border-2 border-white">
                          <Image source={item.avatar !== '' ? item.avatar : require('../assets/avatars/user.png')} className="w-full h-full rounded-full" />
                        </View>
                      </View>
                      <View className="flex flex-col items-center justify-center">
                        <Text className="font-medium text-center" numberOfLines={1} ellipsizeMode='tail'>{item.nickName}</Text>
                        <Text className="text-[11px] text-gray-400 text-center">{item.userName}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text>No data available!</Text>
                )}
              </ScrollView>
            </View>

            <View className="mx-2">
              <Text className="text-[16px] font-medium mb-2">Discover</Text>

              <View style={styles.scrollContainer}>
                {userStories && userStories.length > 0 ? (
                  userStories.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <LinearGradient colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.3)']} style={styles.background}>
                        <Text className="text-white text-[18px] font-bold">{item.nickName}</Text>
                      </LinearGradient>
                    </View>
                  ))
                ) : (
                  <Text>No data available!</Text>
                )}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  itemContainer: {
    width: '49%',
    minHeight: 300,
    backgroundColor: 'yellow',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
