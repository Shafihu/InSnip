import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { Entypo } from 'react-native-vector-icons';
import Header from './Header';
import ChatItem from './Chat/ChatItem';

const Chat = () => {
  const circleSize = 60;
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header header="Chat" />
      <View style={styles.content}>
        <View style={styles.newMessageButton}>
          <Entypo name="new-message" size={25} color="white" />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.archiveContainer}>
            <View style={styles.archiveIcon}>
              <Entypo name="archive" size={30} color="black" />
            </View>
            <View style={styles.archiveTextContainer}>
              <Text style={styles.archiveText}>Archived</Text>
            </View>
            <View style={styles.newIndicator}>
              <Text style={styles.newText}>New</Text>
              <Entypo name="new" size={25} color="#FFD700" />
            </View>
          </View>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <ChatItem />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    backgroundColor: 'rgb(243, 244, 246)',
  },
  newMessageButton: {
    backgroundColor: '#00BFFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 90,
    right: 15,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 99,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  archiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    backgroundColor: 'white',
    padding: 12,
    margin: 8,
    borderRadius: 24,
  },
  archiveIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'yellow',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveTextContainer: {
    flex: 1,
  },
  archiveText: {
    fontSize: 18,
    fontWeight: '500',
  },
  newIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
});

export default Chat;
