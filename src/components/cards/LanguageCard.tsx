import {HStack, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import React, { useState } from "react";
import {useSettingsStore} from "../../store/SettingsStore";
import {GenericCard} from "./GenericCard";
import {TouchableOpacity} from "react-native";
import {LanguageModal} from "../modals/LanguageModal";
import {useTranslation} from "react-i18next";

export const LanguageCard = () => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const [modalVisible, setModalVisible] = useState(false);

  const getLanguageLabel = () => {
    if (language === 'tr') return 'Türkçe';
    if (language === 'de') return 'Deutsch';
    if (language === 'fr') return 'Français';
    if (language === 'az') return 'Azərbaycan dili';
    if (language === 'uz') return 'O\'zbek tili';
    if (language === 'hi') return 'हिंदी';
    if (language === 'ur') return 'اردو';
    if (language === 'ar') return 'العربية';
    if (language === 'es') return 'Español';
    if (language === 'ru') return 'Русский';
    return 'English';
  };

  return (
    <>
      <GenericCard style={{marginVertical: 10}}>
        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <HStack my={5} mr={5} justifyContent="space-between" alignItems="center" textAlign="center">
            <VStack mx={5} flex={1}>
              <Text color="white" fontSize="lg">{t('settings.language')}</Text>
              <Text color="gray.400" fontSize="md">{getLanguageLabel()}</Text>
            </VStack>
            <View flex={1}>
              <HStack alignItems="center" justifyContent="flex-end" space={5}>
                <Text color="white" fontSize="xl">›</Text>
              </HStack>
            </View>
          </HStack>
        </TouchableOpacity>
      </GenericCard>
      <LanguageModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
};

