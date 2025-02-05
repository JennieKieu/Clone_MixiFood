import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../RTK';
import {createOrEditEmployee, resetEmployee, selectUserId} from '../../store';
import {restaurantApi} from '../../api/restaurantApi';
import {TEmployee} from '../../models';

export const useFetchEmployee = (deps: any[]) => {
  const selectUserIdd = useAppSelector(selectUserId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await restaurantApi.getAllEmployee(selectUserIdd);
        if (response.data) {
          const employee: TEmployee[] = response.data;
          dispatch(resetEmployee(employee));
        }
      } catch (error) {
        // console.log(error);
      }
    })();
  }, deps);
};
