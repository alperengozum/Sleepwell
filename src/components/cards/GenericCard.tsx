import {StyleProp, ViewStyle} from "react-native";
import {Box, Pressable} from "@gluestack-ui/themed-native-base";
import React, {ReactNode, useMemo} from "react";

export const GenericCard = (props: Props) => {
  const {children, style, onPress} = props;

  return useMemo(() =>
      (
    <Box style={style || {}} justifyContent="center" alignItems="center" width="100%" backgroundColor="coolGray.900"
         borderRadius="25">
      <Pressable w="100%" onPress={onPress || undefined} android_ripple={onPress ? {
        color: "#9333ea",
        borderless: false,
        radius: 1
      } : {}}>
        {children}
      </Pressable>
    </Box>
  ),[children, style, onPress]);
};

interface Props {
  style?: StyleProp<ViewStyle>,
  onPress?: () => void,
  children: ReactNode[] | ReactNode
}
