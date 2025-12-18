import React, {useEffect} from "react";
import {FlashList} from "@shopify/flash-list";
import {HStack, Icon, IconButton, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import {GenericCard} from "../cards/GenericCard";
import {GenericHeaderCard} from "../cards/GenericHeaderCard";
import {useSleepStore} from "../../store/SleepStore";
import {Sleep, SleepFilter, SleepType} from "../../store/SleepStore";
import Ionicons from "react-native-vector-icons/Ionicons";
import {SleepIndicatorChart} from "../charts/SleepIndicatorChart";
import {SleepLineChart} from "../charts/SleepLineChart";
import {getMonthBefore} from "../../utils/DateUtils";
import {SleepPieChart} from "../charts/SleepPieChart";
import {List, ListType} from "../../domain/List";

interface ReportsListProps {
  selectedDate?: SleepFilter;
  setSelectedDate?: React.Dispatch<React.SetStateAction<SleepFilter>>;
}

export const ReportsList = ({selectedDate, setSelectedDate}: ReportsListProps) => {
  const getSleeps = useSleepStore((state) => state.getSleeps);
  const deleteSleep = useSleepStore((state) => state.deleteSleep);
  const sleeps = useSleepStore((state) => state.sleeps);

  useEffect(() => {
    buildList()
  }, [selectedDate, sleeps]);

  const getFilteredSleeps = () => {
    return getSleeps(SleepType.SLEEP, {
      start: selectedDate?.start || getMonthBefore(),
      end: selectedDate?.end || getMonthBefore(new Date(), 0)
    })
  }
  
  const buildList = (): Array<List> => {
    const filteredSleeps = getFilteredSleeps();
    const newList: Array<List> = [];
    newList.push({
      type: ListType.HEADER,
      name: "Reports",
    })
    filteredSleeps?.forEach((sleep: Sleep) => {
      newList.push({
        type: ListType.ITEM,
        name: sleep.type,
        desc: sleep.cycle,
        id: sleep.id
      })
    })
    return newList;
  }
  
  const handleDeleteSleep = (id: number) => {
    deleteSleep(id)
  }
  const getRenderItem = ({item}: { item: List }): React.ReactElement => {
    const filteredSleeps = getFilteredSleeps();
    switch (item!.type) {
      case ListType.HEADER:
        // Rendering header
        return (
          <GenericHeaderCard boxProps={{
            mx: 0,
            my: 0,
            mt: 10
          }}>
            <SleepLineChart sleeps={filteredSleeps}/>
            <SleepIndicatorChart sleeps={filteredSleeps}/>
            <SleepPieChart sleeps={filteredSleeps}/>
          </GenericHeaderCard>
        );
      case ListType.ITEM:
        return (
          <GenericCard style={{marginVertical: 10}} onPress={item.onClick || undefined}>
            <HStack my={5} mr={5} justifyContent="space-between" alignItems="center" textAlign="center">
              <VStack mx={5}>
                <Text color="white" fontSize="lg">
                  {item.name === SleepType.SLEEP ? `${item.desc} Sleep Cycles` : 'Powernap'}
                </Text>
                <Text color="gray.400" fontSize="md">
                  {item.name === SleepType.SLEEP
                    ? `Equals ${item.desc as number * 1.5} hours sleep.`
                    : 'Equals 30 minutes sleep.'}
                </Text>
              </VStack>
              <View>
                <HStack alignItems="center" space={5}>
                  <IconButton
                    colorScheme="red"
                    borderRadius="20"
                    borderColor="$red.500"
                    borderWidth={1}
                    variant="outline"
                    icon={<Icon as={Ionicons} name="trash-outline" size={6}/>}
                    onPress={() => handleDeleteSleep(item.id as number)}
                  />
                </HStack>
              </View>
            </HStack>
          </GenericCard>
        );
      default:
        return <React.Fragment/>;
    }
  };

  const filteredSleeps = getFilteredSleeps();

  return (
    <View width="100%" mt={50} height="100%">
      <FlashList
        contentContainerStyle={{paddingBottom: 140}}
        data={buildList()}
        renderItem={getRenderItem}
        onEndReached={() => {
          //TODO: Add end reached
        }}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === "string" ? "sectionHeader" : "row";
        }}
        estimatedItemSize={200}
        ListFooterComponent={<View height={120}>
          <Text color="white" fontSize="md" textAlign="center" mt={10}>
            {filteredSleeps?.length! > 0 ? `No more sleeps to show.\nTotal Sleeps: ${filteredSleeps?.length}` : "No sleeps to show.\nWhy didn't you sleep?"}
          </Text>
        </View>}
      />
    </View>
  );
};
