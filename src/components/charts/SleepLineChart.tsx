import React from "react";
import {GenericCard} from "../cards/GenericCard";
import {Dimensions} from "react-native";
import {Sleep} from "../../store/SleepStore";
import {LineChart} from "react-native-chart-kit";
import {Text} from "@gluestack-ui/themed-native-base";
import {useTranslation} from "react-i18next";

export const SleepLineChart = ({sleeps}: {sleeps: Array<Sleep> | undefined }) => {
  const { t } = useTranslation();
  let data = sleeps?.map((sleep) => sleep.cycle).filter((sleep) => (sleep != undefined))
  if (!data || data.length == 0) {
    data = [0]
  }

  return (
    <GenericCard style={{marginVertical: 10, backgroundColor: "#440e6a", marginTop: 5}}>
      <Text color="white" fontSize="md" bold textAlign="center">{t('charts.sleepCycles')}</Text>
      <LineChart
        data={{datasets: [{data: data as number[]}], labels: []}}
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height / 3}
        yLabelsOffset={5}
        yAxisSuffix={t('charts.cyclesSuffix')}
        chartConfig={{
          backgroundGradientFrom: "#440e6a",
          backgroundGradientTo: "#440e6a",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        style={{borderRadius: 20}}
      />
    </GenericCard>
  );
};
