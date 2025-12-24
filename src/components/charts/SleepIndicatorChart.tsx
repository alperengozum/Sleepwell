import React from "react";
import {Sleep} from "../../store/SleepStore";
import {GenericCard} from "../cards/GenericCard";
import {Divider, HStack, Text, VStack} from "@gluestack-ui/themed-native-base";
import {useTranslation} from "react-i18next";

export const SleepIndicatorChart = ({sleeps}: { sleeps: Array<Sleep> | undefined }) => {
  const { t } = useTranslation();

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
          <Text color="gray.400" fontSize="md">{averageCalculator(data as number[]).toFixed(2)}</Text>
        </VStack>
        <VStack mx={5} flex={1} alignItems="center">
          <Text color="white" fontSize="md" bold>{t('charts.median')}</Text>
          <Text color="gray.400" fontSize="md">{medianCalculator(data as number[]).toFixed(2)}</Text>
        </VStack>
      </HStack>
    </GenericCard>
  );
};
