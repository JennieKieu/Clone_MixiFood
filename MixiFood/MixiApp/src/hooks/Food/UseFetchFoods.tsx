import {useEffect} from 'react';
import {restaurantApi} from '../../api/restaurantApi';
import {TFood} from '../../models/food';
import {useAppDispatch} from '../RTK';
import {
  createOrEditFood,
  createOrEditFoodByEmp,
  deleteFoodsByEmp,
  resetFoods,
  resetFoodsByEmployee,
} from '../../store';
import {employeeApi} from '../../api/employeeApi';
import socketClient from '../../socket/socketClient';
import {useAppState} from '../useAppState';

export const useFetchFoods = (deps: any[], isEmployee?: boolean) => {
  const dispatch = useAppDispatch();
  const {state} = useAppState();

  useEffect(() => {
    if (!isEmployee) {
      (async () => {
        try {
          const response = await restaurantApi.getAllFood();
          if (response.data.foods) {
            const foods: TFood[] = response.data.foods;
            dispatch(resetFoods(foods));
          }
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      socketClient.getSocket()?.on('receiveAddFoodsMenu', (food: TFood) => {
        // console.log('receiFood', food);
        dispatch(createOrEditFoodByEmp([food]));
      });
      // delete food
      socketClient.getSocket()?.on('deletefoods', (ids: string[]) => {
        dispatch(deleteFoodsByEmp(ids));
      });

      (async () => {
        try {
          const response = await employeeApi.getAllFood();
          if (response.data.foods) {
            const foods: TFood[] = response.data.foods;
            dispatch(resetFoodsByEmployee(foods));
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [...deps]);
};
