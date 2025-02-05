import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TPendingOrder, TSeatingForStore} from '../../models';
import {persistReducer} from 'redux-persist';
import {reduxStorage} from '../../utils/Storage/ReduxStorage';
import {RootState} from '../Store';
import {logOut} from './GlobalSlice';
import {TFood} from '../../models/food';
import {
  TKitchenChangeFoodItemsStatus,
  TKitchenChangeMultiOrderItemStatus,
} from '../../api/api.types';
import {TOrder} from '../../models/order';
import {TUpdateOrderItemStatus} from '../../hooks/Ordes';

export const employeeSliceKey = 'employee;';

type EmployeeState = {
  listSeating: TSeatingForStore[];
  listFoods: TFood[];
  listPendingsOrderItems: TPendingOrder[];
  listOrderPending: TOrder[];
};

const initialState: EmployeeState = {
  listSeating: [],
  listFoods: [],
  listPendingsOrderItems: [],
  listOrderPending: [],
};

export const employeeSlice = createSlice({
  name: employeeSliceKey,
  initialState,
  reducers: {
    createOrEditSeatingByEmployee: (
      state,
      action: PayloadAction<TSeatingForStore[]>,
    ) => {
      const newSeating = [...state.listSeating];
      action.payload.forEach((x, indexx) => {
        const index = newSeating.findIndex(xx => xx._id === x._id);
        if (index === -1) {
          newSeating.push({...x});
        } else {
          newSeating[index] = action.payload[indexx];
          // return;
        }
      });
      return {...state, listSeating: newSeating};
    },
    resetSettingsByEmployee: (
      state,
      action: PayloadAction<TSeatingForStore[]>,
    ) => {
      state.listSeating = action.payload;
    },
    resetFoodsByEmployee: (state, action: PayloadAction<TFood[]>) => {
      state.listFoods = action.payload;
    },
    updateSeatOrder: (state, action: PayloadAction<TSeatingForStore>) => {
      const index = state.listSeating.findIndex(
        seat => seat._id === action.payload._id,
      );

      if (index !== -1) {
        state.listSeating[index] = {
          ...state.listSeating[index],
          currentOrderId: action.payload.currentOrderId,
        };
      }
    },
    createOrEditFoodByEmp: (state, action: PayloadAction<TFood[]>) => {
      const newFood = [...state.listFoods];
      action.payload.forEach(x => {
        const index = newFood.findIndex(xx => xx._id === x._id);
        if (index === -1) {
          newFood.push({...x});
        } else {
          return;
        }
      });
      return {...state, listFoods: newFood};
    },
    deleteFoodsByEmp: (state, action: PayloadAction<string[]>) => {
      state.listFoods = state.listFoods.filter(
        food => !action.payload.includes(food._id),
      );
    },
    resetPendingOrderItemsByEmployee: (
      state,
      action: PayloadAction<TPendingOrder[]>,
    ) => {
      state.listPendingsOrderItems = action.payload;
    },
    createOrEditPendingOrderItemByEmployee: (
      state,
      action: PayloadAction<TPendingOrder[]>,
    ) => {
      const newPendingOrder = [...state.listPendingsOrderItems];
      action.payload.forEach((x, indexx) => {
        const index = newPendingOrder.findIndex(xx => xx.orderId === x.orderId);
        if (index === -1) {
          newPendingOrder.push({...x});
        } else {
          newPendingOrder[index] = action.payload[indexx];
          // return;
        }
      });
      return {...state, listPendingsOrderItems: newPendingOrder};
    },
    updateCurrentOrderIdAtSeat: (
      state,
      action: PayloadAction<{seatId: string; currentOrderId: string}>,
    ) => {
      const {seatId, currentOrderId} = action.payload;
      const index = state.listSeating.findIndex(seat => seat._id === seatId);

      if (index !== -1) {
        state.listSeating[index].currentOrderId = currentOrderId;
      }
    },
    removePendingOrderItem: (
      state,
      action: PayloadAction<TKitchenChangeFoodItemsStatus>,
    ) => {
      const {foodItemId, orderId} = action.payload;

      state.listPendingsOrderItems = state.listPendingsOrderItems
        .map(item => {
          // Lọc phần tử pendingFoodItems
          const filteredPendingFoodItems = item.pendingFoodItems.filter(
            p => p._id !== foodItemId,
          );

          // Trả về một bản sao mới với pendingFoodItems đã lọc
          return {
            ...item,
            pendingFoodItems: filteredPendingFoodItems,
          };
        })
        // Sau đó lọc ra các đơn hàng không còn pendingFoodItems
        .filter(item => item.pendingFoodItems.length > 0);
    },
    removeMultiPendingOrderItem: (
      state,
      action: PayloadAction<TKitchenChangeMultiOrderItemStatus[]>,
    ) => {
      state.listPendingsOrderItems = state.listPendingsOrderItems
        .map(item => {
          const orderToRemove = action.payload.find(
            order => order.orderId === item.orderId,
          );

          if (orderToRemove) {
            const filteredPendingFoodItems = item.pendingFoodItems.filter(
              foodItem => !orderToRemove.orderItemId.includes(foodItem._id),
            );

            return {
              ...item,
              pendingFoodItems: filteredPendingFoodItems,
            };
          }

          return item;
        })
        .filter(item => item.pendingFoodItems.length > 0);
    },
    resetOrderByEmployee: (state, action: PayloadAction<TOrder[]>) => {
      state.listOrderPending = action.payload;
    },
    updateOrderItemStatusByEmp: (
      state,
      action: PayloadAction<TUpdateOrderItemStatus>,
    ) => {
      const {orderId, orderItemId, status} = action.payload;

      const orderIndex = state.listOrderPending.findIndex(
        order => order._id === orderId,
      );
      if (orderIndex !== -1) {
        const foodItemIndex = state.listOrderPending[
          orderIndex
        ].foodItems.findIndex(item => item._id === orderItemId);

        if (foodItemIndex !== -1) {
          state.listOrderPending[orderIndex].foodItems[foodItemIndex].status =
            status;
        }
      }
    },
    createOrEditOrderByEmployee: (state, action: PayloadAction<TOrder>) => {
      const newOrder = action.payload;

      const index = state.listOrderPending.findIndex(
        order => order._id === newOrder._id,
      );
      if (index !== -1) {
        state.listOrderPending[index] = {
          ...state.listOrderPending[index],
          ...newOrder,
        };
      } else {
        state.listOrderPending.push(newOrder);
      }
    },
  },

  extraReducers: builder => {
    builder.addCase(logOut, state => {
      return initialState;
    });
  },
});

export const {
  createOrEditSeatingByEmployee,
  resetSettingsByEmployee,
  resetFoodsByEmployee,
  updateSeatOrder,
  createOrEditFoodByEmp,
  deleteFoodsByEmp,
  resetPendingOrderItemsByEmployee,
  createOrEditPendingOrderItemByEmployee,
  updateCurrentOrderIdAtSeat,
  removePendingOrderItem,
  resetOrderByEmployee,
  updateOrderItemStatusByEmp,
  createOrEditOrderByEmployee,
  removeMultiPendingOrderItem
} = employeeSlice.actions;

export const selectSeatingsByEmployee = (state: RootState) =>
  state.employee.listSeating;
export const selectFoodsByEmployee = (state: RootState) =>
  state.employee.listFoods;
export const selectPendingOrderItemByEmp = (state: RootState) =>
  state.employee.listPendingsOrderItems;
// select order by seat -> currentOrderId
export const selectOrdersPendingByEmp = (state: RootState) =>
  state.employee.listOrderPending;

export default persistReducer<EmployeeState>(
  {
    key: employeeSliceKey,
    storage: reduxStorage,
    blacklist: ['listPendingsOrderItems'],
  },
  employeeSlice.reducer,
);
