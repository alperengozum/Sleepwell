import React, {useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import {Box, Center, Heading, HStack, Icon, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import {GenericCard} from "../cards/GenericCard";
import {GenericHeaderCard} from "../cards/GenericHeaderCard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";
import {SleepType} from "../../store/SleepStore";
import mobileAds, {AdEventType, InterstitialAd, TestIds} from 'react-native-google-mobile-ads';
import {addHours} from "../../utils/DateUtils";
import {createIntentAlarm} from "../../utils/AlarmUtils";
import {List, ListType} from "../../domain/List";
import {TimerPickerModal} from "react-native-timer-picker";
import {LinearGradient} from "expo-linear-gradient";
import {getCalendars} from "expo-localization";
import Constants from "expo-constants";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : (Constants.expoConfig?.extra?.adUnitId || 'ca-app-pub-3940256099942544/1033173712');
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {requestNonPersonalizedAdsOnly: true});

const getRenderItem = ({item}: { item: List }): React.ReactElement => {
  if (item!.type === ListType.HEADER) {
    return <GenericHeaderCard>
      <HStack mx={5} justifyContent="flex-start" alignItems="flex-start">
        {item.icon || <React.Fragment/>}
        <Box size={5}/>
        <Text color="white" fontSize="lg">{item.name}</Text>
      </HStack>
    </GenericHeaderCard>;
  } else if (item.type == ListType.ITEM) {
    return <GenericCard style={{marginVertical: 10}} onPress={item.onClick || undefined}>
      <VStack my={item.desc ? 5 : 10}>
        <Center>
          <Heading color="white" fontWeight="thin">
            {item.name}
          </Heading>
          {item.desc ? <Text color="white" textAlign="center" mx={5}>
            {item.desc}
          </Text> : <React.Fragment/>}
        </Center>
      </VStack>
    </GenericCard>
  } else {
    return <React.Fragment/>
  }
}

export const CalculatorList = () => {
  const [loaded, setLoaded] = useState(false);
  const navigation = useNavigation();

  const [showPicker, setShowPicker] = useState(false);
  const [pickerTitle, setPickerTitle] = useState("");
  const [isStart, setIsStart] = useState(true);

  const list: (List)[] = [
    {
      name: "Sleep",
      type: ListType.HEADER,
      icon: <Icon color="white" as={MaterialCommunityIcons} name="power-sleep" size={8}/>
    },
    {
      name: "Go to bed now",
      desc: "If I sleep now, when should i get up?",
      onClick: () => goToBedNow(),
      type: ListType.ITEM
    },
    {
      name: "When to wake up?",
      desc: "Find the perfect time to wake up.",
      onClick: () => whenToWakeUp(),
      type: ListType.ITEM
    },
    {
      name: "When to go to bed?",
      desc: "Find the perfect time to go to bed.",
      onClick: () => whenToGoToBed(),
      type: ListType.ITEM
    },
    {
      name: "Power nap",
      type: ListType.HEADER,
      icon: <Icon color="white" as={MaterialCommunityIcons} name="desk" size={8}/>,
    },
    {
      name: "Take a power nap",
      desc: " Improve your productivity, your focus, and simply enjoy the feeling!",
      type: ListType.ITEM,
      onClick: () => takeAPowerNap()
    },
  ];

  const stickyHeaderIndices = list
    .map((item, index) => {
      if (item.type === ListType.HEADER) {
        return index;
      } else {
        return null;
      }
    })
    .filter((item: number | null) => item !== null) as number[];

  const goToBedNow = (): void => {
    const date = new Date();
    showAdOrNavigate({name: "Cycle", params: {time: date.getTime(), isStart: true}})
  }

  const whenToWakeUp = (): void => {
    setPickerTitle("Select bed time.");
    setIsStart(true);
    setShowPicker(true);
  }

  const whenToGoToBed = (): void => {
    setPickerTitle("Select wake up time.");
    setIsStart(false);
    setShowPicker(true);
  }

  const takeAPowerNap = (): void => {
    let date: Date = new Date();
    date = addHours(date, 0.5);
    if (loaded) {
      interstitial.show().then(r => {
        setLoaded(false);
        return createIntentAlarm(date, SleepType.POWERNAP);
      });
    }
    createIntentAlarm(date, SleepType.POWERNAP);
  }

  const showAdOrNavigate = (navigationConfig: { name: string, params: Record<string, any> }): void => {
    if (loaded) {
      interstitial.show().then(r => {
        setLoaded(false);
        return navigation.navigate(navigationConfig);
      });
    } else {
      navigation.navigate(navigationConfig);
    }
  }
  useEffect(() => {
    mobileAds().initialize();
  }, [])

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });
    interstitial.load();

    return unsubscribe;
  }, []);

  const getPickedDate = (picked: { hours?: number; minutes?: number; seconds?: number }) => {
    const now = new Date();
    now.setHours(picked.hours ?? 0, picked.minutes ?? 0, picked.seconds ?? 0, 0);
    return now;
  };

  return (
    <View width={"100%"} h={"100%"} mt={50}>
      <FlashList
        data={list}
        renderItem={getRenderItem}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={(item) => typeof item === "string" ? "sectionHeader" : "row"}
        estimatedItemSize={10}
      />
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          const pickedDate = getPickedDate(pickedDuration);
          showAdOrNavigate({name: "Cycle", params: {time: pickedDate.getTime(), isStart}});
          setShowPicker(false);
        }}
        modalTitle={pickerTitle}
        onCancel={() => setShowPicker(false)}
        initialValue={
          {
            hours: isStart ? 23 : 8,
            minutes: isStart ? 30 : 0,
          }
        }
        closeOnOverlayPress
        hideSeconds
        use12HourPicker={!getCalendars()[0].uses24hourClock}
        LinearGradient={LinearGradient}
        styles={{
          theme: "dark",
          confirmButton: {
            backgroundColor: "#7e22ce",
            color: "#fff",
            borderColor: "#7e22ce",
          },
        }}
        modalProps={{
          overlayOpacity: 0.5,
        }}
      />
    </View>
  );
};
