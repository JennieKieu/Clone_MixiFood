import {useEffect} from 'react';
import {employeeApi} from '../../api/employeeApi';
import {TPendingOrder} from '../../models';
import {useAppDispatch, useAppSelector} from '../RTK';
import {
  createOrEditPendingOrderItemByEmployee,
  removePendingOrderItem,
  resetPendingOrderItemsByEmployee,
  selectPendingOrderItemByEmp,
} from '../../store';
import socketClient from '../../socket/socketClient';
import {TOrderedFoodStatus} from '../../models/order';
import {TKitchenChangeFoodItemsStatus} from '../../api/api.types';
import {useAppState} from '../useAppState';

export const useFetchPendingOrderFoodItems = (
  deps: any[],
  isEmployee?: boolean,
) => {
  const dispatch = useAppDispatch();
  const pendingOrderItems = useAppSelector(selectPendingOrderItemByEmp) || [];
  const {state} = useAppState();

  useEffect(() => {
    if (!socketClient.getSocket()) socketClient.connect();

    const fetchPendingOrderItem = async () => {
      try {
        const response = await employeeApi.getPendingFoodItems();

        if (response.data.pendingOrders) {
          const data: TPendingOrder[] = response.data.pendingOrders;
          dispatch(resetPendingOrderItemsByEmployee(data));
        }
      } catch (error) {
        console.log(error);
        // Alert.alert(t('common.fail', t('errorMessage.internet')));
      }
    };

    socketClient
      .getSocket()
      ?.on('onEmployeeNewOrder', (data: TPendingOrder) => {
        const pendingItems = data.pendingFoodItems.filter(
          item => item.status === 'pending',
        );
        const pendingOrder: TPendingOrder = {
          orderId: data.orderId, // Sử dụng orderId từ dữ liệu nhận được
          pendingFoodItems: pendingItems,
          seatId: data.seatId,
        };
        dispatch(createOrEditPendingOrderItemByEmployee([pendingOrder]));
      });

    socketClient
      .getSocket()
      ?.on(
        'onKitchenChangeOrderStatus',
        (data: {
          orderId: string;
          foodItemId: string;
          status: TOrderedFoodStatus;
        }) => {
          if (!pendingOrderItems) {
            fetchPendingOrderItem();
          }
          const index = pendingOrderItems.findIndex(
            item => item.orderId === data.orderId,
          );
          if (!index) {
            fetchPendingOrderItem();
          } else {
            const dispatchData: TKitchenChangeFoodItemsStatus = {
              orderId: data.orderId,
              foodItemId: data.foodItemId,
              status: data.status === 'serve' ? 'complete' : 'cancel',
            };
            dispatch(removePendingOrderItem(dispatchData));
          }
        },
      );

    // (async () => {
    //   try {
    //     const response = await employeeApi.getPendingFoodItems();
    //     if (response.data.pendingOrders) {
    //       const data: TPendingOrder[] = response.data.pendingOrders;
    //       dispatch(resetPendingOrderItemsByEmployee(data));
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     // Alert.alert(t('common.fail', t('errorMessage.internet')));
    //   }
    // })();

    fetchPendingOrderItem();
  }, [...deps, state]);
};
