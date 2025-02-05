import {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {
  Modal,
  ModalProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SViewStyle} from '../../models';
import {scale, spacing, style} from '../../theme';
import {Text} from '@rneui/themed';
import {useThemeContext} from '../../contexts/ThemeContext';
import {CalendarList} from 'react-native-calendars';
import {
  addDays,
  addMonths,
  format,
  isAfter,
  isBefore,
  subMonths,
} from 'date-fns';
import {AppImage} from '../AppImage';
import {images} from '../../../assets';

type AppModalCaneldarProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  selectedDate: string;
  SetSelectedDate: Dispatch<SetStateAction<string>>;
} & ModalProps;

export const AppModalCalendar: React.FC<AppModalCaneldarProps> = props => {
  const {
    setModalVisible,
    modalVisible,
    selectedDate,
    SetSelectedDate,
    ...rest
  } = props;
  const {colorScheme} = useThemeContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleNextOnCalendar = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };

  const handlePreviousOnCalendar = () => {
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
  };

  const handleDayPress = (day: {dateString: string}) => {
    SetSelectedDate(day.dateString);
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
    <Modal {...rest} visible={modalVisible} transparent>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={$root}>
          <TouchableWithoutFeedback>
            <View style={[$modal, {backgroundColor: colorScheme.background}]}>
              <View style={style.row_between}>
                <TouchableOpacity onPress={handlePreviousOnCalendar}>
                  <AppImage
                    source={images.angle_left}
                    style={{width: 20, height: 20, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNextOnCalendar}>
                  <AppImage
                    source={images.angle_right}
                    style={{width: 20, height: 20, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
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
                markedDates={markedDates} // Gắn danh sách ngày đánh dấu
                markingType="custom" // Bắt buộc khi dùng customStyles
                scrollEnabled={true}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const $root: SViewStyle = [
  style.flex_1,
  style.center,
  {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
];
const $modal: SViewStyle = [
  {width: spacing.screenWidth / 1.1, borderRadius: scale.x(12, 12 * 1.5)},
  style.shadow,
  style.p_xs,
];
