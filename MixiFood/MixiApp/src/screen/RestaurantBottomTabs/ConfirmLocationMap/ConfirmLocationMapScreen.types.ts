export type TFeatureForGeocoding = {
  properties: {
    address: string;
    category: string;
    fullAddress?: string;
  };
  text: string;
  place_name: string;
  center: [longitudi: number, latitude: number]
};

export type TGeocoding = {
  query: [longitudi: number, latitude: number];
  features: TFeatureForGeocoding[];
};

export type TGeometry = {
  coordinates: [longitudi: number, latitude: number];
  type: string;
};

export type TContextForRetrieve = {
  country: {id: string; name: string};
  address: {
    id: string;
    name: string;
    address_number: string;
    street_name: string;
  };
};

export type TPropertiesForRetrieve = {
  name: string;
  mapbox_id: string;
  feature_type: string;
  address: string;
  full_address: string;
  place_formatted: string;
};

export type TfeaturesForRetrieve = {
  geometry: TGeometry;
  properties: TPropertiesForRetrieve;
};
