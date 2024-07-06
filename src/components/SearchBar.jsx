import React, { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { Foundation } from 'react-native-vector-icons';
import { router } from 'expo-router';

const SearchBar = ({ onChangeText, onActualChange, color }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onChangeText(searchText);
  };

  const handleChangeText = (text) => {
    setSearchText(text);
    onActualChange(text); // Correctly passing the updated text
  };

  return (
    <View style={{ backgroundColor: color, width: '100%', paddingVertical: 10, paddingHorizontal: 15, gap: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
      <View style={{ position: 'relative', width: '80%', borderRadius: '100%', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,.05)' }}  >
        <Foundation name="magnifying-glass" size={20} color='#555c57' style={{ position: 'absolute', left: 15, top: '50%', zIndex: 999, transform: [{ translateY: -10 }, { scaleX: -1 }] }} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#555c57"
          value={searchText}
          onChangeText={handleChangeText}
          // onSubmitEditing={handleSearch}
          returnKeyType='search'
          style={{ paddingVertical: 10, paddingLeft: 40, paddingRight: 15, borderRadius: 100, fontSize: 15, fontWeight: '500', color: '#555c57' }}
        />
      </View>
      <Pressable onPress={() => router.back()} style={{ width: '20%' }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Cancel</Text>
      </Pressable>
    </View>
  );
};

export default SearchBar;
