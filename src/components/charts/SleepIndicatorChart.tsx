import React from "react";
import {Sleep} from "../../store/SleepStore";
import {GenericCard} from "../cards/GenericCard";
import {Divider, HStack, Text, VStack} from "@gluestack-ui/themed-native-base";
import {useTranslation} from "react-i18next";
import {formatNumber} from "../../utils/DateUtils";
import {useSettingsStore} from "../../store/SettingsStore";
import {isValidLanguage} from "../../i18n";

export const SleepIndicatorChart = ({sleeps}: { sleeps: Array<Sleep> | undefined }) => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const locale = isValidLanguage(language) ? language : 'en';

  const averageCalculator = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

  const medianCalculator = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  let data = sleeps?.map((sleep) => sleep.cycle).filter((sleep) => (sleep != undefined))
  if (!data || data.length == 0) {
    data = [0]
  }

  return (
    <GenericCard style={{marginVertical: 10, backgroundColor: "#3d0c5f", display: "flex"}}>
      <HStack my={5} mr={5} justifyContent="space-between" alignItems="center" textAlign="center"
              divider={<Divider/>}>
        <VStack mx={5} flex={1} alignItems="center">
          <Text color="white" fontSize="md" bold>{t('charts.average')}</Text>
          <Text color="gray.400" fontSize="md">{formatNumber(averageCalculator(data as number[]), locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        </VStack>
        <VStack mx={5} flex={1} alignItems="center">
          <Text color="white" fontSize="md" bold>{t('charts.median')}</Text>
          <Text color="gray.400" fontSize="md">{formatNumber(medianCalculator(data as number[]), locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        </VStack>
      </HStack>
    </GenericCard>
  );
};
