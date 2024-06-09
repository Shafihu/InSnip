import { View, Text, Pressable, Image, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import SearchBar from '../../../components/SearchBar';
import { MaterialIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const Search = () => {
    const navigation = useNavigation();

    const handleSearchQuery = (text) => {
        console.log(text);
    }

    const handleChatRoomPress = () => {
        router.back()
        setTimeout(() => {
            navigation.navigate('chatRoom'); 
        }, 0); 
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <SearchBar onChangeText={handleSearchQuery} color='white'/>
            <View style={{ paddingHorizontal: 15, backgroundColor: '#f5f5f5' }}>
                <View style={{ marginVertical: 15 }}>
                    <Text className="font-semibold tracking-wider text-[16px]">Friends & Groups</Text>
                </View>
                <Pressable 
                    onPress={handleChatRoomPress} 
                    style={[styles.pressable, styles.shadow]}
                    className="flex flex-row items-center justify-between gap-4 bg-white py-2 px-3 pr-5 rounded-xl"
                >
                    <View className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden">
                        <Image source={require('../../../../assets/avatars/user.png')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View className="flex-1 gap-1">
                        <Text className="font-medium text-medium tracking-wider capitalize">John</Text>
                        <View className="flex flex-row items-center gap-2">
                            <MaterialIcons name="chat-bubble-outline" size={12} color="gray" className="transform scale-x-[-1]" />
                            <Text className="text-[11px] font-semibold text-gray-500">john128372</Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 15, // Adjust this to match your rounded corners
        backgroundColor: 'white', // Ensure the background color is set to white
    },
    shadow: {
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.15, // Shadow opacity
        shadowRadius: 10, // Shadow radius
        elevation: 5, // Elevation for Android
    },
});

export default Search;
