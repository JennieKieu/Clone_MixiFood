import {useEffect} from 'react';
import {useAppDispatch} from '../RTK';
import {useAppState} from '../useAppState';
import {restaurantApi} from '../../api/restaurantApi';
import {TInvoiceForStore} from '../../models/invoice';
import {
  resetInvoices,
  setNumberInvoicesToday,
  setTotalRevenue,
} from '../../store';

export const useInvoicesHistory = (deps: any[]) => {
  const dispatch = useAppDispatch();
  const {state} = useAppState();

  useEffect(() => {
    const fetchInvoicies = async () => {
      try {
        const response = await restaurantApi.getInvoices('DAY');
        if (response.data.success) {
          // console.log('nè', response.data.invoicesWithEmployeeName);
          const totalRevenue: string = response.data.totalRevenue;

          const data: TInvoiceForStore[] =
            response.data.invoicesWithEmployeeName;
          dispatch(resetInvoices(data));
          totalRevenue && dispatch(setTotalRevenue(totalRevenue));

          // console.log('totalll', response.data.totalRevenue);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchNumberOfInvoicesToDay = async () => {
      try {
        const response = await restaurantApi.getNumberInvoicesToDay();
        if (response.data.success) {
          dispatch(setNumberInvoicesToday(response.data.numberOfInvoices));
        }
      } catch (error) {
        console.log(error);
      }
    };
    // socket?

    fetchInvoicies();
    fetchNumberOfInvoicesToDay();
  }, [...deps, state]);
};
