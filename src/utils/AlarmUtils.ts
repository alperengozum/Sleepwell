import {useSleepStore} from "../store/SleepStore";
import {SleepType} from "../store/SleepStore";
import {setAlarm} from "expo-alarm";
import Toast from "react-native-toast-message";

export const createIntentAlarm = (date: Date, type?: SleepType, cycleCount?: number): void => {
  let createDate: Date = new Date();
  setAlarm({
    hour: date.getHours(),
    minutes: date.getMinutes(),
    message: type || SleepType.SLEEP
  }).then(() => {
    Toast.show({
      type: "success",
      position: "bottom",
      text1: "Alarm set",
      text2: `Alarm set for ${date.getHours()}:${date.getMinutes()} Sleepwell!`,
      autoHide: true,
    })
  })
  useSleepStore.getState().addSleep({
    end: date, start: createDate, type: type || SleepType.SLEEP, cycle: cycleCount || undefined
  })
}