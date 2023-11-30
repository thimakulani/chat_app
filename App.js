import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from "./src/screens/HomeScreen";
import AppNavigation from "./src/navigation/AppNavigation";
import {NavigationContainer} from "@react-navigation/native";


export default function App() {
  return (
        <AppNavigation  />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
