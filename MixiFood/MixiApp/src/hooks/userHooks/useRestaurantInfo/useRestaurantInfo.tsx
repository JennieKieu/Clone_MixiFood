import {useEffect, useState} from 'react';
import {userApi} from '../../../api/userApi';

type TUseRestaurantInfoProps = {
  restaurantId: string;
};

type TRestaurantInfo = {
  restaurantName: string;
  avatar: string;
  timeOpen?: Date;
  timeClose?: Date;
  bookingEnable?: boolean;
};

export const useRestaurantInfo = ({restaurantId}: TUseRestaurantInfoProps) => {
  const [restaurantInfo, setRestaurantInfo] = useState<TRestaurantInfo>();

  const boostrapAsync = async () => {
    try {
      const response = await userApi.getRestaurant(restaurantId);
      if (response.data.success) {
        setRestaurantInfo(response.data.restaurant);
      }
    } catch (error) {}
  };

  useEffect(() => {
    boostrapAsync();
  }, []);

  return {
    restaurantInfo,
  };
};
