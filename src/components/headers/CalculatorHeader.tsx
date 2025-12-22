import React, {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {Heading, HStack, Icon, IconButton, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import {useLinkTo} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import "moment/locale/tr";
import "moment/locale/de";
import "moment/locale/fr";
import "moment/locale/az";
import "moment/locale/uz";
import "moment/locale/hi";
import "moment/locale/ur";
import "moment/locale/ar";
import "moment/locale/es";
import "moment/locale/ru";
import LiveClock from "../clock/LiveClock";
import {getCalendars} from 'expo-localization';
import {MotiView} from "moti";
import Animated, {useSharedValue, useAnimatedScrollHandler, useAnimatedStyle} from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useSettingsStore} from "../../store/SettingsStore";
import {isValidLanguage} from "../../i18n";

export default function CalculatorHeader(props: { children: React.ReactNode; }) {
  const linkTo = useLinkTo();
  const language = useSettingsStore((state) => state.language);
  const [is24Hour, setIs24Hour] = useState<boolean | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState("");
  const insets = useSafeAreaInsets();

  const HEADER_MAX_HEIGHT = 240;
  const HEADER_MIN_HEIGHT = 150;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  useEffect(() => {
    setIs24Hour(getCalendars()[0].uses24hourClock || false);
  }, []);

  useEffect(() => {
    // Set moment locale based on current language
    const locale = isValidLanguage(language) ? language : 'en';
    moment.locale(locale);
    setFormattedDate(moment().format("dddd, D MMMM YYYY"));
    
    // Update date every minute
    const interval = setInterval(() => {
      setFormattedDate(moment().format("dddd, D MMMM YYYY"));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [language]);

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
    return {
      transform: [
        {translateY: -HEADER_SCROLL_DISTANCE * progress},
        {scale: 1 - 0.2 * progress}
      ],
      opacity: 1 - progress
    };
  });

  const headerBgStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
    return {
      opacity: 1 - progress,
      transform: [{translateY: 100 * progress}]
    };
  });

  const topHeaderBarStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
    return {
      transform: [
        {scale: 1 - 0.2 * progress},
        {translateY: -90 * progress}
      ],
      opacity: 1 - progress
    };
  });

  const styles = StyleSheet.create({
    saveArea: {flex: 1, backgroundColor: "black"},
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "transparent",
      overflow: "hidden",
      height: HEADER_MAX_HEIGHT + insets.top
    },
    headerBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      height: HEADER_MAX_HEIGHT + insets.top,
      resizeMode: "cover"
    },
    topBar: {
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: insets.top,
      left: 0,
      right: 0,
      paddingHorizontal: 16
    },
    topHeaderBar: {
      height: HEADER_MAX_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0
    },
    title: {color: "black", fontSize: 20}
  });

  const openInfoScreen = () => linkTo("/Info");

  return (
    <View style={styles.saveArea}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop: HEADER_MAX_HEIGHT - 32, paddingBottom: 100}}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {props?.children}
      </Animated.ScrollView>
      <MotiView style={[styles.header, headerStyle]}>
        <MotiView style={[styles.headerBackground, headerBgStyle]}/>
      </MotiView>
      <MotiView style={[styles.topHeaderBar, {paddingTop: insets.top}, topHeaderBarStyle]}>
        <VStack alignItems="center" space={2} flex={1} justifyContent="center">
          <HStack mx={10} space={2}>
            <Heading color="white" size="xl" letterSpacing={0.1} fontWeight="thin">
              Sleep
            </Heading>
            <Heading color="purple.700" size="xl" letterSpacing={0.1} fontWeight="thin">
              well
            </Heading>
          </HStack>
          {is24Hour != undefined ? <LiveClock is24Hour={is24Hour}/> : <React.Fragment/>}
          <Text color="gray.200">
            {formattedDate}
          </Text>
        </VStack>
      </MotiView>
      <MotiView style={[styles.topBar]}>
        <HStack justifyContent="flex-end" alignItems="center" width="100%" height="100%">
          <IconButton
            colorScheme="purple"
            borderRadius="full"
            onPress={openInfoScreen}
            icon={<Icon as={Ionicons} name="information-circle-outline" size={8}/>}
          />
        </HStack>
      </MotiView>
    </View>
  );
}
