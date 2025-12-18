import React, {useEffect} from 'react';
import {NativeBaseProvider} from '@gluestack-ui/themed-native-base';
import 'react-native-gesture-handler';
import {NavigationContainer} from "@react-navigation/native";
import {StatusBar} from 'react-native';
import {MainNavigator} from "./src/router/MainNavigator";
import 'react-native-reanimated'
import * as NavigationBar from "expo-navigation-bar";
import Toast from "react-native-toast-message";
import {toastConfig} from "./src/components/config/ToastConfig";
import {initializeSettingsStore} from "./src/store/SettingsStore";

export default function App() {
  useEffect(() => {
    // Initialize settings store when app is ready
    initializeSettingsStore();
    
    StatusBar.setHidden(true);
    NavigationBar.setBackgroundColorAsync("black")
    NavigationBar.setVisibilityAsync("hidden");
  })

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <MainNavigator/>
        <Toast config={toastConfig}/>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};


