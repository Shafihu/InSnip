import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Image, Dimensions } from "react-native";

const FilterScrollView = () => {
  const itemWidth = 100; // Width of each item in the scroll view
  const [activeIndex, setActiveIndex] = useState(0);

  const filters = [
    { id: 1, image: "https://via.placeholder.com/100" },
    { id: 2, image: "https://via.placeholder.com/100" },
    { id: 3, image: "https://via.placeholder.com/100" },
    { id: 4, image: "https://via.placeholder.com/100" },
    { id: 5, image: "https://via.placeholder.com/100" },
    { id: 6, image: "https://via.placeholder.com/100" },
    { id: 7, image: "https://via.placeholder.com/100" },
    { id: 8, image: "https://via.placeholder.com/100" },
    { id: 9, image: "https://via.placeholder.com/100" },
    { id: 10, image: "https://via.placeholder.com/100" },
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(currentIndex);
  };

  return (
    <ScrollView
      horizontal={true}
      decelerationRate="fast" // Increase deceleration rate
      snapToInterval={itemWidth}
      snapToAlignment={"center"}
      showsHorizontalScrollIndicator={false}
      disableIntervalMomentum={true}
      onScroll={handleScroll}
      scrollEventThrottle={1} // Increase scroll event throttle for better responsiveness
      contentContainerStyle={styles.scrollViewContent}
      className={`max-h-[100px] absolute left-0 bottom-5 right-0`}
    >
      {filters.map((filter, index) => (
        <View
          key={filter.id}
          style={[
            styles.item,
            {
              width: itemWidth,
              height: itemWidth, // Ensure height matches width for a perfect circle
              borderRadius: itemWidth / 2, // Set border radius to half the width
              transform: [{ scale: activeIndex === index ? 0.8 : 0.6 }],
              opacity: activeIndex === index ? 1 : 0.7,
              borderWidth: activeIndex === index ? 7 : 0,
              borderColor: activeIndex === index ? "white" : "transparent", // Set border color for active item
            },
          ]}
        >
          <Image source={{ uri: filter.image }} style={styles.image} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: "center", // Center the items vertically
    paddingHorizontal: (Dimensions.get("window").width - 100) / 2, // Center the first item
  },
  item: {
    marginHorizontal: 2, // Further reduced spacing between items
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 80, // Size of the images
    height: 80,
    borderRadius: 40,
  },
});

export default FilterScrollView;
