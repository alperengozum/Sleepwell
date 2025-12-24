import React, {useEffect, useState} from 'react';
import {NativeBaseProvider, View, Text} from '@gluestack-ui/themed-native-base';
import 'react-native-gesture-handler';
import {NavigationContainer} from "@react-navigation/native";
import {StatusBar} from 'react-native';
import {MainNavigator} from "./src/router/MainNavigator";
import 'react-native-reanimated'
import * as NavigationBar from "expo-navigation-bar";
import Toast from "react-native-toast-message";
import {toastConfig} from "./src/components/config/ToastConfig";
import {initializeSettingsStore} from "./src/store/SettingsStore";
import {initializeSleepStore} from "./src/store/SleepStore";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {initializeI18n} from "./src/i18n";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize i18n first to ensure proper language setup
        await initializeI18n();
        
        // Initialize stores when app is ready - wait for completion
        await initializeSettingsStore();
        await initializeSleepStore();
        
        setIsInitialized(true);
        
        StatusBar.setHidden(true);
        NavigationBar.setBackgroundColorAsync("black");
        NavigationBar.setVisibilityAsync("hidden");
      } catch (error) {
        // Log error for debugging
        console.error('Failed to initialize app:', error);
        
        // Set error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
        setInitializationError(errorMessage);
        
        // Still set initialized to true to prevent infinite blank screen
        // The app will render with error state instead
        setIsInitialized(true);
        
        // Try to set UI elements even on error
        try {
          StatusBar.setHidden(true);
          NavigationBar.setBackgroundColorAsync("black");
          NavigationBar.setVisibilityAsync("hidden");
        } catch (uiError) {
          console.error('Failed to set UI elements:', uiError);
        }
      }
    };
    
    initApp();
  }, []);

  // Show nothing until initialization is complete
  if (!isInitialized) {
    return null;
  }

  // Show error state if initialization failed
  if (initializationError) {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider>
          <View flex={1} justifyContent="center" alignItems="center" bg="black" p={20}>
            <Text color="white" fontSize={18} mb={10} textAlign="center">
              Initialization Error
            </Text>
            <Text color="gray.400" fontSize={14} textAlign="center" mb={20}>
              {initializationError}
            </Text>
            <Text color="gray.500" fontSize={12} textAlign="center">
              Please restart the app. If the problem persists, check the console logs.
            </Text>
          </View>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
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


