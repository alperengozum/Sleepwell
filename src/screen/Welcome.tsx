import React, {useEffect, useRef} from "react";
import {useNavigation} from "@react-navigation/native";
import * as NavigationBar from 'expo-navigation-bar';
import {Button, HStack, View} from "@gluestack-ui/themed-native-base";
import {SwiperFlatList} from "react-native-swiper-flatlist";
import LottieView from "lottie-react-native";
import {SlideItem} from "../components/slide/SlideItem";
import {useSettingsStore} from "../store/SettingsStore";
import {SettingsType} from "../store/SettingsStore";
import { SwiperFlatListRefProps } from "react-native-swiper-flatlist/src/components/SwiperFlatList/SwiperFlatListProps";

export default function Welcome() {
  const ref: React.Ref<SwiperFlatListRefProps>  = useRef(null);
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      NavigationBar.setVisibilityAsync('hidden');
    });
    return unsubscribe;
  }, [navigation])

  const onDone = () => {
    useSettingsStore.getState().editSetting(SettingsType.WELCOME, false);
    // @ts-ignore
    navigation.navigate("Main");
  }

  const onPrevious = () => {
    if (index === 0) {
      return;
    } else {
      ref.current?.scrollToIndex({index: index -1, animated: true});
      setIndex(index - 1);
    }
  }
  const onNext = () => {
    if (index === 3) {
      onDone();
    } else {
      ref.current?.scrollToIndex({index: index + 1, animated: true});
      setIndex(index + 1);
    }
  }
  const list = [
    {
      title: "Elevate Your Sleep Quality:\nGet Started with Sleepwell!",
      image: <LottieView
        source={require("../components/lottie/FirstSlide.json")}
        style={{width: "100%", height: "30%"}}
        autoPlay
        loop
      />,
      desc: "Sleepwell is an open-source sleep cycle app. Determine optimal wake-up, sleep, and nap times. Explore customizable alarms and progress reports for better sleep."
    },
    {
      title: "Enjoy Restful Sleep\nwith Sleepwell Features",
      image: <LottieView
        source={require("../components/lottie/SecondSlide.json")}
        style={{width: "100%", height: "30%"}}
        speed={0.5}
        loop
        autoPlay
      />,
      desc: "Sleepwell helps create and track personalized sleep schedules. Experience healthier sleep with customizable alarms, insightful reports, and user-friendly design."
    },
    {
      title: "Sleepwell: Calculating and\nTracking Sleep Cycles",
      image: <LottieView
        source={require("../components/lottie/ThirdSlide.json")}
        style={{width: "100%", height: "30%"}}
        speed={0.74}
        loop
        autoPlay
      />,
      desc: "Sleepwell analyzes sleep cycles and suggests personalized timings using advanced algorithms. Sleep better with optimized wake-up and rest times."
    },
    {
      title: "Join the Sleepwell Community:\nCollaborate for Better Sleep",
      image: <LottieView
        source={require("../components/lottie/FourthSlide.json")}
        style={{width: "100%", height: "30%"}}
        loop
        autoPlay
      />,
      desc: "Sleepwell fosters a community experience. Contribute on GitHub and other platforms. Download Sleepwell for improved sleep quality and collaborative progress.",
      onPress: onDone
    }
  ]
  return (
    <View sx={{
      flex: 1,
      backgroundColor: "black"
    }}>
      <SwiperFlatList
        ref={ref}
        index={index}
        onChangeIndex={({index}) => setIndex(index)}
        showPagination
        autoplay
        autoplayDelay={5}
        data={list}
        renderItem={({item}) => SlideItem(item)}/>
      <HStack height={38} justifyContent={"space-between"}>
        <Button colorScheme={"purple"} borderRadius={16} onPress={index === 0 ? onDone : onPrevious}>
          {index === 0 ? "Skip" : "Previous"}
        </Button>
        <Button colorScheme={"purple"} borderRadius={16} onPress={onNext}>
          {index === list.length - 1 ? "Done" : "Next"}
        </Button>
      </HStack>
    </View>
  );
}
