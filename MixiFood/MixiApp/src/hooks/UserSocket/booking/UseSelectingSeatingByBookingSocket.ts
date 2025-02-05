import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import bookingSocketClient, {
  TJoinBookingGroupData,
} from '../../../socket/userSocket/bookingSocketClient';
import {
  TSeatingByBooking,
  TSelectSeatByBooking,
  TSelectSeatingByUser,
} from '../../../models/UserModel';
import {appAuthentication} from '../../../services/Authentication';
import {useAppSelector} from '../../RTK';
import {selectUserInfo} from '../../../store';
import {useLoader} from '../../../contexts/loader-provider';
import {Alert} from 'react-native';

export type TSelectingSeatingSocket = {};

export const useSelectingSeatingByBookingSocket = (
  deps: any[],
  joinBookiData: TJoinBookingGroupData,
  restaurantId: string,
  dateTime: Date,
) => {
  const token = appAuthentication.getToken();
  const [seatings, setSeatings] = useState<TSeatingByBooking[]>([]);
  const [selectedSeating, setSelectedSeating] = useState<TSeatingByBooking>();
  const loader = useLoader();

  const userInfor = useAppSelector(selectUserInfo);

  const handleSelectedSeating = (seat: TSeatingByBooking) => {
    selectedSeating &&
      bookingSocketClient.onRemoveSelectedSeating(selectedSeating);
    setSelectedSeating(prev => seat);

    const data: TSelectSeatingByUser = {
      restaurantId,
      dateTime,
      seatId: seat._id,
    };

    bookingSocketClient.onSelectSeating(data);
  };

  useEffect(() => {
    if (!bookingSocketClient.getSocket()) {
      bookingSocketClient.connect(token);
    }
    bookingSocketClient.joinBookingGroup(joinBookiData);

    bookingSocketClient.getSeatings({restaurantId});
    bookingSocketClient
      .getSocket()
      ?.on('seatings', (data: TSeatingByBooking[]) => {
        // console.log('Received seatings:', data);
        setSeatings(data);

        const mySelected = data.find(item => {
          return item.isSelectByBooking.find(
            item => item.userId === userInfor?._id,
          );
        });
        mySelected && setSelectedSeating(mySelected);
      });

    //
    bookingSocketClient.getSocket()?.on('onSeatSelected', (data: any) => {
      // console.log('adxzc', data);

      if (data.success) {
        const updatedSeat: TSeatingByBooking[] =
          data?.seatings && data.seatings; // Thông tin ghế mới nhận
        const removedSeat: TSeatingByBooking = data?.removed && data.removed;

        // updatedSeat.isSelectByBooking.some(x => x.userId === userInfor?._id) &&
        //   userInfor &&
        //   setSelectedSeating(prev => updatedSeat);

        // updatedSeat &&
        //   setSeatings(prev =>
        //     prev.map(seat =>
        //       seat._id === updatedSeat._id ? {...seat, ...updatedSeat} : seat,
        //     ),
        //   );
        setSeatings(updatedSeat);
      } else {
        if (!selectedSeating) setSelectedSeating(undefined);
        Alert.alert('Cannot selected');
      }
    });

    // removed selecting by other user
    // bookingSocketClient
    //   .getSocket()
    //   ?.on('onOtherUserRemove', (data: TSeatingByBooking) => {
    //     setSeatings(prev =>
    //       prev.map(seat => (seat._id === data._id ? {...seat, ...data} : seat)),
    //     );
    //   });
  }, [...deps]);

  return {
    seatings,
    handleSelectedSeating,
    selectedSeating,
  };
};
