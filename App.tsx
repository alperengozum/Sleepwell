import React, {useEffect, useState} from 'react';
import {NativeBaseProvider} from '@gluestack-ui/themed-native-base';
import 'react-native-gesture-handler';
import {NavigationContainer} from "@react-navigation/native";
import {StatusBar} from 'react-native';
import {MainNavigator} from "./src/router/MainNavigator";
import 'react-native-reanimated'
import * as NavigationBar from "expo-navigation-bar";
import Toast from "react-native-toast-message";
import {toastConfig} from "./src/components/config/ToastConfig";
import {initializeSettingsStore, useSettingsStore} from "./src/store/SettingsStore";
import {initializeSleepStore} from "./src/store/SleepStore";
import {SafeAreaProvider} from "react-native-safe-area-context";
import './src/i18n';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // Initialize stores when app is ready - wait for completion
      await initializeSettingsStore();
      await initializeSleepStore();
      
      setIsInitialized(true);
      
      StatusBar.setHidden(true);
      NavigationBar.setBackgroundColorAsync("black");
      NavigationBar.setVisibilityAsync("hidden");
    };
    
    initApp();
  }, []);

  // Show nothing until initialization is complete
  if (!isInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <MainNavigator/>
          <Toast config={toastConfig}/>
        </NavigationContainer>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};


