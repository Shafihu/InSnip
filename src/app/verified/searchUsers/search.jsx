import { View, Text, Pressable, Image, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import { MaterialIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { FIRESTORE_DB } from '../../../../Firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import processUserImage from '../../../../utils/processUserImage';
import { useUser } from '../../../../context/UserContext';

const Search = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [shuffledFilteredUsers, setShuffledFilteredUsers] = useState([]);
    const [shuffledUsers, setShuffledUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const { userData } = useUser();
    const currentUserId = userData.id;

    const shuffleArray = (array) => {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleSearchQuery = (text) => {
        console.log(text);
    };

    const handleUserProfile = (user) => {
        router.push({
            pathname: '/verified/profile/[otherUserProfile]',
            params: {
                id: user.id,
                firstname: user.FirstName,
                lastname: user.LastName,
                username: user.Username,
                avatar: user.avatar,
                user: user,
            }
        });
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                let usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(user => user.id !== currentUserId);
                setUsers(usersList);
                setFilteredUsers(usersList);

                // Shuffle users and filtered users separately
                setShuffledUsers(shuffleArray(usersList));
                setShuffledFilteredUsers(shuffleArray(usersList));
            } catch (error) {
                console.error('Error fetching users: ', error);
            }
        };

        fetchUsers();
    }, [currentUserId]);

    const onActualChange = (text) => {
        setSearchText(text);
        const filteredList = users.filter(user => user.FirstName.toLowerCase().includes(text.toLowerCase()));
        setFilteredUsers(filteredList);
        setShuffledFilteredUsers(shuffleArray(filteredList)); // Shuffle filtered users
    };

    const renderItem = ({ item }) => (
        <Pressable 
            onPress={() => handleUserProfile(item)} 
            style={[styles.pressable, styles.shadow]}
            className="flex flex-row items-center justify-between gap-4 bg-white py-2 px-3 pr-5"
        >
            <View className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden">
                <Image source={processUserImage(item.avatar)} style={{ width: '100%', height: '100%' }} />
            </View>
            <View className="flex-1 gap-1">
                <Text className="font-medium text-medium tracking-wider capitalize" style={{color: '#3B2F2F'}}>{item.FirstName} {item.LastName}</Text>
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-[11px] font-semibold text-gray-500">{item.Username}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <SearchBar onActualChange={onActualChange} color='white'/>
            <View style={{ paddingVertical: 0, backgroundColor: '#fff', }}>
                <View style={{ marginVertical: 15, marginHorizontal: 15 }}>
                    <Text className="font-semibold tracking-wider text-[16px] " style={{color: '#3B2F2F'}}>Results</Text>
                </View>
                <View style={[styles.shadow,{backgroundColor: '#fff',  padding: 0,  borderRadius: 0, overflow:'hidden', }]}>
                    <FlatList
                        data={shuffledFilteredUsers}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 10, gap: 0, paddingVertical: 10}}
                    />
                </View>
                <View style={{ marginVertical: 15, marginHorizontal: 15 }}>
                    <Text className="font-semibold tracking-wider text-[16px] " style={{color: '#3B2F2F'}}>People you may know</Text>
                </View>
                <FlatList
                    data={shuffledUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 15, gap: 0, paddingVertical: 10 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pressable: {
        // borderRadius: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)'  
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
});

export default Search;
