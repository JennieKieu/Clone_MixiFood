import {useEffect, useState} from 'react';
import {useAppDispatch} from '../RTK';
import {restaurantApi} from '../../api/restaurantApi';
import {TSeatingForStore} from '../../models';
import {
  createOrEditSeatingByEmployee,
  resetSettings,
  resetSettingsByEmployee,
  updateCurrentOrderIdAtSeat,
} from '../../store';
import {employeeApi} from '../../api/employeeApi';
import socketClient from '../../socket/socketClient';
import {useAppState} from '../useAppState';
import {TInvoice} from '../../models/invoice';
import {useLoader} from '../../contexts/loader-provider';

export const useFetchSeating = (deps: any[], isEmployee?: boolean) => {
  const dispatch = useAppDispatch();
  const {state} = useAppState();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const loader = useLoader();

  const boostrapAsync = async () => {
    if (!isEmployee) {
      try {
        const response = await restaurantApi.getAllSeat();
        // console.log(response.data.seats);
        if (response.data.seats) {
          const data: TSeatingForStore[] = response.data.seats;
          dispatch(resetSettings(data));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await employeeApi.getAllSeating();
        // console.log(response.data.seats);
        if (response.data.seats) {
          const data: TSeatingForStore[] = response.data.seats;
          dispatch(resetSettingsByEmployee(data));
        }
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const response = await employeeApi.getAllSeating();
      if (response.data.seats) {
        const data: TSeatingForStore[] = response.data.seats;
        dispatch(resetSettingsByEmployee(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refresh = async () => {
    if (refreshing) return;

    setRefreshing(true);
    await boostrapAsync();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!socketClient.getSocket()) {
      socketClient.connect();
    }
    socketClient
      .getSocket()
      ?.on(
        'onEmployeeOrderAtSeat',
        (data: {seatId: string; currentOrderId: string}) => {
          console.log('on Daaaad', data);

          dispatch(updateCurrentOrderIdAtSeat(data));
        },
      );
    socketClient
      .getSocket()
      ?.on('onCreateManySeat', (data: TSeatingForStore[]) => {
        console.log('on Daaaad', data);

        dispatch(
          isEmployee ? resetSettingsByEmployee(data) : resetSettings(data),
        );
      });
    // on seat change
    socketClient.getSocket()?.on('onSeatChange', (data: TSeatingForStore) => {
      if (isEmployee) dispatch(createOrEditSeatingByEmployee([data]));
    });

    // if (!isEmployee) {
    //   (async () => {
    //     try {
    //       const response = await restaurantApi.getAllSeat();
    //       // console.log(response.data.seats);
    //       if (response.data.seats) {
    //         const data: TSeatingForStore[] = response.data.seats;
    //         dispatch(resetSettings(data));
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   })();
    // } else {
    //   (async () => {
    //     try {
    //       const response = await employeeApi.getAllSeating();
    //       // console.log(response.data.seats);
    //       if (response.data.seats) {
    //         const data: TSeatingForStore[] = response.data.seats;
    //         dispatch(resetSettingsByEmployee(data));
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   })();
    // }

    boostrapAsync();
  }, [...deps, state]);

  return {
    refresh,
  };
};
