import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, last } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly locationService: LocationService,
  ) {}

  // GET /route/:lat1/:long1?lat2=xxx&long2=yyy

  @Get('route/:lat1/:long1')
  async getRouter(
    @Param('lat1') lat1: string,
    @Param('long1') long1: string,
    @Query('lat2') lat2: string,
    @Query('long2') long2: string,
  ) {
    const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${long1}%2C${lat1}%3B${long2}%2C${lat2}?alternatives=true&annotations=distance%2Cduration%2Cspeed&geometries=geojson&language=en&overview=full&steps=true&access_token=${this.configService.get('mapboxAccessKey')}`;
    try {
      const response = await firstValueFrom(this.httpService.get(mapboxUrl));

      return {
        data: {
          success: true,
          data: response.data,
        },
      };
    } catch (error) {
      console.error('Error calling Mapbox API:', error);
      console.error('Error calling Mapbox API:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
      }
      throw new Error('Failed to call Mapbox API');
    }
  }

  // geocoding get point address location
  @Get('geocoding/:longitude/:latitude')
  async geocodingGetPointAddress(
    @Param('longitude') longitude: string,
    @Param('latitude') latitude: string,
  ) {
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${this.configService.get('mapboxAccessKey')}`;

    try {
      const response = await firstValueFrom(this.httpService.get(mapboxUrl));

      return {
        data: {
          success: true,
          data: response.data,
        },
      };
    } catch (error) {
      console.error('Error calling Mapbox Search API:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
      }
      throw new Error('Failed to call Mapbox Search API');
    }
  }

  // searchBox
  @Get('search/:searchText')
  async onSearchText(@Param('searchText') searchText: string) {
    // const sessionToken = uuidv4();
    const sessionToken = '050ccbad-d919-4a41-8931-f4f26110f420';

    const mapboxUrl = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&session_token=${sessionToken}&access_token=${this.configService.get('mapboxAccessKey')}`;

    try {
      const response = await firstValueFrom(this.httpService.get(mapboxUrl));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error calling Mapbox Search API:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
      }
      throw new Error('Failed to call Mapbox Search API');
    }
  }

  // get retrieve poin
  @Get('search/retrieve/:mapbox_id')
  async getRetrievePoint(@Param('mapbox_id') mapBoxId: string) {
    // const sessionToken = uuidv4();
    const sessionToken = '050ccbad-d919-4a41-8931-f4f26110f420';

    const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapBoxId}?session_token=${sessionToken}&access_token=${this.configService.get('mapboxAccessKey')}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return {
        data: {
          success: true,
          data: response.data,
        },
      };
    } catch (error) {
      console.error('Error calling Mapbox Search API:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
      }
      throw new Error('Failed to call Mapbox Search API');
    }
  }

  // get all restaurant location
  @Get('restaurants')
  getRestaurantLocation(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.locationService.getRestaurantsLocation(
      longitude,
      latitude,
      limit,
      offset,
    );
  }
}
