import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  AppUserBottomTabbar,
  AppUserBottomTabbarParamList,
} from './UserBottomTab';
import {
  AppRestaurantBottomTabbar,
  AppRestaurantBottomTabbarParamList,
} from './RestaurantBottomTab';
import {EUserType, selectUserType} from '../store';
import {useAppSelector} from '../hooks';
import {
  AppEmployeeBottomTabbar,
  AppEmployeeBottomTabbarParamList,
} from './EmployeeBottomTab';

export type AppBottomTabbarParamList = {
  AppRestaurantBottomTabbarParamList: AppRestaurantBottomTabbarParamList;
  AppUserBottomTabbarParamList: AppUserBottomTabbarParamList;
  AppEmployeeBottomTabbarParamList: AppEmployeeBottomTabbarParamList;
};

const BottomTabbar = createBottomTabNavigator<AppBottomTabbarParamList>();

export const AppBottomTabbar = () => {
  const userType = useAppSelector(selectUserType);
  // console.log('userTypes', userType);

  if (userType === EUserType.restaurant) return <AppRestaurantBottomTabbar />;
  else if (userType === EUserType.user) return <AppUserBottomTabbar />;
  else return <AppEmployeeBottomTabbar />;
};
