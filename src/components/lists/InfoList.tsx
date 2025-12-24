import React from "react";
import {FlashList} from "@shopify/flash-list";
import {Button, HStack, Icon, Text, View, VStack} from "@gluestack-ui/themed-native-base";
import {GenericCard} from "../cards/GenericCard";
import {GenericHeaderCard} from "../cards/GenericHeaderCard";
import {Linking} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {InfoList as List, ListType} from "../../domain/List";
import {useTranslation} from "react-i18next";

export const InfoList = () => {
  const { t } = useTranslation();

  const list: Array<List> = [
    {
      name: t('info.healthNotice'),
      desc: t('info.healthNoticeDesc'),
      type: ListType.ITEM
    },
    {
      name: t('info.logoOrigin'),
      desc: t('info.logoOriginDesc'),
      type: ListType.ITEM
    },
    {
      name: t('info.openSource'),
      desc: t('info.openSourceDesc'),
      link: "https://github.com/Alperengozum/Sleepwell",
      type: ListType.ITEM,
      buttonText: t('info.openGithubProject'),
      icon: <Icon color="white" as={MaterialCommunityIcons} name="github" size={6}/>,
    },
    {
      name: t('info.addFeature'),
      desc: t('info.addFeatureDesc'),
      link: "https://github.com/Alperengozum/Sleepwell/pulls",
      type: ListType.ITEM,
      buttonText: t('info.openGithubPulls'),
      icon: <Icon color="white" as={MaterialCommunityIcons} name="github" size={6}/>,
    },
    {
      name: t('info.haveIssue'),
      desc: t('info.haveIssueDesc'),
      link: "https://github.com/Alperengozum/Sleepwell/issues",
      type: ListType.ITEM,
      buttonText: t('info.openGithubIssues'),
      icon: <Icon color="white" as={MaterialCommunityIcons} name="github" size={6}/>,
    },
    {
      name: t('info.contact'),
      desc: t('info.contactDesc'),
      link: "mailto:alperengozum0@gmail.com",
      type: ListType.ITEM,
      icon: <Icon color="white" as={Ionicons} name="send-outline" size={6}/>,
      buttonText: t('info.sendMail')
    },
    {
      name: t('info.otherProjects'),
      desc: t('info.otherProjectsDesc'),
      link: "https://play.google.com/store/apps/dev?id=8842825248111634874",
      type: ListType.ITEM,
      buttonText: t('info.openPlayStore'),
      icon: <Icon color="white" as={MaterialCommunityIcons} name="google-play" size={6}/>,
    }
  ]

  const stickyHeaderIndices = list
    .map((item, index) => {
      if (item.type === ListType.HEADER) {
        return index;
      } else {
        return null;
      }
    })
    .filter((item: number | null) => item !== null) as number[];

  const getRenderItem = ({item}: { item: List }): React.ReactElement => {
    if (item!.type === ListType.HEADER) {
      // Rendering header
      return <GenericHeaderCard>
        <HStack mr={10} justifyContent="space-between" alignItems="center" sx={{
          textAlign: "center"
        }}>
          <Text color="white" fontSize="lg">{item.name}</Text>
          <Text color="white" fontSize="lg">{item.desc}</Text>
        </HStack>
      </GenericHeaderCard>;
    } else if (item.type == ListType.ITEM) {
      return <GenericCard style={{marginVertical: 10}}>
        <HStack my={5} flex={1} justifyContent="space-between" alignItems="center" sx={{
          textAlign: "center"
        }}>
          <VStack mx={5} space={2} flex={1} alignItems="center">
            <Text color="white" fontSize="md">{item.name}</Text>
            <Text color="gray.400" fontSize="sm">{item.desc}</Text>
            {item.link ? <Button endIcon={item.icon} variant="solid" _active={{
              bg: "$purple.800"
            }} bg={"$purple.600"} borderRadius={16}
                                 onPress={() => Linking.openURL(item.link!)}>
              {item.buttonText || t('info.link')}
            </Button> : <React.Fragment/>}
          </VStack>
        </HStack>
      </GenericCard>
    } else {
      return <React.Fragment/>
    }
  }

  return (
    <View width={"100%"} h={"100%"} mt={50}>
      <FlashList
        data={list}
        renderItem={getRenderItem}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === "string" ? "sectionHeader" : "row";
        }}
        estimatedItemSize={10}
      />
    </View>
  );
};
