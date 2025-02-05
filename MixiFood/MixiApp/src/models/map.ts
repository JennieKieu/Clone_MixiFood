export type TOpenTimeOfDay = {
  timeOpen: string; // HH:mm
  timeClose: string;
};

export type TCoordinate = {
  longitude: number;
  latitude: number;
};

export type TRestaurantForMap = {
  _id: string;
  restaurantId: string;
  direction: {_id: string} & TCoordinate;
  directionName: string;
  directionAvatar: string;
  createdAt?: string;
  openTimeOfDay?: TOpenTimeOfDay;
  distance?: number;
  full_address: string;
};

export type TFeatureByMapPress = {
  coordinates: [TCoordinate['longitude'], TCoordinate['latitude']];
  type: string;
};
