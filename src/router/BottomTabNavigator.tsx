import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {AnimatedTabBarNavigator} from "react-native-animated-nav-tab-bar";
import Calculate from "../screen/Calculate";
import Reports from "../screen/Reports";
import Settings from "../screen/Settings";
import { ColorValue } from "react-native";


export function BottomTabNavigator() {
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
          tabBarIcon: (color: number | ColorValue | undefined, size: number | undefined) => (
            <Ionicons
              name="alarm-outline"
              size={size ? size : 24}
              color="white"
            />
          )
        }}
      />
      <Tab.Screen
        name="Reports"
        component={Reports}
        options={{
          tabBarIcon: (color: number | ColorValue | undefined, size: number | undefined)  => (<Ionicons
              name="file-tray-outline"
              size={size ? size : 24}
              color="white"
            />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: (color: number | ColorValue | undefined, size: number | undefined)  => (
            <Ionicons
              name="settings-outline"
              size={size ? size : 24}
              color="white"
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}
