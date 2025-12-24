import {HStack, Icon, IconButton, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useSettingsStore} from "../../store/SettingsStore";
import {SettingsType} from "../../store/SettingsStore";
import {GenericCard} from "./GenericCard";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {useTranslation} from "react-i18next";

export const WelcomeCard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onShowPress = () => {
    useSettingsStore.getState().editSetting(SettingsType.WELCOME, true);
    //@ts-ignore
    navigation.navigate("Welcome")
  }

  return (
    <GenericCard style={{marginVertical: 10}}>
      <HStack my={5} mr={5} justifyContent="space-between" alignItems="center" textAlign="center">
        <VStack mx={5} flex={1}>
          <Text color="white" fontSize="md">{t('settings.showWelcomeSlide')}</Text>
        </VStack>
        <View flex={1}>
          <HStack alignItems="center" justifyContent="flex-end" space={5}>
            <TouchableOpacity
              style={{
                backgroundColor: "#6B21A8",
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "#6B21A8",
                padding: 8,
                alignItems: "center",
                justifyContent: "center"
              }}
              activeOpacity={0.7}
              onPress={onShowPress}
            >
              <Icon as={Ionicons} name="caret-forward-outline" size={8} color="white"/>
            </TouchableOpacity>
          </HStack>
        </View>
      </HStack>
    </GenericCard>
  );
};
