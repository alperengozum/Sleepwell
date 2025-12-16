import {HStack, Icon, IconButton, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SettingsStore, {SettingsType} from "../../store/SettingsStore";
import {GenericCard} from "./GenericCard";
import {Observer} from "mobx-react";

export const FallAsleepCard = () => {

  const onAddPress = () => {
    const value = (SettingsStore.getSettings(SettingsType.FALL_ASLEEP)![0].value as number || 0) + 5;
    SettingsStore.editSetting(SettingsType.FALL_ASLEEP, value);
  }
  const onMinusPress = () => {
    let value = (SettingsStore.getSettings(SettingsType.FALL_ASLEEP)![0].value as number || 0) - 5;
    if (value < 0) value = 0;
    SettingsStore.editSetting(SettingsType.FALL_ASLEEP, value);
  }


  return (
    <Observer>
      {() => {
        const currentValue = SettingsStore.getSettings(SettingsType.FALL_ASLEEP)?.[0]?.value as number || 0;
        return (
          <GenericCard style={{marginVertical: 10}}>
            <HStack my={5} mr={5} justifyContent="space-between" alignItems="center" textAlign="center">
              <VStack mx={5} flex={1}>
                <Text color="white" fontSize="lg">{SettingsType.FALL_ASLEEP + " Time"}</Text>
                <Text color="gray.400" fontSize="md">How many minutes does it take to fall asleep?</Text>
              </VStack>
              <View flex={1}>
                <HStack alignItems="center" justifyContent="flex-end" space={5}>
                  <IconButton
                    colorScheme="dark"
                    borderRadius="15"
                    variant="subtle"
                    icon={<Icon as={Ionicons} name="remove-outline" size={8}/>}
                    onPress={onMinusPress}
                  />
                  <Text color="white"
                        fontSize="xl">{currentValue}</Text>
                  <IconButton
                    colorScheme="dark"
                    borderRadius="15"
                    variant="subtle"
                    icon={<Icon as={Ionicons} name="add-outline" size={8}/>}
                    onPress={onAddPress}
                  />
                </HStack>
              </View>
            </HStack>
          </GenericCard>
        );
      }}
    </Observer>
  );
};
