import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../components/Layout/Layout';
import {AppStackParamList} from '../../../navigators';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert, TouchableOpacity, View} from 'react-native';
import {palette, scale, scaleFontSize, spacing, style} from '../../../theme';
import {useLoader} from '../../../contexts/loader-provider';
import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {userApi} from '../../../api/userApi';
import {
  TSeatingByBooking,
  TSelectSeatingByUser,
} from '../../../models/UserModel';
import {Text} from '@rneui/themed';
import {STextStyle, SViewStyle} from '../../../models';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {ELoaderType} from '../../../components/AppLoader';
import {delay} from '../../../utils';
import {AppButton} from '../../../components/AppButton';
import {useTranslation} from 'react-i18next';
import {useSelectingSeatingByBookingSocket} from '../../../hooks/UserSocket/booking';
import bookingSocketClient from '../../../socket/userSocket/bookingSocketClient';
import {useAppSelector} from '../../../hooks';
import {selectUserId} from '../../../store';
import useCountDown from '../../../hooks/useCountDown';
import {secondToMinuteStr} from '../../../utils/number';
import {TUserCreateSeatingBooking} from '../../../api/user.api.types';

export type TSelecSeatingScreenProps = {
  restaurantId: string;
  numberOfAdults: number;
  numberOfChildren: number;
  bookingTime: Date;
  seatingId?: string;
};

export const SelecSeatingScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'SelecSeatingScreen'>
> = props => {
  const {t} = useTranslation();
  const loader = useLoader();
  const {start, value, intervalId} = useCountDown(300, true);

  const {
    bookingTime,
    numberOfAdults,
    numberOfChildren,
    restaurantId,
    seatingId,
  } = props.route.params.data;

  const userId = useAppSelector(selectUserId);

  const {seatings, handleSelectedSeating, selectedSeating} =
    useSelectingSeatingByBookingSocket(
      [],
      {
        dateTime: bookingTime.toISOString(),
        restaurantId: restaurantId,
      },
      restaurantId,
      bookingTime,
    );

  useEffect(() => {
    loader.show(ELoaderType.foodLoader1);
    const fetchSeatingsByBooking = async () => {
      await delay(2000);

      loader.hide();
    };
    fetchSeatingsByBooking();

    return () => {
      bookingSocketClient.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!bookingSocketClient.getSocket()) Alert.alert('disconnect');
  }, [bookingSocketClient.getSocket()]);

  const countDown = useMemo(() => {
    return secondToMinuteStr(value);
  }, [value]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AppImage source={images.angle_left1} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View>
          <Text>{countDown}</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    });
  }, []);

  const handleConfirm = async () => {
    loader.show(ELoaderType.foodLoader1);
    if (selectedSeating) {
      const data: TUserCreateSeatingBooking = {
        restaurantId: restaurantId,
        numberOfAdults: numberOfAdults,
        numberOfChildren: numberOfChildren,
        bookingTime: bookingTime,
        seatingId: selectedSeating?._id,
      };
      try {
        const response = await userApi.createUserSeatingBooking(data);
        if (response.data.success) {
          Alert.alert(t('common.success'));
        }
        loader.hide();
      } catch (error) {
        Alert.alert(t('common.fail'));
        loader.hide();
      }
    }
  };

  return (
    <Layout style={style.justify_between} safeAreaOnBottom>
      <ScrollView>
        <View style={[style.row_wrap, style.center, style.mb_md]}>
          {seatings.map(item => {
            const isSelectedByOther = item.isSelectByBooking.some(
              select => select.userId && select.userId !== userId,
            );

            return (
              <TouchableOpacity
                key={item._id}
                style={[
                  $seatBtn,
                  {
                    backgroundColor:
                      selectedSeating?._id === item._id
                        ? palette.primary4
                        : isSelectedByOther
                        ? palette.gray5
                        : undefined,
                  },
                ]}
                disabled={
                  isSelectedByOther || selectedSeating?._id === item._id
                }
                onPress={() => handleSelectedSeating(item)}>
                <View>
                  <Text style={$seatName}>{item.seatName}</Text>
                </View>
                <View style={[style.row_center, style.mt_sm]}>
                  <AppImage
                    source={images.users}
                    style={{marginRight: spacing.xs}}
                  />
                  <Text>{item.maxOfPeople}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View>
        <AppButton
          txTitle="common.confirm"
          type="solid"
          style={style.mx_md}
          onPress={handleConfirm}
        />
      </View>
    </Layout>
  );
};

const $seatBtn: SViewStyle = [
  {
    borderWidth: 1,
    borderRadius: spacing.sm,
    width: scale.x(spacing.screenWidth / 5, spacing.screenWidth / 4),
  },
  style.mx_xs,
  style.center,
  style.py_sm,
  style.mb_sm,
];
const $seatName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(14)},
];
