import { View, ScrollView, Text, StyleSheet, } from 'react-native'
import {useState, useEffect} from 'react'
import {
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Header from './Header'
import getUserStories from '../utils/getUserStories';

const Stories = () => {
  const [userStories, setUserStories] = useState([])

  useEffect(()=>{
    const fetchStories = async () => {
      const res = await getUserStories();
      setUserStories(res)
    }
    fetchStories();
  },[])


  return (
    <View className="flex-1 bg-[#faf9f6]">
      <Header header='Stories' />
      <View className="ml-2">
        <Text className="text-[16px] font-medium">Friends</Text>  
        <ScrollView className='h-fit w-full py-2' horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex flex-col item-center justify-center gap-2 mr-3">
          <View className="w-[70px] h-[70px] rounded-full bg-white border-2 border-purple-500 relative">
            <View className="bg-purple-500 w-[45px] h-[25px] rounded-full absolute -bottom-2 left-[15%] flex items-center justify-center">
                <MaterialCommunityIcons
                    name="account-plus"
                    size={18}
                    color="white"
                />
            </View>
          </View>
          <View className="flex flex-col items-center justify-center">
            <Text className="font-medium">Felix</Text>
            <Text className="text-[11px] text-gray-400">felix273628</Text>
          </View>
          </View>
          <View className="flex flex-col item-center justify-center gap-2 mr-3">
          <View className="w-[70px] h-[70px] rounded-full bg-white border-2 border-purple-500 relative">
            <View className="bg-purple-500 w-[45px] h-[20px] rounded-full absolute -bottom-2 left-[15%] flex items-center justify-center">
                <MaterialCommunityIcons
                    name="account-plus"
                    size={15}
                    color="white"
                />
            </View>
          </View>
          <View className="flex flex-col items-center justify-center">
            <Text className="font-medium">Felix</Text>
            <Text className="text-[11px] text-gray-400">felix273628</Text>
          </View>
          </View>

          <View className="flex flex-col item-center justify-center gap-2 mr-3">
          <View className="w-[70px] h-[70px] rounded-full bg-white border-2 border-purple-500 relative">
            <View className="bg-purple-500 w-[45px] h-[20px] rounded-full absolute -bottom-2 left-[15%] flex items-center justify-center">
                <MaterialCommunityIcons
                    name="account-plus"
                    size={15}
                    color="white"
                />
            </View>
          </View>
          <View className="flex flex-col items-center justify-center">
            <Text className="font-medium">Felix</Text>
            <Text className="text-[11px] text-gray-400">felix273628</Text>
          </View>
          </View>
          <View className="flex flex-col item-center justify-center gap-2 mr-3">
          <View className="w-[70px] h-[70px] rounded-full bg-white border-2 border-purple-500 relative">
            <View className="bg-purple-500 w-[45px] h-[20px] rounded-full absolute -bottom-2 left-[15%] flex items-center justify-center">
                <MaterialCommunityIcons
                    name="account-plus"
                    size={15}
                    color="white"
                />
            </View>
          </View>
          <View className="flex flex-col items-center justify-center">
            <Text className="font-medium">Felix</Text>
            <Text className="text-[11px] text-gray-400">felix273628</Text>
          </View>
          </View>
          <View className="flex flex-col item-center justify-center gap-2 mr-3">
          <View className="w-[70px] h-[70px] rounded-full bg-white border-2 border-purple-500 relative">
            <View className="bg-purple-500 w-[45px] h-[20px] rounded-full absolute -bottom-2 left-[15%] flex items-center justify-center">
                <MaterialCommunityIcons
                    name="account-plus"
                    size={15}
                    color="white"
                />
            </View>
          </View>
          <View className="flex flex-col items-center justify-center">
            <Text className="font-medium">Felix</Text>
            <Text className="text-[11px] text-gray-400">felix273628</Text>
          </View>
          </View>
          <View className="flex flex-col item-center justify-center gap-2 mr-3">
          <View className="w-[70px] h-[70px] rounded-full bg-white border-2 border-purple-500 relative">
            <View className="bg-purple-500 w-[45px] h-[20px] rounded-full absolute -bottom-2 left-[15%] flex items-center justify-center">
                <MaterialCommunityIcons
                    name="account-plus"
                    size={15}
                    color="white"
                />
            </View>
          </View>
          <View className="flex flex-col items-center justify-center">
            <Text className="font-medium">Felix</Text>
            <Text className="text-[11px] text-gray-400">felix273628</Text>
          </View>
          </View>
        </ScrollView>  
      </View>

      <View className="mx-2">
        <Text className="text-[16px] font-medium mb-2">Discover</Text>  

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {userStories && userStories.length > 0 ? (
              userStories.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                   <View></View>
                </View>
              ))
            ) : (
              <Text>No data available!</Text>
            )}
          </ScrollView>
      </View>
    </View>
  )
}

export default Stories

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    paddingBottom: 350
  },
  itemContainer: {
    width: '49%',
    minHeight: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8, 
  },
});
