import React, {useRef, useState, useEffect} from "react";
import {StyleSheet} from "react-native";
import {Heading, HStack, Icon, IconButton, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {SleepFilter} from "../../store/SleepStore";
import {getMonthBefore} from "../../utils/DateUtils";
import {MotiView} from "moti";
import Animated, {useSharedValue, useAnimatedScrollHandler, useAnimatedStyle} from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {useSettingsStore} from "../../store/SettingsStore";
import {isValidLanguage} from "../../i18n";

export default function ReportsHeader(props: {
  children: React.ReactNode,
  selectedDate: SleepFilter,
  setSelectedDate: React.Dispatch<React.SetStateAction<SleepFilter>>
}) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const locale = isValidLanguage(language) ? language : 'en';
  const [formattedDateRange, setFormattedDateRange] = useState("");
  
  useEffect(() => {
    if (selectedDate.start && selectedDate.end) {
      moment.locale(locale);
      const startDate = moment(selectedDate.start).format("D MMM YYYY");
      const endDate = moment(selectedDate.end).format("D MMM YYYY");
      setFormattedDateRange(`${startDate} - ${endDate}`);
    }
  }, [selectedDate, locale]);
  const {selectedDate, setSelectedDate} = props;
  const insets = useSafeAreaInsets();

  const onLeftDateButtonPress = () => {
    setSelectedDate({
      start: getMonthBefore(selectedDate.start, 1),
      end: selectedDate.start
    });
  };
  const onRightDateButtonPress = () => {
    const monthAfter = new Date(selectedDate.end?.getTime() || 0);
    monthAfter.setMonth(monthAfter.getMonth() + 1);
    setSelectedDate({
      start: selectedDate.end,
      end: monthAfter
    });
  };

  const HEADER_MAX_HEIGHT = 80;
  const HEADER_MIN_HEIGHT = 80;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const scrollY = useSharedValue(0);
  const scrollviewRef = useRef<Animated.ScrollView>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const getProgress = () => {
    "worklet";
    if (HEADER_SCROLL_DISTANCE === 0) {
      return 0;
    }
    return Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
  };

  // Animated styles
  const headerStyle = useAnimatedStyle(() => {
    const progress = getProgress();
    return {
      transform: [{translateY: -HEADER_SCROLL_DISTANCE * progress}]
    };
  });

  const headerBgStyle = useAnimatedStyle(() => {
    const progress = getProgress();
    return {
      opacity: 1 - progress,
      transform: [{translateY: 100 * progress}]
    };
  });

  const topHeaderBarStyle = useAnimatedStyle(() => {
    const progress = getProgress();
    return {
      scale: 1 - 0.5 * progress,
      transform: [{translateY: 0}]
    };
  });

  const topBarStyle = useAnimatedStyle(() => {
    const progress = getProgress();
    return {
      transform: [
        {scale: 1 - 0.1 * progress},
      ],
      opacity: progress > 0.9 ? 1 : 0
    };
  });

  const styles = StyleSheet.create({
    saveArea: {
      flex: 1,
      backgroundColor: "black",
    },
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
      marginTop: 120,
      height: 120,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0
    },
    topHeaderBar: {
      height: 120,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0
    },
    title: {
      color: "black",
      fontSize: 20
    }
  });

  return (
    <View style={styles.saveArea}>
      <Animated.ScrollView
        ref={scrollviewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop: HEADER_MAX_HEIGHT - 32, paddingBottom: 100}}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {props && props.children && React.cloneElement(props.children as React.ReactElement, {
          selectedDate: selectedDate,
          setSelectedDate: setSelectedDate,
        })}
      </Animated.ScrollView>
      <MotiView style={[styles.header, headerStyle]}>
        <MotiView style={[styles.headerBackground, headerBgStyle]}/>
      </MotiView>
      <MotiView style={[styles.topHeaderBar, topHeaderBarStyle]}>
        <HStack justifyContent="space-between" alignItems="center" width="100%" height="100%" bgColor="black" paddingTop={insets.top}>
          <IconButton variant="ghost" colorScheme={"white"}
                      icon={<Icon as={Ionicons} name="chevron-back-outline" color={"white"} size={8}/>}
                      onPress={onLeftDateButtonPress}/>
          <VStack alignItems={"center"}>
            <Heading color="white" size="xl" letterSpacing={0.1} fontWeight="thin">
              {t('reports.title')}
            </Heading>
            <Text color="white" fontSize="md" letterSpacing={0.1} fontWeight="thin">
              {formattedDateRange}
            </Text>
          </VStack>
          <IconButton variant="ghost" colorScheme={"white"}
                      icon={<Icon as={Ionicons} name="chevron-forward-outline" color={"white"} size={8}/>}
                      isDisabled={selectedDate.end!.getTime() >= new Date().getTime()}
                      onPress={onRightDateButtonPress}/>
        </HStack>
      </MotiView>
      <MotiView style={[styles.topBar, topBarStyle]}/>
    </View>
  );
}
