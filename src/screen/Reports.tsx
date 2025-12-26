import React from "react";
import {ReportsList} from "../components/lists/ReportsList";
import ReportsHeader from "../components/headers/ReportsHeader";
import {SleepFilter} from "../store/SleepStore";
import {getMonthBefore} from "../utils/DateUtils";
import {useFocusEffect} from "@react-navigation/native";

export default function Reports() {
  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      start: start,
      end: now
    };
  };

  const [selectedDate, setSelectedDate] = React.useState<SleepFilter>(getCurrentMonthRange());

  useFocusEffect(React.useCallback(() => {
    return () => {
      setSelectedDate(getCurrentMonthRange());
    };
  }, []))

  return (
    <ReportsHeader setSelectedDate={setSelectedDate} selectedDate={selectedDate}>
      <ReportsList selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
    </ReportsHeader>
  );
}
