import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../Store';
import persistReducer from 'redux-persist/es/persistReducer';
import {reduxStorage} from '../../utils/Storage/ReduxStorage';
import {EThemeOption} from '../../hooks';
import {ERestaurantRole} from '../../api/api.types';
import {TRestaurantPaymentMethods} from '../../models';

export const globalSliceKey = 'global';

export enum EUserType {
  'user' = 'user',
  'restaurant' = 'restaurant',
  'employee' = 'employee',
  'admin' = 'admin',
}

export enum ERestaurantPayment {
  'momo' = 'momo',
  'vnpay' = 'vnpay',
}

export type TProfile = {
  _id: string;
  userName: string;
  phoneNumber: string;
  userType: EUserType;
  restaurantRole?: ERestaurantRole;
  avatar: string;
  coverImage: string;
  email?: string;
  address?: string;
  restaurantId?: string;
  locationId?: string;
  paymentMethods?: TRestaurantPaymentMethods[];
};

type GlobalState = {
  isLogin: boolean;
  userType: EUserType;
  themeSetting: EThemeOption;
  userId: string;
  profile?: TProfile;
};

const initialState: GlobalState = {
  isLogin: false,
  userType: EUserType.user,
  themeSetting: EThemeOption.LIGHT,
  userId: '',
  profile: undefined,
};

export const globalSlice = createSlice({
  name: globalSliceKey,
  initialState,
  reducers: {
    login: state => ({
      ...state,
      themeSetting: state.themeSetting,
      isLogin: true,
    }),
    logOut: state => {
      return initialState;
    },
    setUserType: (state, action: PayloadAction<EUserType>) => {
      state.userType = action.payload;
    },
    setTheme: (state, action: PayloadAction<EThemeOption>) => {
      state.themeSetting = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setProfile: (state, action: PayloadAction<TProfile>) => {
      state.profile = action.payload;
    },
    addRestaurantPaymentMethod: (
      state,
      action: PayloadAction<TRestaurantPaymentMethods>,
    ) => {
      if (state.profile) {
        if (state.profile.paymentMethods) {
          state.profile.paymentMethods.push(action.payload);
        } else {
          state.profile.paymentMethods = [action.payload];
        }
      }
    },
    updateRestaurantLocation: (
      state,
      action: PayloadAction<TProfile['locationId']>,
    ) => {
      if (state.profile) {
        state.profile.locationId = action.payload;
      }
    },
  },
});

export const {
  login,
  logOut,
  setUserType,
  setTheme,
  setUserId,
  setProfile,
  updateRestaurantLocation,
  addRestaurantPaymentMethod,
} = globalSlice.actions;

export const selectIsLogin = (state: RootState) => state.global.isLogin;
export const selectUserType = (state: RootState) => state.global.userType;
export const selectThemeSetting = (state: RootState) =>
  state.global.themeSetting;
export const selectUserId = (state: RootState) => state.global.userId;
export const selectUserInfo = (state: RootState) => state.global.profile;
export const selectRestaurantRole = (state: RootState) =>
  state.global.profile?.restaurantRole;

export default persistReducer<GlobalState>(
  {
    key: globalSliceKey,
    storage: reduxStorage,
    blacklist: [''],
  },
  globalSlice.reducer,
);
