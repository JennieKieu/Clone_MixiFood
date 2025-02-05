import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../../components/Layout/Layout';
import {AppStackParamList} from '../../../../navigators';
import {useEffect, useLayoutEffect, useState} from 'react';
import {AppButton} from '../../../../components/AppButton';
import {Text} from '@rneui/themed';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {spacing, style} from '../../../../theme';
import {SViewStyle} from '../../../../models';
import {TSeatingBookingRequest} from './SeatingBookingRequestScreen.types';
import {restaurantApi} from '../../../../api/restaurantApi';
import {ESeatingBookingStatus} from '../../../../api/api.types';
import {useLoader} from '../../../../contexts/loader-provider';
import {ELoaderType} from '../../../../components/AppLoader';
import moment from 'moment';

export const SeatingBookingRequestScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'SeatingBookingRequestScreen'>
> = props => {
  const [bookings, setBookings] = useState<TSeatingBookingRequest[]>([]);
  const loader = useLoader();

  useEffect(() => {
    (async () => {
      loader.show(ELoaderType.foodLoader1);
      try {
        const response = await restaurantApi.getRequestSeatingBooking(
          ESeatingBookingStatus.pending,
        );

        if (response.data.success) {
          setBookings([...response.data.bookings]);
        }
      } catch (error) {
      } finally {
        loader.hide();
      }
    })();
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerBackVisible: true,
      headerTitle: 'Booking Request',
      headerTitleAlign: 'center',
    });
  }, []);

  return (
    <Layout safeAreaOnTop>
      <ScrollView>
        <View style={style.mx_sm}>
          {bookings.map(item => (
            <TouchableOpacity style={$bookingRequestBtn} key={item._id}>
              <View>
                <Text>{item.contactPhoneNumber}</Text>
              </View>
              <View>
                <Text>{moment(item.bookingTime).format('DD/MM/YYYY HH:mm')}</Text>
                <Text>{item.seatingName || ''}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
};

const $bookingRequestBtn: SViewStyle = [
  style.row_between,
  {borderWidth: 1, borderRadius: spacing.sm},
  style.p_sm,
];
