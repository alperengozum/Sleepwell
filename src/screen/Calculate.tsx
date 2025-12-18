import React, {useEffect} from "react";
import CalculatorHeader from "../components/headers/CalculatorHeader";
import {CalculatorList} from "../components/lists/CalculatorList";
import {useNavigation} from "@react-navigation/native";
import * as NavigationBar from 'expo-navigation-bar';
import {useSettingsStore} from "../store/SettingsStore";
import {SettingsType} from "../store/SettingsStore";


export default function Calculate() {

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      NavigationBar.setVisibilityAsync('hidden');
    });
    return unsubscribe;
  }, [navigation])

  useEffect(() => {
    const checkSettings = async () => {
      let loading = useSettingsStore.getState().loading;
      const getSettings = useSettingsStore.getState().getSettings;
      
      while (loading) {
        // wait until SettingsStore is loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        loading = useSettingsStore.getState().loading;
      }
      const settings = getSettings(SettingsType.WELCOME);
      if (!(settings && settings[0].value === false)) {
        // @ts-ignore
        navigation.navigate("Welcome");
      }
    }
    checkSettings();
  }, []);

  return (
    <CalculatorHeader>
      <CalculatorList/>
    </CalculatorHeader>
  );
}
