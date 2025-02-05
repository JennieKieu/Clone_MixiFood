import {useEffect} from 'react';
import {useAppDispatch} from '../RTK';
import {useAppState} from '../useAppState';
import {restaurantApi} from '../../api/restaurantApi';
import {TInvoice, TInvoiceForStore} from '../../models/invoice';
import {resetPendingInvoices, setTotalRevenue} from '../../store';
import socketClient from '../../socket/socketClient';

export const usePendingInvoices = (deps: any[]) => {
  const dispatch = useAppDispatch();
  const {state} = useAppState();

  useEffect(() => {
    const fetchPendingInvoices = async () => {
      try {
        const response = await restaurantApi.getPendingInvoices();
        if (response.data.success) {
          const data: TInvoiceForStore[] =
            response.data.invoicesWithEmployeeName;
          dispatch(resetPendingInvoices(data));
        }
      } catch (error) {
        console.log('error for pending invoces', error);
      }
    };

    if (!socketClient.getSocket()) {
      socketClient.connect();
    }
    // socket
    socketClient
      .getSocket()
      ?.on('onServeSendInvoiceCashpayment', (data: TInvoice) => {
        // console.log('rêcive data', data);

        fetchPendingInvoices();
      });

    fetchPendingInvoices();
  }, [...deps, state]);
};
