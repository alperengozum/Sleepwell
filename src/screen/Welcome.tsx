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
import {useTranslation} from "react-i18next";

export default function Welcome() {
  const { t } = useTranslation();
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
      title: t('welcome.slide1Title'),
      image: <LottieView
        source={require("../components/lottie/FirstSlide.json")}
        style={{width: "100%", height: "30%"}}
        autoPlay
        loop
      />,
      desc: t('welcome.slide1Desc')
    },
    {
      title: t('welcome.slide2Title'),
      image: <LottieView
        source={require("../components/lottie/SecondSlide.json")}
        style={{width: "100%", height: "30%"}}
        speed={0.5}
        loop
        autoPlay
      />,
      desc: t('welcome.slide2Desc')
    },
    {
      title: t('welcome.slide3Title'),
      image: <LottieView
        source={require("../components/lottie/ThirdSlide.json")}
        style={{width: "100%", height: "30%"}}
        speed={0.74}
        loop
        autoPlay
      />,
      desc: t('welcome.slide3Desc')
    },
    {
      title: t('welcome.slide4Title'),
      image: <LottieView
        source={require("../components/lottie/FourthSlide.json")}
        style={{width: "100%", height: "30%"}}
        loop
        autoPlay
      />,
      desc: t('welcome.slide4Desc'),
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
        paginationStyle={{ marginBottom: 40 }}
        autoplay
        autoplayDelay={5}
        data={list}
        renderItem={({item}) => SlideItem(item)}/>
      <HStack height={60} m={4} justifyContent={"space-between"}>
        <Button colorScheme={"purple"} borderRadius={24} onPress={index === 0 ? onDone : onPrevious}>
          {index === 0 ? t('common.skip') : t('common.previous')}
        </Button>
        <Button colorScheme={"purple"} borderRadius={24} onPress={onNext}>
          {index === list.length - 1 ? t('common.done') : t('common.next')}
        </Button>
      </HStack>
    </View>
  );
}
