import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {AnimatedTabBarNavigator} from "react-native-animated-nav-tab-bar";
import Calculate from "../screen/Calculate";
import Reports from "../screen/Reports";
import Settings from "../screen/Settings";
import {ColorValue} from "react-native";
import {useTranslation} from "react-i18next";
import {Icon} from "@gluestack-ui/themed-native-base";


export function BottomTabNavigator() {
  const { t } = useTranslation();
  const Tab = AnimatedTabBarNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeBackgroundColor: '#7e22ce',
        activeTintColor: "white",
        inactiveTintColor: "white"
      }}
      appearance={{
        floating: true,
        tabBarBackground: "#111827"
      }}>
      <Tab.Screen
        name="Calculate"
        component={Calculate}
        options={{
          tabBarLabel: t('tabs.calculate'),
          tabBarIcon: (color: number | ColorValue | undefined, size: number | undefined) => (
            <Icon as={Ionicons} name="alarm-outline" size={6} color="white" />
          )
        }}
      />
      <Tab.Screen
        name="Reports"
        component={Reports}
        options={{
          tabBarLabel: t('tabs.reports'),
          tabBarIcon: (color: number | ColorValue | undefined, size: number | undefined) => (
            <Icon as={Ionicons} name="file-tray-outline" size={6} color="white" />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: t('tabs.settings'),
          tabBarIcon: (color: number | ColorValue | undefined, size: number | undefined) => (
            <Icon as={Ionicons} name="settings-outline" size={6} color="white" />
          )
        }}
      />
    </Tab.Navigator>
  );
}
