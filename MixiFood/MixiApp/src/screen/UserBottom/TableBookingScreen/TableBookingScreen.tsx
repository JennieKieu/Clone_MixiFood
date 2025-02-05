import {useTranslation} from 'react-i18next';
import {Layout} from '../../../components/Layout/Layout';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {
  Keyboard,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {Button, Text} from '@rneui/themed';
import {palette, scale, scaleFontSize, spacing, style} from '../../../theme';
import {STextStyle, SViewStyle} from '../../../models';
import {AppButton} from '../../../components/AppButton';
import {AppModalCalendar} from '../../../components/AppModalCalendar';
import {
  addMinutes,
  format,
  setHours,
  setMinutes,
  startOfDay,
  subMinutes,
} from 'date-fns';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {TSelecSeatingScreenProps} from '../SelectSeatingScreen';

export const TableBookingScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'TableBookingScreen'>
> = props => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const insert = useSafeAreaInsets();

  const [timeModalVisible, setTimeModalVisible] = useState<boolean>(false);
  const [numberOfAdults, setNumberOfAdults] = useState<number>(2);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [modalCalendarVisible, setModalCalenDarVisible] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [selectedTime, setSelectedTime] = useState<Date>();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AppImage source={images.angle_left1} />
        </TouchableOpacity>
      ),
      headerTitle: 'Restaurant name',
    });
  }, []);

  const generateAvailableTimes = useMemo(() => {
    const start = setMinutes(setHours(startOfDay(new Date()), 6), 0);
    const end = setMinutes(setHours(startOfDay(new Date()), 22), 0);
    const interval = 15;
    const times = [];

    let current = start;
    while (current <= end) {
      times.push(current);
      current = addMinutes(current, interval);
    }

    return times;
  }, []);

  const selectedDefaultTime = useMemo(() => {
    if (!generateAvailableTimes || generateAvailableTimes.length === 0) {
      return null;
    }
    const validTime = generateAvailableTimes.find(
      time => time >= subMinutes(new Date(), -15),
    );
    return (
      (!selectedTime ? validTime : selectedTime) || generateAvailableTimes[0]
    );
  }, [generateAvailableTimes, selectedTime]);

  const handleApplySelecTime = () => {
    setTimeModalVisible(false);
  };

  const handleNextPress = () => {
    if (selectedDefaultTime) {
      const bookingDateTime = setHours(
        setMinutes(new Date(selectedDate), selectedDefaultTime.getMinutes()),
        selectedDefaultTime.getHours(),
      );
      const dataByBooking: TSelecSeatingScreenProps = {
        restaurantId: props.route.params.restaurantId,
        numberOfAdults: numberOfAdults,
        numberOfChildren: numberOfChildren,
        bookingTime: bookingDateTime,
      };

      props.navigation.navigate('SelecSeatingScreen', {data: dataByBooking});
    }
  };

  return (
    <Layout style={style.justify_between} safeAreaOnBottom>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.isVisible() && Keyboard.dismiss()}>
        <ScrollView>
          <View style={style.mx_sm}>
            <Text>{t('tableBooking.bookingInfomation')}</Text>
            <View style={$bookingInfomation}>
              <AppImage
                source={images.user}
                style={{marginRight: spacing.sm}}
              />
              <View style={$bookingInfomationRight}>
                <View style={style.row_center}>
                  <View style={[{width: '40%'}]}>
                    <Text>{t('tableBooking.numberOfAdults')}:</Text>
                  </View>
                  <View style={[style.row_center]}>
                    <AppButton
                      type="solid"
                      title="-"
                      titleStyle={$volumnText}
                      style={$volumnBtn}
                      disabled={numberOfAdults <= 1}
                      onPress={() => {
                        setNumberOfAdults(prev => (prev > 1 ? --prev : prev));
                      }}
                    />
                    <View style={$numberOfPeople}>
                      <Text>{numberOfAdults}</Text>
                    </View>
                    <AppButton
                      type="solid"
                      title="+"
                      titleStyle={$volumnText}
                      style={$volumnBtn}
                      onPress={() => setNumberOfAdults(prev => ++prev)}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={$bookingInfomation}>
              <AppImage
                source={images.children}
                style={{marginRight: spacing.sm}}
              />
              <View style={$bookingInfomationRight}>
                <View style={style.row_center}>
                  <View style={[{width: '40%'}]}>
                    <Text>{t('tableBooking.numberOfChildren')}:</Text>
                  </View>
                  <View style={[style.row_center]}>
                    <AppButton
                      type="solid"
                      title="-"
                      titleStyle={$volumnText}
                      style={$volumnBtn}
                      disabled={numberOfChildren === 0}
                      onPress={() =>
                        setNumberOfChildren(prev => (prev > 0 ? --prev : prev))
                      }
                    />
                    <View style={$numberOfPeople}>
                      <Text>{numberOfChildren}</Text>
                    </View>
                    <AppButton
                      type="solid"
                      title="+"
                      titleStyle={$volumnText}
                      style={$volumnBtn}
                      onPress={() => setNumberOfChildren(prev => ++prev)}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/*  */}
            <View style={$bookingInfomation}>
              <AppImage
                source={images.calendar2}
                style={{marginRight: spacing.sm}}
              />
              <View style={$bookingInfomationRight}>
                <View style={style.row_between}>
                  <View style={[{width: '40%'}]}>
                    <Text>{t('tableBooking.date')}:</Text>
                  </View>
                  <View style={[style.row_center]}>
                    <AppButton
                      title={format(new Date(selectedDate), 'dd/MM/yyyy')}
                      onPress={() => setModalCalenDarVisible(true)}
                    />
                  </View>
                </View>
                <View style={{}}>
                  <TouchableOpacity>
                    <AppImage source={images.chevron_down} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/*  */}
            <View style={$bookingInfomation}>
              <AppImage
                source={images.clock1}
                style={{marginRight: spacing.sm}}
              />
              <View style={$bookingInfomationRight}>
                <View style={style.row_between}>
                  <View style={[{width: '40%'}]}>
                    <Text>{t('tableBooking.time')}:</Text>
                  </View>
                  <View style={[style.row_center]}>
                    <AppButton
                      title={
                        (selectedDefaultTime &&
                          format(selectedDefaultTime, 'HH:mm')) ||
                        ''
                      }
                      onPress={() => setTimeModalVisible(true)}
                    />
                  </View>
                </View>
                <View style={{}}>
                  <TouchableOpacity>
                    <AppImage source={images.chevron_down} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/*  */}
          </View>
          <View style={$section} />
          <View style={style.mx_sm}>
            <View style={[style.row_center]}>
              <AppImage
                resizeMode="contain"
                source={images.note}
                style={{marginRight: spacing.sm}}
              />
              <View style={[style.row_between, style.flex_1]}>
                <View style={style.row_between}>
                  <View style={[{width: '40%'}]}>
                    <Text>{t('tableBooking.note')}</Text>
                  </View>
                  <TextInput
                    placeholder={t('tableBooking.noteInput')}
                    style={$noteInput}
                    multiline
                    maxLength={150}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={$section} />
          {/* selected table ? */}
        </ScrollView>
      </TouchableWithoutFeedback>

      <AppButton
        txTitle="common.continue"
        type="solid"
        style={style.mx_lg}
        onPress={handleNextPress}
      />

      <AppModalCalendar
        setModalVisible={setModalCalenDarVisible}
        modalVisible={modalCalendarVisible}
        SetSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />

      <Modal transparent visible={timeModalVisible} animationType="slide">
        <SafeAreaView
          style={[$modal, {backgroundColor: colorScheme.background}]}>
          <View style={[style.mx_sm]}>
            {/* header */}
            <View style={style.row_between}>
              <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
                <AppImage source={images.xmark_solid} />
              </TouchableOpacity>
              <View style={{width: '60%'}}>
                <Text style={[$availbleTimeText, {flexWrap: 'wrap'}]}>
                  Giờ có sẵn trong ngày {format(selectedDate, 'dd/MM/yyyy')}
                </Text>
              </View>
              <View></View>
            </View>
          </View>
          <View style={$modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[style.row_wrap, style.justify_center]}>
                {generateAvailableTimes.map((time, index) => {
                  const isFutureDate =
                    new Date(selectedDate).setHours(0, 0, 0, 0) >
                    new Date().setHours(0, 0, 0, 0);

                  const isPastDate =
                    new Date(selectedDate).setHours(0, 0, 0, 0) <
                    new Date().setHours(0, 0, 0, 0);

                  const isDisable =
                    isPastDate ||
                    (!isFutureDate && time < subMinutes(new Date(), -15));

                  const defaultTime =
                    selectedDefaultTime && format(selectedDefaultTime, 'HH:mm');

                  return (
                    <TouchableOpacity
                      key={time.toString()}
                      style={[
                        $timeBtn,
                        {borderColor: palette.gray10},
                        isDisable && {backgroundColor: palette.gray5},
                        defaultTime &&
                          defaultTime === format(time, 'HH:mm') && {
                            backgroundColor: palette.primary4,
                          },
                      ]}
                      disabled={isDisable}
                      onPress={() => setSelectedTime(time)}>
                      <Text>{format(time, 'HH:mm')}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
          <View style={[{marginBottom: spacing.sm}]}>
            <AppButton
              title="Apply"
              type="solid"
              style={style.mx_xl}
              onPress={handleApplySelecTime}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </Layout>
  );
};

const $bookingInfomation: SViewStyle = [
  style.row,
  style.justify_center,
  style.mt_sm,
];
const $bookingInfomationRight: SViewStyle = [
  style.row_between,
  style.flex_1,
  {borderBottomWidth: 1, borderColor: palette.gray5},
  style.pb_md,
];
const $numberOfPeople: SViewStyle = [
  {borderWidth: 1},
  style.px_sm,
  {height: scale.y(30, 30 * 1.5), borderRadius: 8},
  style.center,
  style.mx_xs,
];
const $volumnBtn: SViewStyle = [{height: scale.y(30, 30 * 1.5)}];
const $volumnText: STextStyle = [{paddingHorizontal: spacing.xs}];
const $modal: SViewStyle = [style.flex_1, style.justify_between];
const $availbleTimeText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(14)},
  style.tx_center,
];
const $modalContent: SViewStyle = [style.flex_1, style.mt_md, style.mb_xxl];
const $timeBtn: SViewStyle = [
  {borderWidth: 1, borderRadius: 999},
  style.mx_xxs,
  style.mb_xs,
  style.px_md,
  style.py_sm,
];
const $timeBtnDisable: SViewStyle = [];
const $selectedTime: SViewStyle = [];
const $section: SViewStyle = [
  style.flex_1,
  {height: spacing.md, backgroundColor: palette.gray6},
  style.my_md,
];
const $noteInput: SViewStyle = [
  {borderWidth: 1, borderRadius: spacing.xs, borderColor: palette.gray10},
  style.flex_1,
  style.p_sm,
];
