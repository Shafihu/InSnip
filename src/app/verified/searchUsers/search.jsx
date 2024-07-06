import { View, Text, Pressable, Image, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../../components/SearchBar';
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
        setShuffledFilteredUsers(shuffleArray(filteredList));
    };

    const renderItem = ({ item }) => (
        <Pressable 
            onPress={() => handleUserProfile(item)} 
            style={[styles.pressable, styles.shadow, styles.flexRow, styles.alignCenter, styles.justifyBetween, styles.gap4, styles.bgWhite, styles.py2, styles.px3, styles.pr5]}
        >
            <View style={[styles.avatarContainer]}>
                <Image source={processUserImage(item.avatar)} style={{ width: '100%', height: '100%' }} />
            </View>
            <View style={[styles.flex1, styles.gap1]}>
                <Text style={[styles.fontMedium, styles.textMedium, styles.trackingWider, styles.capitalize, {color: '#333333'}]}>{item.FirstName} {item.LastName}</Text>
                <View style={[styles.flexRow, styles.alignCenter, styles.gap2]}>
                    <Text style={[styles.text11, styles.fontSemibold, {color: '#7f8c8d'}]}>{item.Username}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <SearchBar onActualChange={onActualChange} color='white'/>
            <View style={{ paddingVertical: 0, backgroundColor: '#fff', }}>
                <View style={{ marginVertical: 15, marginHorizontal: 15 }}>
                    <Text style={[styles.fontSemibold, styles.trackingWider, styles.text16, {color: '#3B2F2F'}]}>Results</Text>
                </View>
                <View style={[styles.shadow, {backgroundColor: '#fff', padding: 0, borderRadius: 0, overflow:'hidden'}]}>
                    <FlatList
                        data={shuffledFilteredUsers}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 10, gap: 0, paddingVertical: 10}}
                    />
                </View>
                <View style={{ marginVertical: 15, marginHorizontal: 15 }}>
                    <Text style={[styles.fontSemibold, styles.trackingWider, styles.text16, {color: '#3B2F2F'}]}>People you may know</Text>
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
    flexRow: {
        flexDirection: 'row',
    },
    alignCenter: {
        alignItems: 'center',
    },
    justifyBetween: {
        justifyContent: 'space-between',
    },
    gap4: {
        gap: 16, // 4 * 4 (assuming 1 unit is 4px)
    },
    bgWhite: {
        backgroundColor: 'white',
    },
    py2: {
        paddingVertical: 8, // 2 * 4 (assuming 1 unit is 4px)
    },
    px3: {
        paddingHorizontal: 12, // 3 * 4 (assuming 1 unit is 4px)
    },
    pr5: {
        paddingRight: 20, // 5 * 4 (assuming 1 unit is 4px)
    },
    avatarContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        overflow: 'hidden',
    },
    flex1: {
        flex: 1,
    },
    gap1: {
        gap: 4, // 1 * 4 (assuming 1 unit is 4px)
    },
    fontMedium: {
        fontWeight: '500',
    },
    textMedium: {
        fontSize: 16, // equivalent to medium text size
    },
    trackingWider: {
        letterSpacing: 1.25, // example for wider tracking
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    flexRow: {
        flexDirection: 'row',
    },
    alignCenter: {
        alignItems: 'center',
    },
    gap2: {
        gap: 8, // 2 * 4 (assuming 1 unit is 4px)
    },
    text11: {
        fontSize: 11,
    },
    fontSemibold: {
        fontWeight: '600',
    },
    fontSemibold: {
        fontWeight: '600',
    },
    text16: {
        fontSize: 16,
    },
});

export default Search;
