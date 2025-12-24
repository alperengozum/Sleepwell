import {useSleepStore, SleepType} from "../store/SleepStore";
import {setAlarm} from "expo-alarm";
import Toast from "react-native-toast-message";
import i18n from "../i18n";

export const createIntentAlarm = (date: Date, type?: SleepType, cycleCount?: number): void => {
  let createDate: Date = new Date();
  const alarmType = type || SleepType.SLEEP;
  const alarmMessage = alarmType === SleepType.SLEEP 
    ? i18n.t('alarm.sleep') 
    : i18n.t('alarm.powernap');
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeString = `${hours}:${("0" + minutes).slice(-2)}`;
  
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