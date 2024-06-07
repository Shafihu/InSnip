import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesome6 } from "react-native-vector-icons";

const index = () => {
  return(
    <>
    <View style={styles.mainContainer}>
      <View style={styles.innerMainContainer}>
        <View style={styles.headerCover}>
          <Pressable style={styles.btnIcon}>
            <FontAwesome6 name="chevron-left" color="black" size={20} />
          </Pressable>
          <Pressable style={styles.btnSkip}>
            <Text style={styles.headerText}>Skip</Text>
          </Pressable>
        </View>

    <View style={styles.box}>
      <View style={styles.innerBox}>
        <Text style={styles.boxText}>Pass</Text>
      </View>
    </View>

    <View style={styles.textContainer}>
      <Text style={styles.textOne}>
        We'd like you to share optional diagnostic data about how you use Starchat. This information helps us improve your Starchat experience.
      </Text>

      <Text style={styles.textTwo}>
        None of this data includes your name, file contents, or information about apps unrelated to
        OfficeComms
      </Text>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>Learn more</Text>
      </Pressable>
    </View>

    <View style={styles.btnContainer}>
    <Pressable style={styles.btnOne}>
        <Text style={styles.btnText}>Accept</Text>
      </Pressable>

      <Pressable style={styles.btnTwo}>
        <Text style={styles.btnText}>Decline</Text>
      </Pressable>
    </View>
    </View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  innerMainContainer: {
    marginLeft: 14,
    marginRight: 14,
  },
  headerCover: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 70,
  },
  btnIcon: {
    // marginRight: 240,
  },
  headerText: {
    fontSize: 16,
  }, 
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    marginBottom: 50,
  },
  innerBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "orangered",
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    fontSize: 16,
    color: "white",
  },
  textContainer: {
    marginBottom: 210,
  },
  textOne: {
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 20,
  },
  textTwo: {
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 10,
  },
  linkText: {
    textAlign: "center",
    color: "blue",
    // fontWeight: 10,
    // textDecoration: "underline" Underline here
  },
  btnOne: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btnTwo: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold"
  },
})
export default index;
