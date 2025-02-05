import {Button, Text} from '@rneui/themed';
import {Layout} from '../../../components/Layout/Layout';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {palette, scaleFontSize, spacing, style} from '../../../theme';
import {SViewStyle} from '../../../models';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from 'react-native-calendars';
import {Dispatch, SetStateAction, useRef, useState} from 'react';
import {AppCalendarBottomSheet} from '../../../components/AppCalendarBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  addHours,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import {vi, enAU} from 'date-fns/locale';
import i18n from '../../../i18n/i18n';
import {TFilterDefault} from '../../../api/api.types';
import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {TFilterDrawerParamlist} from './Drawer';
import {formattedDateDMY} from '../../../utils';

export type FilterContentDrawerProps = {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  handleApplyFilter: (input: TFilterDefault, selectedDate?: Date) => void;
  filter: TFilterDefault;
  setFilter: Dispatch<SetStateAction<TFilterDefault>>;
  navigation: any;
};

export const FilterContentDrawer: React.FC<FilterContentDrawerProps> = ({
  selectedDate,
  setSelectedDate,
  handleApplyFilter,
  filter,
  setFilter,
  navigation,
}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const [selectedDateTemp, setSelectedDateTemp] = useState<string>(
    format(selectedDate, 'yyyy-MM-dd'),
  );
  const currentLocale = i18n.language === 'vi' ? vi : enAU;
  // const [isFilter] =
  const AppCalendarBottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenAppCanlender = () => {
    AppCalendarBottomSheetRef.current?.present();
  };

  const currentDate = format(new Date(selectedDateTemp), 'EEE, dd/MM/yyyy', {
    locale: currentLocale,
  });

  const handleDefaultFilterChange = (input: TFilterDefault) => {
    setFilter(input);
    input !== 'DAY' && setSelectedDateTemp(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleApply = (input: TFilterDefault) => {
    navigation.closeDrawer();
    handleApplyFilter(
      input,
      filter === 'DAY' ? new Date(selectedDateTemp) : undefined,
    );
  };

  return (
    <Layout safeAreaOnBottom style={style.justify_between} safeAreaOnTop>
      <View style={style.mx_sm}>
        <View
          style={[
            style.pb_md,
            {borderBottomWidth: 1, borderColor: colorScheme.default},
          ]}>
          <Text>filter</Text>

          <View style={[style.row_center, style.mt_sm]}>
            <TouchableOpacity
              style={[
                $selectTimeBtn,
                {backgroundColor: colorScheme.default},
                filter === 'DAY' && $activeSelectTimeBtn,
              ]}
              onPress={() => handleDefaultFilterChange('DAY')}>
              <Text>{t('time.day')}</Text>
            </TouchableOpacity>
            <Text>|</Text>
            <TouchableOpacity
              style={[
                $selectTimeBtn,
                {backgroundColor: colorScheme.default},
                filter === 'WEEK' && $activeSelectTimeBtn,
              ]}
              onPress={() => handleDefaultFilterChange('WEEK')}>
              <Text>{t('time.week')}</Text>
            </TouchableOpacity>
            <Text>|</Text>
            <TouchableOpacity
              style={[
                $selectTimeBtn,
                {backgroundColor: colorScheme.default},
                filter === 'MONTH' && $activeSelectTimeBtn,
              ]}
              onPress={() => handleDefaultFilterChange('MONTH')}>
              <Text>{t('time.month')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            disabled={filter !== 'DAY'}
            style={[$selectDateBtn, filter !== 'DAY' && {opacity: 0.5}]}
            onPress={handleOpenAppCanlender}>
            <Text style={style.tx_font_bold}>{currentDate}</Text>
            <AppImage
              source={images.chevron_down}
              style={{marginLeft: spacing.sm}}
            />
          </TouchableOpacity>
        </View>
        <View style={style.row_between}>
          <TouchableOpacity
            style={[$calendarBtn, {backgroundColor: colorScheme.default}]}>
            <View>
              <Text>Từ ngày</Text>
              <Text>
                {filter === 'DAY' &&
                  formattedDateDMY(addHours(startOfDay(new Date()), 7))}
                {filter === 'WEEK' &&
                  formattedDateDMY(addHours(startOfWeek(new Date()), 7))}
                {filter === 'MONTH' &&
                  formattedDateDMY(addHours(startOfMonth(new Date()), 7))}
              </Text>
            </View>
            <AppImage source={images.calendar1}></AppImage>
          </TouchableOpacity>
          <TouchableOpacity
            style={[$calendarBtn, {backgroundColor: colorScheme.default}]}>
            <View>
              <Text>Đến ngày</Text>
              <Text>
                {' '}
                {filter === 'DAY' &&
                  formattedDateDMY(addHours(endOfDay(new Date()), 7))}
                {filter === 'WEEK' &&
                  formattedDateDMY(addHours(endOfWeek(new Date()), 7))}
                {filter === 'MONTH' &&
                  formattedDateDMY(addHours(endOfMonth(new Date()), 7))}
              </Text>
            </View>
            <AppImage source={images.calendar1}></AppImage>
          </TouchableOpacity>
        </View>
      </View>
      <View style={$footer}>
        <Button
          type="outline"
          title={t('common.reset')}
          containerStyle={$footerBtn}
          buttonStyle={{height: scaleFontSize(40)}}
        />
        <Button
          type="solid"
          title={t('common.apply')}
          containerStyle={$footerBtn}
          buttonStyle={{height: scaleFontSize(40)}}
          onPress={() => handleApply(filter)}
        />
      </View>

      <AppCalendarBottomSheet
        bottomSheetModalRef={AppCalendarBottomSheetRef}
        selectedDate={selectedDateTemp}
        SetSelectedDate={setSelectedDateTemp}
      />
    </Layout>
  );
};

const $footer: SViewStyle = [style.mx_md, style.row_between];
const $footerBtn: SViewStyle = [{width: '48%'}];
const $calendarBtn: SViewStyle = [
  style.row_between,
  style.shadow,
  style.p_sm,
  {width: '48%', borderRadius: 10},
];
const $selectTimeBtn: SViewStyle = [{width: '30%'}, style.p_xxs, style.center];
const $activeSelectTimeBtn: SViewStyle = [
  {backgroundColor: palette.primary6, borderRadius: 8},
  style.my_sm,
];
const $selectDateBtn: SViewStyle = [style.row, style.my_sm];
