type legs = {
  via_waypoints: any[];
  admins: any[];
  annotation: {distance: any; duration: any};
  weight_typical: number;
  duration_typical: number;
  weight: number;
  duration: number;
  steps: any[];
  distance: number;
  summary: string;
};

type geometry = {
  coordinates: any[];
  type: 'string';
};

type TMapRoutes = {
  weight_typical: number;
  duration_typical: number;
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: legs[];
  geometry: geometry;
};

type TWaypoints = any[];

export type TDirectionCoordinate = {
  routes: TMapRoutes[];
  waypoints: TWaypoints;
};
