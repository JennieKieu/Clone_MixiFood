import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../RTK';
import {
  EUserType,
  selectIsLogin,
  selectUserInfo,
  selectUserType,
  updateCurrentOrderIdAtSeat,
} from '../../store';
import socketClient from '../../socket/socketClient';
import {Alert} from 'react-native';
import {useAppState} from '../useAppState';

export const useRestaurantSocket = (deps: any[]) => {
  const {state} = useAppState();
  const selectedUserType = useAppSelector(selectUserType);
  const restaurantId =
    selectedUserType === EUserType.employee
      ? useAppSelector(selectUserInfo)?.restaurantId
      : useAppSelector(selectUserInfo)?._id;
  const isLogin = useAppSelector(selectIsLogin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (isLogin && restaurantId) {
        if (!socketClient.getSocket()) socketClient.connect();
        socketClient.joinRestaurant(restaurantId);
        socketClient.receiveMessage();
      } else {
        socketClient.disconnect();
      }

      //   socketClient
      //     .getSocket()
      //     ?.on(
      //       'onEmployeeOrderAtSeat',
      //       (data: {seatId: string; currentOrderId: string}) => {
      //         console.log('on Daaaad', data);

      //         dispatch(updateCurrentOrderIdAtSeat(data));
      //       },
      //     );
    })();

    return () => {
      socketClient.disconnect();
    };
  }, [...deps, isLogin, restaurantId, state]);
};
