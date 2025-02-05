import {useEffect} from 'react';
import {useAppDispatch} from '../RTK';
import {loginApi} from '../../api/loginApi';
import {EUserType, setProfile, TProfile} from '../../store';
import {TEmployeeForStore, TRestaurantInfo, TUserInfo} from '../../models';

export const useFetchProfile = (deps: any[]) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await loginApi.me();
        if (response.data.success) {
          let profile: TProfile = {
            _id: '',
            userName: '',
            phoneNumber: '',
            email: '',
            avatar: '',
            coverImage: '',
            userType: EUserType.user,
          };
          if (response.data.data.role === EUserType.user) {
            const userData: TUserInfo = response.data.data;
            profile = {
              _id: userData._id,
              avatar: userData.avatar,
              coverImage: userData.coverImage,
              phoneNumber: userData.phoneNumber,
              userName: userData.userName,
              userType: userData.role,
              email: userData.email,
            };
          } else if (response.data.data.role === EUserType.restaurant) {
            const restaurantData: TRestaurantInfo = response.data.data;
            profile = {
              _id: restaurantData._id,
              avatar: restaurantData.avatar,
              coverImage: restaurantData.coverImage,
              phoneNumber: restaurantData.phoneNumber,
              userName: restaurantData.restaurantName,
              email: restaurantData.email,
              userType: restaurantData.role,
              address: restaurantData.restaurantAddress,
              locationId: restaurantData.locationId,
            };
          } else if (response.data.data.role === EUserType.employee) {
            const employeeData: TEmployeeForStore = response.data.data;
            profile = {
              _id: employeeData._id,
              avatar: employeeData.avatar,
              coverImage: employeeData.coverImage,
              phoneNumber: employeeData.phoneNumber,
              userName: employeeData.fullName,
              userType: employeeData.role,
              email: employeeData.email,
              restaurantRole: employeeData.restaurantRole,
              restaurantId: employeeData.restaurant,
            };
          }
          dispatch(setProfile(profile));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, deps);
};
