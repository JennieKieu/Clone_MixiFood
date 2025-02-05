import {client} from './client';

const BASE_URL = '/location';

class LocationApi {
  constructor() {}

  //
  async getDirections(
    from: {longitude: number; latitude: number},
    to: {longitude: number; latitude: number},
  ) {
    const url = `${BASE_URL}/route/${from.latitude}/${from.longitude}?lat2=${to.latitude}&long2=${to.longitude}`;
    return client.getCient().get(url);
  }

  // search
  async search(searchText: string) {
    const url = `${BASE_URL}/search/${searchText}`;
    return client.getCient().get(url);
  }

  // get retrieve poin
  async getRetrievePoint(mapbox_id: string) {
    const url = `${BASE_URL}/search/retrieve/${mapbox_id}`;
    return client.getCient().get(url);
  }

  // get geocoding by coodinate
  async getGeocodingByCoodinate(longitude: string, latitude: string) {
    const url = `${BASE_URL}/geocoding/${longitude}/${latitude}`;
    return client.getCient().get(url);
  }

  // restaurantlocations
  async getRestaurantLocations(
    longitude: number,
    latitude: number,
    limit?: number,
    offset?: number,
  ) {
    const url = `${BASE_URL}/restaurants/?${longitude.toString()}&${latitude.toString()}`;
    return client.getCient().get(url);
  }
}

export const locationApi = new LocationApi();
