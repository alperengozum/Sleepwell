import {StyleProp, ViewStyle} from "react-native";
import {Box} from "@gluestack-ui/themed-native-base";
import React, {ReactNode} from "react";
import {InterfaceBoxProps} from "@gluestack-ui/themed-native-base/lib/typescript/components/primitives/Box";


export const GenericHeaderCard = (props: Props) => {
  const {children, style, boxProps} = props;

  return (
    <Box style={style || undefined} width="100%" mx={5} my={5} {...boxProps}>
      {children}
    </Box>
  );
};

interface Props {
  style?: StyleProp<ViewStyle>,
  children: ReactNode[] | ReactNode,
  boxProps?: InterfaceBoxProps
}
