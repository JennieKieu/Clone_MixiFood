import {CompositeScreenProps} from '@react-navigation/native';
import {Layout} from '../../../components/Layout/Layout';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {AppEmployeeBottomTabbarParamList} from '../../../navigators/EmployeeBottomTab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {useFetchSeating} from '../../../hooks/Seating';
import {useAppSelector} from '../../../hooks';
import {
  selectIsLogin,
  selectSeatingsByEmployee,
  selectUserInfo,
} from '../../../store';
import {Text} from '@rneui/themed';
import {ScrollView} from 'react-native-gesture-handler';
import {RefreshControl, TouchableOpacity, View} from 'react-native';
import {STextStyle, SViewStyle} from '../../../models';
import {palette, scale, scaleFontSize, spacing, style} from '../../../theme';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {useFetchFoods} from '../../../hooks/Food';
import socketClient from '../../../socket/socketClient';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {useRestaurantSocket} from '../../../hooks/restaurantSocket';
import {useFetchOrder} from '../../../hooks/Ordes';
import {useTranslation} from 'react-i18next';
import {Dropdown} from 'react-native-element-dropdown';
import {ESeatingStatus, TSeatingStautsFilter} from './HomeScreen.types';
import {TxKeyPath} from '../../../i18n';

export const HomeScreen: React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<AppEmployeeBottomTabbarParamList, 'Home'>,
    NativeStackScreenProps<AppStackParamList>
  >
> = props => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();

  const seatings = useAppSelector(selectSeatingsByEmployee);
  const restaurantId = useAppSelector(selectUserInfo)?.restaurantId;
  const isLogin = useAppSelector(selectIsLogin);

  const [selectedFilter, setSelectedFilter] = useState<ESeatingStatus>(
    'all' as ESeatingStatus,
  );

  const filterData: TSeatingStautsFilter[] = [
    {label: 'all' as ESeatingStatus, value: t('common.all') as TxKeyPath},
    ...Object.values(ESeatingStatus)
      .filter(x => x !== ESeatingStatus.ready)
      .map(status => ({
        label: status,
        value: t(`seatingStatus.${status}`) as TxKeyPath,
      })),
  ];

  useFetchFoods([], true);
  const seatingHook = useFetchSeating([], true);
  useFetchOrder([], true);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View style={style.row}>
          <View style={[style.row_center, {gap: spacing.sm}]}>
            <View style={[$box, {backgroundColor: palette.primary1}]} />
            <Text>{t('seatingStatus.serving')}</Text>
            <View style={[$box, {backgroundColor: palette.blue2}]} />
            <Text>{t('seatingStatus.booking')}</Text>
            <View style={[$box, {backgroundColor: palette.gray7}]} />
            <Text>{t('seatingStatus.paying')}</Text>
          </View>
        </View>
      ),
    });
  }, []);

  const handleSelectSeat = (seatId: string) => {
    props.navigation.navigate('OrderTabsScreen', {seatId: seatId});
  };

  const seatingsByFillter = useMemo(() => {
    if (selectedFilter === ('all' as ESeatingStatus)) return seatings;

    return seatings.filter(seat => seat.status === selectedFilter);
  }, [selectedFilter, seatings]);

  const onRefresh = useCallback(() => seatingHook.refresh(), []);

  return (
    <Layout>
      <View style={[style.mx_sm, style.row_between, style.mb_sm]}>
        <Dropdown
          data={filterData}
          labelField="value"
          placeholder={t('comon.filter')}
          valueField={'label'}
          style={$dropdown}
          value={selectedFilter}
          onChange={item => setSelectedFilter(item.label)}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[palette.primary1]}
            refreshing={false}
            onRefresh={onRefresh}
          />
        }>
        <View style={$innerContainer}>
          <View style={[style.row_between, style.row_wrap]}>
            {seatingsByFillter.map(seat => {
              const isOrder = seat.currentOrderId && palette.primary1;
              const backgroundColorByStatus =
                seat.status === ESeatingStatus.serving
                  ? palette.primary1
                  : seat.status === ESeatingStatus.paying
                  ? palette.gray7
                  : 'white';

              return (
                <TouchableOpacity
                  onPress={() => handleSelectSeat(seat._id)}
                  style={[
                    $seatBtn,
                    {borderColor: colorScheme.text},
                    {backgroundColor: backgroundColorByStatus},
                  ]}
                  key={seat._id}>
                  <Text style={$seatNameText}>{seat.seatName}</Text>
                  <View style={style.row_center}>
                    <Text style={style.mx_xs}>{seat.maxOfPeople}</Text>
                    <AppImage source={images.users}></AppImage>
                  </View>

                  {/* {seat.currentOrderId && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        backgroundColor: palette.primary5,
                        position: 'absolute',
                        top: 4,
                        right: 4,
                      }}
                    />
                  )} */}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const $innerContainer: SViewStyle = [style.mx_sm];
const $seatBtn: SViewStyle = [
  {
    // width: '30%',
    width: scale.x(spacing.screenWidth * 0.25, spacing.screenWidth / 6),
    borderWidth: 1,
    borderRadius: 12,
  },
  style.p_sm,
  style.mb_sm,
  style.center,
];
const $seatNameText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(14)},
  style.tx_center,
  style.pb_sm,
];
const $box: SViewStyle = [{width: spacing.sm, height: spacing.sm}];
const $dropdown: SViewStyle = [
  {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  style.fill_center,
];
