import React, {useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import {HStack, Text, View} from "@gluestack-ui/themed-native-base";
import {GenericHeaderCard} from "../cards/GenericHeaderCard";
import SettingsStore, {Settings, SettingsType} from "../../store/SettingsStore";
import {FallAsleepCard} from "../cards/FallAsleepCard";
import {List, ListType} from "../../domain/List";
import {WelcomeCard} from "../cards/WelcomeCard";
import {autorun} from "mobx";

const getRenderItem = ({item}: { item: List }): React.ReactElement => {
  if (item!.type === ListType.HEADER) {
    return <GenericHeaderCard>
      <HStack mr={10} justifyContent="space-between" alignItems="center" textAlign="center">
        <Text color="white" fontSize="lg">{item.name}</Text>
        <Text color="white" fontSize="lg">{item.desc}</Text>
      </HStack>
    </GenericHeaderCard>;
  } else if (item.type == ListType.ITEM) {
    switch (item.name) {
      case SettingsType.FALL_ASLEEP:
        return <FallAsleepCard/>
      case SettingsType.WELCOME:
        return <WelcomeCard/>
      default:
        return <React.Fragment/>
    }
  } else {
    return <React.Fragment/>
  }
}

export const SettingsList = () => {
  const [settings, setSettings] = useState<Array<Settings> | undefined>(undefined);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await SettingsStore.getSettingsAsync();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const disposer = autorun(() => {
      setSettings(SettingsStore.getSettings());
    });
    return () => disposer();
  }, []);

  const buildList = () => {
    let newList: Array<List> = [];
    if (settings) settings.forEach((setting: Settings) => {
      newList.push({
        type: ListType.ITEM,
        name: setting.type,
        desc: setting.value,
        id: setting.id
      })
    })
    return newList.filter((a, i) => newList.findIndex((s) => a.name === s.name) === i)
  }

  const data = buildList();

  const stickyHeaderIndices = data
    .map((item, index) => {
      if (item.type === ListType.HEADER) {
        return index;
      } else {
        return null;
      }
    })
    .filter((item: number | null) => item !== null) as number[];

  return (
    <View width={"100%"} h={"100%"} mt={50}>
      <FlashList
        data={data}
        renderItem={getRenderItem}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={(item) => {
          return typeof item === "string" ? "sectionHeader" : "row";
        }}
        estimatedItemSize={10}
      />
    </View>
  );
};
