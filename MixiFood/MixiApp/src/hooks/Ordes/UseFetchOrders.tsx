import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../RTK';
import {employeeApi} from '../../api/employeeApi';
import {
  createOrEditOrderByEmployee,
  resetOrderByEmployee,
  selectOrdersPendingByEmp,
  updateOrderItemStatusByEmp,
} from '../../store';
import socketClient from '../../socket/socketClient';
import {TOrder, TOrderedFoodStatus} from '../../models/order';
import {useAppState} from '../useAppState';

export type TUpdateOrderItemStatus = {
  orderId: string;
  orderItemId: string;
  status: TOrderedFoodStatus;
};

export const useFetchOrder = (deps: any[], isEmployee?: boolean) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrdersPendingByEmp);
  const {state} = useAppState();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await employeeApi.getOrderByStatusServing();
        if (response.data.success) {
          dispatch(resetOrderByEmployee(response.data.orders));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!socketClient.getSocket()) {
      socketClient.connect();
    }
    socketClient
      .getSocket()
      ?.on('onKitchenChangeOrderStatus', async (data: any) => {
        const updateData: TUpdateOrderItemStatus = {
          orderId: data.orderId,
          orderItemId: data.foodItemId,
          status: data.status,
        };

        // console.log('fetching ordered', data);
        if (!orders.findIndex(item => item._id === data.orderId)) {
          fetchOrder();
        }

        dispatch(updateOrderItemStatusByEmp(updateData));
      });

    socketClient
      .getSocket()
      ?.on('onKitchenChangeOrderStatusToServe', (data: TOrder) => {
        // dispatch(resetOrderByEmployee([data]));
        dispatch(createOrEditOrderByEmployee(data));
      });

    fetchOrder();
  }, [...deps, state]);
};
