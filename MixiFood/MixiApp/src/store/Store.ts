import {combineReducers, configureStore} from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import {reduxStorage} from '../utils/Storage/ReduxStorage';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import GlobalSlice, {globalSliceKey} from './slices/GlobalSlice';
import restaurantSlice, {restaurantSliceKey} from './slices/RestaurantSlice';
import employeeSlice, {employeeSliceKey} from './slices/EmployeeSlice';

const rootReducer = combineReducers({
  global: GlobalSlice,
  restaurant: restaurantSlice,
  employee: employeeSlice,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: reduxStorage,
    blacklist: [globalSliceKey, restaurantSliceKey, employeeSliceKey],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
