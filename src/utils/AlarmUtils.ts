import {useSleepStore, SleepType} from "../store/SleepStore";
import {setAlarm} from "expo-alarm";
import Toast from "react-native-toast-message";
import i18n from "../i18n";
import {formatTime} from "./DateUtils";
import {useSettingsStore} from "../store/SettingsStore";
import {getCalendars} from "expo-localization";
import {isValidLanguage} from "../i18n";

export const createIntentAlarm = (date: Date, type?: SleepType, cycleCount?: number): void => {
  let createDate: Date = new Date();
  const alarmType = type || SleepType.SLEEP;
  const alarmMessage = alarmType === SleepType.SLEEP 
    ? i18n.t('alarm.sleep') 
    : i18n.t('alarm.powernap');
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const language = useSettingsStore.getState().language;
  const locale = isValidLanguage(language) ? language : 'en';
  const is24Hour = getCalendars()[0]?.uses24hourClock || false;
  const timeString = formatTime(date, is24Hour, locale);
  
  setAlarm({
    hour: hours,
    minutes: minutes,
    message: alarmMessage
  }).then(() => {
    Toast.show({
      type: "success",
      position: "bottom",
      text1: i18n.t('alarm.set'),
      text2: i18n.t('alarm.setFor', { time: timeString }),
      autoHide: true,
    })
  })
  useSleepStore.getState().addSleep({
    end: date, start: createDate, type: alarmType, cycle: cycleCount || undefined
  })
}