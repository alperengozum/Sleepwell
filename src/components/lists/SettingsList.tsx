import React from "react";
import {FlashList} from "@shopify/flash-list";
import {HStack, Text, View} from "@gluestack-ui/themed-native-base";
import {GenericHeaderCard} from "../cards/GenericHeaderCard";
import {Observer} from "mobx-react";
import SettingsStore, {Settings, SettingsType} from "../../store/SettingsStore";
import {FallAsleepCard} from "../cards/FallAsleepCard";
import {SupportMeCard} from "../cards/SupportMeCard";
import {List, ListType} from "../../domain/List";
import {WelcomeCard} from "../cards/WelcomeCard";
import {SafeAreaView} from "react-native-safe-area-context";

const getRenderItem = ({item}: { item: List }): React.ReactElement => {
  if (item!.type === ListType.HEADER) {
    // Rendering header
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
      case SettingsType.SUPPORT_ME:
        return <SupportMeCard/>
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

  const buildList = () => {
    let tempList: Array<Settings> | undefined = SettingsStore.getSettings();
    let newList: Array<List> = [];
    if (tempList) tempList.forEach((settings: Settings) => {
      newList.push({
        type: ListType.ITEM,
        name: settings.type,
        desc: settings.value,
        id: settings.id
      })
    })
    return newList.filter((a, i) => newList.findIndex((s) => a.name === s.name) === i)
  }

  const stickyHeaderIndices = buildList()
    .map((item, index) => {
      if (item.type === ListType.HEADER) {
        return index;
      } else {
        return null;
      }
    })
    .filter((item: number | null) => item !== null) as number[];

  return (
    <Observer>
      {() => (
        <View width={"100%"} h={"100%"} mt={50}>
          <FlashList
            data={buildList()}
            renderItem={getRenderItem}
            stickyHeaderIndices={stickyHeaderIndices}
            getItemType={(item) => {
              // To achieve better performance, specify the type based on the item
              return typeof item === "string" ? "sectionHeader" : "row";
            }}
            estimatedItemSize={10}
          />
        </View>)}
    </Observer>
  );
};
