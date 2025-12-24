import React from "react";
import {GenericCard} from "../cards/GenericCard";
import {Dimensions} from "react-native";
import {Sleep} from "../../store/SleepStore";
import {LineChart, PieChart} from "react-native-chart-kit";
import {Text} from "@gluestack-ui/themed-native-base";
import {useTranslation} from "react-i18next";

const sleepColors = ["#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87", "#4c1d95", "#4527a0", "#382b7f", "#2d3a59", "#27303f", "#1e213a"]

export const SleepPieChart = ({sleeps}: {sleeps: Array<Sleep> | undefined }) => {
  const { t } = useTranslation();
  let data: { name: string; value: number; color: string; legendFontColor: string }[] | undefined = sleeps?.reduce((acc, sleep, i) => {
    if (sleep.cycle !== undefined) {
      const cycleLabel = `${sleep.cycle} ${t('charts.cycles')}`;
      const existingIndex = acc.findIndex((item) => item.name === cycleLabel);

      if (existingIndex !== -1) {
        acc[existingIndex].value += 1;
      } else {
        acc.push({
          name: cycleLabel,
          value: 1,
          color: sleepColors[i % sleepColors.length],
          legendFontColor: "white",
        });
      }
    }
    return acc;
  }, [] as { name: string; value: number; color: string; legendFontColor: string }[]);

  if (!data || data.length == 0) {
    data = [{
      name: t('charts.noSleepData'),
      value: 100,
      color: "white",
      legendFontColor: "white",
    }]
  }

  return (
    <GenericCard style={{marginVertical: 10, backgroundColor: "#360b54", marginTop: 5}}>
      <Text color="white" fontSize="md" bold textAlign="center">{t('charts.sleepCycles')}</Text>
      <PieChart
        data={data}
        accessor={"value"}
        backgroundColor={"#360b54"}
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height / 3}
        paddingLeft={"15"}
        center={[10, 0]}
        chartConfig={{
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{borderRadius: 20}}
      />
    </GenericCard>
  );
};
