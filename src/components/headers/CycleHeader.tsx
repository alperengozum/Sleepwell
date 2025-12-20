import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import { Heading, HStack, Icon, IconButton, View } from "@gluestack-ui/themed-native-base";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MotiView } from "moti";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CycleHeader(props: { children: React.ReactNode; }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const HEADER_MAX_HEIGHT = 150;
  const HEADER_MIN_HEIGHT = 80;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const scrollY = useSharedValue(0);
  const scrollviewRef = useRef<Animated.ScrollView>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated styles
  const headerStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
    return {
      transform: [
        { translateY: -HEADER_SCROLL_DISTANCE * progress }
      ]
    };
  });

  const headerBgStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
    return {
      transform: [{ translateY: 100 * progress }]
    };
  });

  const topHeaderBarStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
    return {
      transform: [{ translateY: -20 * progress }],
      scale: 1 - 0.1 * progress
    };
  });

  const topBarStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / HEADER_SCROLL_DISTANCE, 1);
    return {
      transform: [
        { scale: 1 - 0.1 * progress },
        { translateY: -20 * progress }
      ],
      opacity: progress > 0.9 ? 1 : 0
    };
  });

  const styles = StyleSheet.create({
    saveArea: { flex: 1, backgroundColor: "black" },
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
      height: 10,
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
    title: { color: "black", fontSize: 20 }
  });

  return (
    <View style={styles.saveArea}>
      <Animated.ScrollView
        ref={scrollviewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT - 32, paddingBottom: 100 }}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={e => {
          const y = e.nativeEvent.contentOffset.y;
          if (y > HEADER_MAX_HEIGHT / 5 && y < HEADER_MAX_HEIGHT) {
            scrollviewRef.current?.scrollTo({ x: 0, y: HEADER_MIN_HEIGHT + 10, animated: true });
          }
        }}
      >
        {props?.children}
      </Animated.ScrollView>
      <MotiView style={[styles.header, headerStyle]}>
        <MotiView style={[styles.headerBackground, headerBgStyle]} />
      </MotiView>
      <MotiView style={[styles.topHeaderBar, topHeaderBarStyle]}>
        <HStack justifyContent="space-between" alignItems="center" width="100%" height="100%" bgColor="black" paddingTop={insets.top}>
          <IconButton
            colorScheme="white"
            borderRadius="full"
            color="white"
            onPress={() => navigation.goBack()}
            icon={<Icon as={MaterialCommunityIcons} name="arrow-left" size={8} color="white" />}
          />
          <Heading color="white" size="xl" letterSpacing={0.1} fontWeight="thin">
            Sleep Cycles
          </Heading>
          <IconButton colorScheme="purple" variant="unstyled" />
        </HStack>
      </MotiView>
      <MotiView style={[styles.topBar, topBarStyle]} />
    </View>
  );
}
