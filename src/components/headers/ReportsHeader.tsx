import React, {useRef, useState, useEffect} from "react";
import {StyleSheet, Pressable} from "react-native";
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
import {DateRangePickerModal} from "../modals/DateRangePickerModal";

export default function ReportsHeader(props: {
  children: React.ReactNode,
  selectedDate: SleepFilter,
  setSelectedDate: React.Dispatch<React.SetStateAction<SleepFilter>>
}) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const locale = isValidLanguage(language) ? language : 'en';
  const [formattedDateRange, setFormattedDateRange] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {selectedDate, setSelectedDate} = props;
  
  useEffect(() => {
    if (selectedDate?.start && selectedDate?.end) {
      moment.locale(locale);
      const startDate = moment(selectedDate.start).format("D MMM YYYY");
      const endDate = moment(selectedDate.end).format("D MMM YYYY");
      setFormattedDateRange(`${startDate} - ${endDate}`);
    }
  }, [selectedDate, locale]);
  const insets = useSafeAreaInsets();

  const onLeftDateButtonPress = () => {
    if (selectedDate?.start) {
      const prevMonthStart = new Date(selectedDate.start.getFullYear(), selectedDate.start.getMonth() - 1, 1);
      const prevMonthEnd = new Date(selectedDate.start.getFullYear(), selectedDate.start.getMonth(), 0); // Last day of previous month
      setSelectedDate({
        start: prevMonthStart,
        end: prevMonthEnd
      });
    }
  };
  const onRightDateButtonPress = () => {
    if (selectedDate?.start) {
      const nextMonthStart = new Date(selectedDate.start.getFullYear(), selectedDate.start.getMonth() + 1, 1);
      const now = new Date();
      const nextMonthEnd = new Date(selectedDate.start.getFullYear(), selectedDate.start.getMonth() + 2, 0); // Last day of next month
      
      const isNextMonthCurrentMonth = nextMonthStart.getMonth() === now.getMonth() && 
                                       nextMonthStart.getFullYear() === now.getFullYear();
      const endDate = isNextMonthCurrentMonth ? now : nextMonthEnd;
      
      if (nextMonthStart.getTime() <= now.getTime()) {
        setSelectedDate({
          start: nextMonthStart,
          end: endDate
        });
      }
    }
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
        {React.isValidElement(props.children) &&
          React.cloneElement(props.children, {
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
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text color="white" fontSize="md" letterSpacing={0.1} fontWeight="thin" style={{ textDecorationLine: 'underline' }}>
                {formattedDateRange}
              </Text>
            </Pressable>
          </VStack>
          <IconButton variant="ghost" colorScheme={"white"}
                      icon={<Icon as={Ionicons} name="chevron-forward-outline" color={"white"} size={8}/>}
                      isDisabled={!selectedDate.end || selectedDate.end.getTime() >= new Date().getTime()}
                      onPress={onRightDateButtonPress}/>
        </HStack>
      </MotiView>
      <MotiView style={[styles.topBar, topBarStyle]}/>
      <DateRangePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onConfirm={(dateRange) => {
          setSelectedDate(dateRange);
          setShowDatePicker(false);
        }}
      />
    </View>
  );
}
