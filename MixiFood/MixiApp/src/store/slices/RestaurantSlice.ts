import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EEmployeeRole} from '../../screen/Employee/EmployeeScreen.types';
import {logOut} from './GlobalSlice';
import {persistReducer} from 'redux-persist';
import {reduxStorage} from '../../utils/Storage/ReduxStorage';
import {RootState} from '../Store';
import {TEmployee, TSeatingForStore} from '../../models';
import {TFood} from '../../models/food';
import {TInvoiceForStore} from '../../models/invoice';

export const restaurantSliceKey = 'restaurant';

type RestaurantState = {
  listEmployees: TEmployee[];
  listFoods: TFood[];
  listSeating: TSeatingForStore[];
  listPendingInvoices: TInvoiceForStore[];
  listInvoices: TInvoiceForStore[];
  invoicesByFilter: TInvoiceForStore[];
  isInvoiceFilter: boolean;
  numberOfInvoicesToDay: number;
  totalRevenue: string;
};

const initialState: RestaurantState = {
  listEmployees: [],
  listFoods: [],
  listSeating: [],
  listPendingInvoices: [],
  listInvoices: [],
  invoicesByFilter: [],
  isInvoiceFilter: false,
  numberOfInvoicesToDay: 0,
  totalRevenue: '0',
};

export const restaurantSlice = createSlice({
  name: restaurantSliceKey,
  initialState,
  reducers: {
    createOrEditEmployee: (state, action: PayloadAction<TEmployee[]>) => {
      const newEmployee = [...state.listEmployees];

      action.payload.forEach(x => {
        const index = newEmployee.findIndex(
          xx => xx.phoneNumber === x.phoneNumber,
        );
        if (index === -1) {
          newEmployee.push({...x});
        } else {
          return;
        }
      });

      return {...state, listEmployees: newEmployee};
      // return {listEmployees: action.payload};
    },
    editEmployeeById: (
      state,
      action: PayloadAction<{id: string; updatedEmployee: TEmployee}>,
    ) => {
      const {id, updatedEmployee} = action.payload;
      const employeeIndex = state.listEmployees.findIndex(
        employee => employee._id === id,
      );

      if (employeeIndex !== -1) {
        state.listEmployees[employeeIndex] = {
          ...state.listEmployees[employeeIndex],
          ...updatedEmployee,
        };
      }
    },
    resetEmployee: (state, action: PayloadAction<TEmployee[]>) => {
      // return {listEmployees: action.payload};
      state.listEmployees = action.payload;
    },
    deleteEmployee: (state, action: PayloadAction<TEmployee['_id']>) => {
      state.listEmployees = state.listEmployees.filter(
        employee => employee._id !== action.payload,
      );
    },
    createOrEditFood: (state, action: PayloadAction<TFood[]>) => {
      const newFood = [...state.listFoods];
      action.payload.forEach(x => {
        const index = newFood.findIndex(xx => xx._id === x._id);
        if (index === -1) {
          newFood.push({...x});
        } else {
          // return;
          newFood[index] = {
            ...newFood[index],
            ...x,
          };
        }
      });
      return {...state, listFoods: newFood};
    },
    resetFoods: (state, action: PayloadAction<TFood[]>) => {
      state.listFoods = action.payload;
    },
    deleteFoods: (state, action: PayloadAction<TFood['_id'][]>) => {
      state.listFoods = state.listFoods.filter(
        food => !action.payload.includes(food._id),
      );
    },
    createOrEditSeating: (state, action: PayloadAction<TSeatingForStore[]>) => {
      const newSeating = [...state.listSeating];
      action.payload.forEach(x => {
        const index = newSeating.findIndex(xx => xx._id === x._id);
        if (index === -1) {
          newSeating.push({...x});
        } else {
          return;
        }
      });
      return {...state, listSeating: newSeating};
    },
    resetSettings: (state, action: PayloadAction<TSeatingForStore[]>) => {
      state.listSeating = action.payload;
    },
    deleteSeatings: (
      state,
      action: PayloadAction<TSeatingForStore['_id'][]>,
    ) => {
      state.listSeating = state.listSeating.filter(
        x => !action.payload.includes(x._id),
      );
    },
    resetPendingInvoices: (
      state,
      action: PayloadAction<TInvoiceForStore[]>,
    ) => {
      state.listPendingInvoices = action.payload;
    },
    resetInvoices: (state, action: PayloadAction<TInvoiceForStore[]>) => {
      state.listInvoices = action.payload;
    },
    resetInvoicesByFillter: (
      state,
      action: PayloadAction<TInvoiceForStore[]>,
    ) => {
      state.invoicesByFilter = action.payload;
      if (action.payload.length === 0) state.invoicesByFilter = [];
    },
    setIsInvoiceFilter: (state, action: PayloadAction<boolean>) => {
      state.isInvoiceFilter = action.payload;
    },
    setNumberInvoicesToday: (state, action: PayloadAction<number>) => {
      state.numberOfInvoicesToDay = action.payload;
    },
    setTotalRevenue: (state, action: PayloadAction<string>) => {
      state.totalRevenue = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(logOut, state => {
      return initialState;
    });
  },
});

export const {
  createOrEditEmployee,
  resetEmployee,
  deleteEmployee,
  createOrEditFood,
  resetFoods,
  deleteFoods,
  createOrEditSeating,
  resetSettings,
  deleteSeatings,
  resetPendingInvoices,
  resetInvoices,
  resetInvoicesByFillter,
  setIsInvoiceFilter,
  setNumberInvoicesToday,
  editEmployeeById,
  setTotalRevenue,
} = restaurantSlice.actions;

export const selectFullEmployees = (state: RootState) =>
  state.restaurant.listEmployees;
export const selectFoods = (state: RootState) => state.restaurant.listFoods;
export const selectSeatings = (state: RootState) =>
  state.restaurant.listSeating;
export const selectPendingInvoices = (state: RootState) =>
  state.restaurant.listPendingInvoices;
export const selectInvoices = (state: RootState) =>
  state.restaurant.listInvoices;
export const selectInvoicesByFilter = (state: RootState) =>
  state.restaurant.isInvoiceFilter
    ? state.restaurant.invoicesByFilter
    : state.restaurant.listInvoices;
export const selectIsInvoiceFilter = (state: RootState) =>
  state.restaurant.isInvoiceFilter;
export const selectNumberOfInvoicesToday = (state: RootState) =>
  state.restaurant.numberOfInvoicesToDay;
export const selectTotalRevenue = (state: RootState) =>
  state.restaurant.totalRevenue;

export default persistReducer<RestaurantState>(
  {
    key: restaurantSliceKey,
    storage: reduxStorage,
    blacklist: ['listPendingInvoices, invoicesByFilter', 'isInvoiceFilter'],
  },
  restaurantSlice.reducer,
);
