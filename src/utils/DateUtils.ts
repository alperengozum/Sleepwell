import moment from "moment";
import "moment/locale/tr";
import "moment/locale/de";
import "moment/locale/fr";
import "moment/locale/az";
import "moment/locale/uz";
import "moment/locale/hi";
import "moment/locale/ur";
import "moment/locale/ar";
import "moment/locale/es";
import "moment/locale/ru";

export const getMonthBefore = (date?: Date, monthCount?: number): Date => {
  if (!date) {
    date = new Date();
  }
  if (!monthCount && monthCount !== 0) {
    monthCount = 1;
  }
  return new Date(date.getFullYear(), date.getMonth() - monthCount, 1);
}

export const formatHour = (hours: string, is24Hour: undefined | boolean): string => {
  if (is24Hour) {
    return hours;
  } else {
    let formattedHours = parseInt(hours) % 12;
    formattedHours = formattedHours ? formattedHours : 12;
    if (formattedHours < 10) {
      return "0" + formattedHours.toString();
    }
    return formattedHours.toString();
  }
}

export const formatTime = (date: Date, is24Hour: boolean, locale?: string): string => {
  if (locale) {
    moment.locale(locale);
  }
  const timeString = moment(date).format(is24Hour ? 'HH:mm' : 'hh:mm');
  // For RTL languages (Arabic, Hebrew, Urdu), ensure time is displayed LTR
  // by adding Left-to-Right Mark (LRM) character
  const rtlLanguages = ['ar', 'he', 'ur'];
  if (locale && rtlLanguages.includes(locale)) {
    return '\u200E' + timeString;
  }
  return timeString;
}

export const formatNumber = (number: number, locale?: string, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }): string => {
  if (!locale) {
    return number.toString();
  }
  
  try {
    const formatOptions: Intl.NumberFormatOptions = {
      ...options,
    };
    return new Intl.NumberFormat(locale, formatOptions).format(number);
  } catch (error) {
    return number.toString();
  }
}

export const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 3600000);
}