import React, { useState, useEffect } from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { SleepFilter } from '../../store/SleepStore';
import moment from 'moment';
import 'moment/locale/tr';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/az';
import 'moment/locale/uz';
import 'moment/locale/hi';
import 'moment/locale/ur';
import 'moment/locale/ar';
import 'moment/locale/es';
import 'moment/locale/ru';
import { useSettingsStore } from '../../store/SettingsStore';
import { isValidLanguage } from '../../i18n';

interface DateRangePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: SleepFilter;
  onConfirm: (dateRange: SleepFilter) => void;
}

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const locale = isValidLanguage(language) ? language : 'en';
  
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    const hasStartAndEnd = !!selectedDate?.start && !!selectedDate?.end;

    if (hasStartAndEnd) {
      const currentLocale = moment.locale();
      moment.locale('en');

      const start = moment(selectedDate.start).format('YYYY-MM-DD');
      const end = moment(selectedDate.end).format('YYYY-MM-DD');

      moment.locale(currentLocale);

      setStartDate(start);
      setEndDate(end);
      setCurrentMonth(start);
      updateMarkedDates(start, end);
    } else if (visible) {
      const currentLocale = moment.locale();
      moment.locale('en');
      setCurrentMonth(moment().format('YYYY-MM-DD'));
      moment.locale(currentLocale);
    }
  }, [selectedDate, visible]);

  const updateMarkedDates = (start: string | null, end: string | null) => {
    const marked: any = {};
    const dateState = start && end ? 'range' : (start ? 'single' : 'none');
    
    switch (dateState) {
      case 'range': {
        const currentLocale = moment.locale();
        moment.locale('en');
        
        const startMoment = moment(start, 'YYYY-MM-DD', true);
        const endMoment = moment(end, 'YYYY-MM-DD', true);
        
        moment.locale(currentLocale);
        
        if (!startMoment.isValid() || !endMoment.isValid()) {
          setMarkedDates({});
          return;
        }
        
        const daysDiff = endMoment.diff(startMoment, 'days');
        const dateRange = Array.from({ length: daysDiff + 1 }, (_, index) => {
          return startMoment.clone().add(index, 'days').format('YYYY-MM-DD');
        });
        
        dateRange.forEach((dateStr) => {
          switch (dateStr) {
            case start:
              marked[dateStr] = {
                startingDay: true,
                color: '#7e22ce',
                textColor: 'white',
              };
              break;
            case end:
              marked[dateStr] = {
                endingDay: true,
                color: '#7e22ce',
                textColor: 'white',
              };
              break;
            default:
              marked[dateStr] = {
                color: '#a855f7',
                textColor: 'white',
              };
              break;
          }
        });
        break;
      }
      case 'single': {
        const currentLocale = moment.locale();
        moment.locale('en');
        
        const startMoment = moment(start, 'YYYY-MM-DD', true);
        
        moment.locale(currentLocale);
        
        switch (startMoment.isValid()) {
          case true:
            marked[start!] = {
              startingDay: true,
              endingDay: true,
              color: '#7e22ce',
              textColor: 'white',
            };
            break;
          case false:
            break;
        }
        break;
      }
      case 'none':
        break;
    }
    
    setMarkedDates(marked);
  };

  const handleDayPress = (day: DateData) => {
    const dateStr = day.dateString;
    const selectionState = !startDate ? 'none' : (endDate ? 'complete' : 'partial');
    
    switch (selectionState) {
      case 'none':
      case 'complete':
        setStartDate(dateStr);
        setEndDate(null);
        updateMarkedDates(dateStr, null);
        break;
      case 'partial':
        const currentLocale = moment.locale();
        moment.locale('en');
        
        const isBefore = moment(dateStr, 'YYYY-MM-DD', true).isBefore(moment(startDate, 'YYYY-MM-DD', true));
        
        moment.locale(currentLocale);
        
        if (isBefore) {
          setEndDate(startDate);
          setStartDate(dateStr);
          updateMarkedDates(dateStr, startDate);
        } else {
          setEndDate(dateStr);
          updateMarkedDates(startDate, dateStr);
        }
        break;
    }
  };

  const handleConfirm = () => {
    const currentLocale = moment.locale();
    moment.locale('en');
    
    const confirmState = startDate && endDate ? 'range' : (startDate ? 'single' : 'none');
    
    switch (confirmState) {
      case 'range':
        const start = moment(startDate, 'YYYY-MM-DD', true).startOf('day').toDate();
        const end = moment(endDate, 'YYYY-MM-DD', true).endOf('day').toDate();
        onConfirm({ start, end });
        break;
      case 'single':
        const date = moment(startDate, 'YYYY-MM-DD', true).startOf('day').toDate();
        onConfirm({ start: date, end: date });
        break;
      case 'none':
        break;
    }
    
    moment.locale(currentLocale);
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setMarkedDates({});
  };

  useEffect(() => {
    try {
      moment.locale(locale);
      
      const momentLocale = moment.localeData(locale);
      
      const months = momentLocale.months();
      const monthsShort = momentLocale.monthsShort();
      const weekdays = momentLocale.weekdays();
      const weekdaysShort = momentLocale.weekdaysShort();
      
      const isValidLocale = months && Array.isArray(months) && months.length >= 12 &&
          monthsShort && Array.isArray(monthsShort) && monthsShort.length >= 12 &&
          weekdays && Array.isArray(weekdays) && weekdays.length >= 7 &&
          weekdaysShort && Array.isArray(weekdaysShort) && weekdaysShort.length >= 7;
      
      switch (isValidLocale) {
        case true:
          LocaleConfig.locales[locale] = {
            monthNames: months,
            monthNamesShort: monthsShort,
            dayNames: weekdays,
            dayNamesShort: weekdaysShort,
            today: 'Today',
          };
          
          LocaleConfig.defaultLocale = locale;
          break;
        case false:
          LocaleConfig.defaultLocale = 'en';
          break;
      }
    } catch (error) {
      LocaleConfig.defaultLocale = 'en';
    }
  }, [locale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 16,
            padding: 24,
            width: '90%',
            maxWidth: 400,
          }}
        >
          <View style={{ width: '100%' }}>
            <Text style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              {t('reports.selectDateRange')}
            </Text>

            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType="period"
              current={currentMonth}
              onMonthChange={(month) => {
                setCurrentMonth(month.dateString);
              }}
              theme={{
                backgroundColor: '#1f2937',
                calendarBackground: '#1f2937',
                textSectionTitleColor: '#9ca3af',
                selectedDayBackgroundColor: '#7e22ce',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#7e22ce',
                dayTextColor: '#ffffff',
                textDisabledColor: '#4b5563',
                dotColor: '#7e22ce',
                selectedDotColor: '#ffffff',
                arrowColor: '#7e22ce',
                monthTextColor: '#ffffff',
                indicatorColor: '#7e22ce',
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '400',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              maxDate={(() => {
                const currentLocale = moment.locale();
                moment.locale('en');
                const maxDate = moment().format('YYYY-MM-DD');
                moment.locale(currentLocale);
                return maxDate;
              })()}
            />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
              gap: 12,
            }}>
              <Pressable
                onPress={handleReset}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: '#374151',
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  {t('common.reset')}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: '#7e22ce',
                }}
                disabled={!startDate}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  opacity: !startDate ? 0.5 : 1,
                }}>
                  {t('common.confirm')}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={onClose}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#374151',
                marginTop: 8,
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              }}>
                {t('common.cancel')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
