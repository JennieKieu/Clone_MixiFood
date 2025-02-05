import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {CalendarList, LocaleConfig} from 'react-native-calendars';
import {useThemeContext} from '../../contexts/ThemeContext';
import {TouchableOpacity, View} from 'react-native';
import {SViewStyle} from '../../models';
import {spacing, style} from '../../theme';
import i18n from '../../i18n/i18n';
import {
  addHours,
  addMonths,
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import {enUS, vi} from 'date-fns/locale';
import {Text} from '@rneui/themed';
import {AppImage} from '../AppImage';
import {images} from '../../../assets';
import {Dispatch, SetStateAction, useState} from 'react';
import {vietnamTime} from '../../utils';

export type TAppCalendarBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  SetSelectedDate: Dispatch<SetStateAction<string>>;
  selectedDate: string;
};

export const AppCalendarBottomSheet: React.FC<TAppCalendarBottomSheetProps> = ({
  bottomSheetModalRef,
  selectedDate,
  SetSelectedDate,
  ...rest
}) => {
  const {colorScheme} = useThemeContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [selectedDateTemp, setSelectedDateTemp] = useState<string>('');

  const handleNextOnCalendar = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };

  const handlePreviousOnCalendar = () => {
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
  };

  const handleDayPress = (day: {dateString: string}) => {
    // console.log(day);
    SetSelectedDate(day.dateString);
    // setSelectedDateTemp(day.dateString);

    // bottomSheetModalRef.current?.dismiss(); // Đóng modal sau khi chọn ngày
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: 'blue',
      selectedTextColor: 'white',
      marked: true,
    },
  };

  return (
    <BottomSheetModal
      {...rest}
      ref={bottomSheetModalRef}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing
      backgroundStyle={{backgroundColor: colorScheme.background}}
      handleIndicatorStyle={{
        backgroundColor: colorScheme.text,
      }}>
      <BottomSheetView>
        <View style={[style.mx_md, style.row_between]}>
          <View></View>
          <View style={[style.row_between, {width: '25%'}]}>
            <TouchableOpacity onPress={handlePreviousOnCalendar}>
              <AppImage source={images.angle_left1} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextOnCalendar}>
              <AppImage source={images.angle_right} />
            </TouchableOpacity>
          </View>
        </View>
        <CalendarList
          horizontal={true}
          pagingEnabled={true}
          current={format(currentMonth, 'yyyy-MM-dd')}
          onVisibleMonthsChange={months => {
            if (months && months.length > 0) {
              setCurrentMonth(new Date(months[0].dateString));
            }
          }}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          scrollEnabled={true}

          // hideArrows={true}

          //   calendarWidth={320}
          //   scrollEnabled
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
];
