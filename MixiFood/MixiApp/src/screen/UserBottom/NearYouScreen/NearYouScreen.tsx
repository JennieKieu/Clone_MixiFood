import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import MapBoxGL, {
  Images,
  LineLayer,
  MarkerView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import {palette, spacing, style} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {Text, useThemeMode} from '@rneui/themed';
import {Layout} from '../../../components/Layout/Layout';
import {SearchLocation} from '../../RestaurantBottomTabs/ConfirmLocationMap/Search';
import {TextInput} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {TSuggestionData} from '../../RestaurantBottomTabs/ConfirmLocationMap';
import {Image} from 'react-native';
import {images} from '../../../../assets';
import BottomSheet from '@gorhom/bottom-sheet';
import {MapRestaurantBottomSheet} from './BottomSheet';
import {AppImage} from '../../../components/AppImage';
import {
  SViewStyle,
  TCoordinate,
  TFeatureByMapPress,
  TRestaurantForMap,
} from '../../../models';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {delay} from '../../../utils';
import {debounce} from 'lodash';
import {locationApi} from '../../../api/locationApi';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {featureCollection, point} from '@turf/helpers';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  AppStackParamList,
  AppUserBottomTabbarParamList,
} from '../../../navigators';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useLoader} from '../../../contexts/loader-provider';
import {number} from 'yup';
import {TfeaturesForRetrieve} from '../../RestaurantBottomTabs/ConfirmLocationMap/ConfirmLocationMapScreen.types';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {ELoaderType} from '../../../components/AppLoader';
import {Alert} from 'react-native';
import {userApi} from '../../../api/userApi';

const exampleRestaurantScooters: TRestaurantForMap[] = [
  {
    _id: '1',
    direction: {
      longitude: 106.64313,
      latitude: 10.796012,
      _id: '1312',
    },
    directionName: 'MixiFood',
    restaurantId: '13213',
    directionAvatar: '',
    createdAt: '',
    full_address: 'Số 463 Phan Văn Trị, P.5, Q. Gò Vấp',
  },
  {
    _id: '2',
    direction: {
      longitude: 106.642397,
      latitude: 10.794633,
      _id: '1312',
    },
    directionName: 'MixiFood1',
    restaurantId: '13213',
    directionAvatar: '',
    createdAt: '',
    full_address: 'Số 463 Phan Văn Trị, P.5, Q. Gò Vấp',
  },
  {
    _id: '3',
    direction: {
      longitude: 106.634411,
      latitude: 10.806592,
      _id: '1312',
    },
    directionName: 'Lẩu thái gì đó',
    restaurantId: '13213',
    directionAvatar: '',
    createdAt: '',
    full_address: 'Số 463 Phan Văn Trị, P.5, Q. Gò Vấp',
  },
  {
    _id: '4',
    direction: {
      longitude: 106.70573482,
      latitude: 10.79305001,
      _id: '1312',
    },
    directionName: 'Buffet',
    restaurantId: '13213',
    directionAvatar: '',
    createdAt: '',
    full_address: 'Số 463 Phan Văn Trị, P.5, Q. Gò Vấp',
  },
];

export const NearYouScreen: React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<AppUserBottomTabbarParamList, 'NearYou'>,
    NativeStackScreenProps<AppStackParamList>
  >
> = props => {
  const {t} = useTranslation();
  const insert = useSafeAreaInsets();
  const {mode} = useThemeMode();
  const {colorScheme} = useThemeContext();
  const cameraRef = useRef<MapBoxGL.Camera>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [myLocation, setMyLocation] = useState<[number, number]>();
  const [selectedPoint, setSelectedPoint] = useState<TCoordinate>();
  const [direction, setDirection] = useState<any[][]>(); //đường đi
  const height = spacing.screenHeight;
  const loader = useLoader();

  // search
  const textInputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const translateYSearchContainer = useSharedValue(0);
  const [searchResults, setSearchResults] = useState<TSuggestionData[]>([]);

  // bottomsheet
  const MapRestaurantBottomSheetRef = useRef<BottomSheet>(null);
  const MapRestaurantSnapoint = useMemo(() => ['20%', '45%', '100%'], []);
  const animatedPosition = useSharedValue(0);
  const [restaurantForMap, setRestaurantForMap] = useState<TRestaurantForMap[]>(
    exampleRestaurantScooters,
  );
  const closeMapRestaurantBottomSheet = () =>
    MapRestaurantBottomSheetRef.current?.close();

  // search action
  const handleBackOrFocusSearch = () => {
    // SelectedAddressBottomSheetRef.current?.dismiss();
    if (isInputFocused) {
      setIsInputFocused(prev => false);
      textInputRef.current?.blur();
    } else textInputRef.current?.focus();
  };

  // bug
  useLayoutEffect(() => {
    loader.show(ELoaderType.foodLoader1);
    const fetchAccessKey = async () => {
      try {
        const response = await userApi.verifyMap();
        await delay(5000);

        if (response.data.success) {
          MapBoxGL.setAccessToken(response.data.accessKey);
          loader.hide();
        }
        loader.hide();
      } catch (error) {
        loader.hide();
        Alert.alert('Server not start');
      }
    };
    fetchAccessKey();
  }, []);
  //

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        try {
          const response = await locationApi.search(query);
          setSearchResults(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    }, 400),
    [],
  );

  const handleDirections = async (coordinate: TCoordinate) => {
    try {
      const from: TCoordinate = {
        longitude: myLocation?.[0] || 0,
        latitude: myLocation?.[1] || 0,
      };
      const response = await locationApi.getDirections(from, coordinate);
      const directionsData = response.data.data;

      if (directionsData) {
        const coordinates = directionsData;
        setDirection(coordinates.routes[0].geometry.coordinates);
        closeMapRestaurantBottomSheet();
        await delay(100);
        //
        const middleIndex = Math.floor(
          coordinates.routes[0].geometry.coordinates.length / 2,
        );

        followPoint(
          {
            longitude:
              coordinates.routes[0].geometry.coordinates[middleIndex][0],
            latitude:
              coordinates.routes[0].geometry.coordinates[middleIndex][1],
          },
          15,
          500,
        );
      }
    } catch (error) {
      console.log('direction error', error);
    }
  };

  const handleRestaurantOnMapPoint = (event: OnPressEvent) => {
    setSelectedPoint(event.coordinates);
    reopenMapRestaurantBottomSheet();
    followPoint(event.coordinates, 16, 400);
  };

  const handleSearchResultPress = async (mapbox_id: string) => {
    setIsInputFocused(false);
    try {
      const response = await locationApi.getRetrievePoint(mapbox_id);
      if (response.data.success) {
        const data: TfeaturesForRetrieve = response.data.data.features[0];

        setSelectedPoint({
          longitude: Number(data.geometry.coordinates[0]),
          latitude: Number(data.geometry.coordinates[1]),
        });

        const propertie = data.properties;
        // console.log('zczcz', propertie.full_address);
        setSearchText(propertie.address);
        MapRestaurantBottomSheetRef.current?.close();
        await delay(200);
        MapRestaurantBottomSheetRef.current?.snapToIndex(1);
        // followPoint(
        //   {
        //     longitude: Number(data.geometry.coordinates[0]),
        //     latitude: Number(data.geometry.coordinates[1]),
        //   },
        //   16,
        //   200,
        // );
        cameraRef.current?.setCamera({
          centerCoordinate: [
            Number(data.geometry.coordinates[0]),
            Number(data.geometry.coordinates[1]),
          ],
          zoomLevel: 16,
          // pitch: 73.86,
          animationDuration: 400,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    debouncedSearch(searchText);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText, debouncedSearch]);

  const handleClearOnSearch = () => {
    setSearchText('');
    setIsInputFocused(false);
    Keyboard.isVisible() && Keyboard.dismiss();
  };

  const rightSearch = useMemo(() => {
    return searchText ? (
      <View style={[style.row, style.mx_xxs]}>
        <TouchableOpacity onPress={handleClearOnSearch}>
          <Image source={images.xmark_solid} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    ) : undefined;
  }, [searchText]);

  // animatedStyle
  const searchAnimatedStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = height - animatedPosition.value;

    const startAnimated = height * 0.8;
    const endAnimated = height;

    const translateY = interpolate(
      bottomSheetHeight,
      [startAnimated, endAnimated],
      [0, -200],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      bottomSheetHeight,
      [startAnimated, endAnimated],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{translateY}],
      opacity: opacity,
    };
  });

  // end search component

  // BottomSheetFC
  // bottom sheet height
  const BottomSheetHeightAnimatedStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = spacing.screenHeight - animatedPosition.value; //-> bottom sheet height

    return {
      height: bottomSheetHeight,
    };
  });

  // location abs view
  const locationStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = spacing.screenHeight - animatedPosition.value;

    const bottomTabHeight = 60; //? ước tính

    // Animated.View > bottomSheetHeight + 10
    const bottom = bottomSheetHeight ? bottomSheetHeight - bottomTabHeight : 0;

    const opacity = interpolate(
      bottomSheetHeight,
      [height * 0.25, height - (insert.top + translateYSearchContainer.value)],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      position: 'absolute',
      bottom: bottom,
      right: 10,
      opacity,
      zIndex: 98,
    };
  });

  //
  const handlePositioning = async () => {
    selectedPoint && setSelectedPoint(prev => undefined);
    try {
      const location = await MapBoxGL.locationManager.getLastKnownLocation();
      if (location) {
        const {latitude, longitude} = location.coords;
        cameraRef.current?.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: 16,
          animationDuration: 300,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy vị trí hiện tại:', error);
    }
  };

  const handleShowRestaurants = () => {
    MapRestaurantBottomSheetRef.current?.snapToIndex(1);
  };

  // restaurant point
  const restaurantPoint = restaurantForMap.map(scooter =>
    point([scooter.direction.longitude, scooter.direction.latitude], {
      restaurantName: scooter.directionName,
    }),
  );
  const scootersFeatures = featureCollection(restaurantPoint);

  useFocusEffect(() => {
    // openMapRestaurantBottomShet()
    // MapRestaurantBottomSheetRef.current?.snapToIndex(1);

    // console.log('mount');
    if (!isFirstLoad && !selectedPoint && myLocation) {
      const userCoordinates = [myLocation[0], myLocation[1]];

      followPoint(
        {longitude: userCoordinates[0], latitude: userCoordinates[1]},
        16,
        400,
      );

      MapRestaurantSnapoint &&
        MapRestaurantBottomSheetRef.current?.snapToIndex(1);
    }

    return () => {
      // setIsFirstLoad(prev => true);
      // console.log('un mount');
      // setSelectedPoint(undefined);
    };
  });

  // map
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: 'm' | 'km' = 'm',
  ): number => {
    const R = 6371e3; // Bán kính Trái Đất (mét)
    const φ1 = (lat1 * Math.PI) / 180; // Độ sang radian
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance = R * c; // (mét)

    if (unit === 'km') {
      distance /= 1000;
    }

    return distance;
  };

  const listRestaurantForDistance = useMemo(() => {
    const updatedList = restaurantForMap.map(restaurant => {
      restaurant.distance = calculateDistance(
        selectedPoint?.latitude || myLocation?.[1] || 0,
        selectedPoint?.longitude || myLocation?.[0] || 0,
        restaurant.direction.latitude,
        restaurant.direction.longitude,
        'km',
      );
      return {
        ...restaurant,
        // distance: parseFloat(distance.toFixed(2)),
      };
    });

    return updatedList.sort(
      (a, b) => (a.distance as number) - (b.distance as number),
    );
  }, [restaurantForMap, myLocation, selectedPoint]);

  const fetchRestaurantLocations = async (
    longitude: number,
    latitude: number,
  ) => {
    try {
      const response = await locationApi.getRestaurantLocations(
        longitude,
        latitude,
      );
      if (response.data.success) {
        const data: TRestaurantForMap[] = response.data.restaurantLocations;
        setRestaurantForMap([...data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRestaurantLocations(myLocation?.[0] || 0, myLocation?.[1] || 0);
  }, []);

  const followPoint = (
    coordinate: TCoordinate,
    zom?: number,
    duration?: number,
  ) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [coordinate.longitude, coordinate.latitude],
      zoomLevel: zom || 16,
      // pitch: 73.86,
      animationDuration: duration || 400,
    });
  };

  const reopenMapRestaurantBottomSheet = async () => {
    MapRestaurantBottomSheetRef.current?.close();
    await delay(400);
    MapRestaurantBottomSheetRef.current?.snapToIndex(1);
  };

  const handleMapPress = async (feature: any) => {
    reopenMapRestaurantBottomSheet();
    // MapRestaurantBottomSheetRef.current?.close();
    // await delay(400);
    // MapRestaurantBottomSheetRef.current?.snapToIndex(1);
    const featureData: TFeatureByMapPress = feature.geometry;
    const coordinate: TCoordinate = {
      longitude: featureData.coordinates[0],
      latitude: featureData.coordinates[1],
    };
    setSelectedPoint(prev => coordinate);
    await delay(100);
    followPoint(coordinate, 15, 200);
  };

  // top animated style
  const topAnimatedViewStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = height - animatedPosition.value;

    const topHeight = 200;

    const animatedHeight = interpolate(
      height - bottomSheetHeight,
      [topHeight, 0],
      [0, topHeight],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      height - bottomSheetHeight,
      [80, 0],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      position: 'absolute',
      zIndex: 98,
      // top: insert.top,
      // height: animatedHeight,
      opacity,
      backgroundColor: palette.white,
      left: 0,
      right: 0,
      top: 0,
      paddingBottom: spacing.md,
    };
  });

  const handleRestaurantPress = (
    restaurantId: string,
    locationData: TRestaurantForMap,
  ) => {
    props.navigation.navigate('RestaurantPrieviewScreen', {
      restaurantId: restaurantId,
      locationData,
    });
  };

  return (
    <Layout>
      {/*  */}
      <Animated.View style={topAnimatedViewStyle}>
        <View style={[style.mx_md, {marginTop: insert.top}]}>
          <TouchableOpacity
            onPress={() => MapRestaurantBottomSheetRef.current?.snapToIndex(1)}>
            <AppImage source={images.chevron_down} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <SearchLocation
        inputRef={textInputRef}
        searchValue={searchText}
        setSearchText={setSearchText}
        handleBackOrFocusSearch={handleBackOrFocusSearch}
        isInputFocused={isInputFocused}
        setIsInputFocused={setIsInputFocused}
        translateY={translateYSearchContainer}
        searchResults={searchResults}
        handleSearchItem={handleSearchResultPress}
        RightChildren={rightSearch}
        animatedStyle={searchAnimatedStyle}
      />

      {/* user location */}
      <Animated.View style={[locationStyle]}>
        <TouchableOpacity
          style={[$locationBtn, style.mb_sm]}
          onPress={handleShowRestaurants}>
          <AppImage source={images.location_restaurant} />
        </TouchableOpacity>
        <TouchableOpacity style={$locationBtn} onPress={handlePositioning}>
          <AppImage source={images.location} />
        </TouchableOpacity>
      </Animated.View>

      <MapBoxGL.MapView
        // styleURL={
        //   mode === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : undefined
        // }
        // compassEnabled
        projection="globe"
        style={style.flex_1}
        attributionEnabled={false}
        logoEnabled={false}
        // thanh đo tỷ lệ
        scaleBarEnabled={false}
        onPress={handleMapPress}>
        <MapBoxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          // followUserLocation={isFirstLoad}
          animationDuration={100}
          animationMode="flyTo"
        />
        <MapBoxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator
          onUpdate={async location => {
            if (isFirstLoad && location.coords) {
              const userCoordinates = [
                location.coords.longitude,
                location.coords.latitude,
              ];

              cameraRef.current?.setCamera({
                centerCoordinate: userCoordinates,
                zoomLevel: 16,
                animationDuration: 1000,
              });

              setMyLocation([
                location.coords.longitude,
                location.coords.latitude,
              ]);
              setIsFirstLoad(false);

              // try {
              //   const response = await locationApi.getGeocodingByCoodinate(
              //     location.coords.longitude.toString(),
              //     location.coords.latitude.toString(),
              //   );

              //   if (response.data.success) {
              //     const data: TGeocoding = response.data.data;
              //     // console.log('myData', data.features);
              //     setSelectedPoint(data.features[0]);
              //     SelectedAddressBottomSheetRef.current?.present();
              //   }
              // } catch (error) {
              //   console.log(error);
              // }
            }
          }}
        />
        <Images
          images={{mixiLogo: require('../../../../assets/mixiLogo.png')}}
        />

        {/* restaurant point */}
        <ShapeSource
          id="scooters"
          cluster
          shape={scootersFeatures}
          onPress={handleRestaurantOnMapPoint}>
          <SymbolLayer
            id="scooter-icons"
            style={{
              iconImage: 'mixiLogo',
              iconSize: 0.2,
              iconAllowOverlap: true,
              iconAnchor: 'bottom',
              //
              textField: ['get', 'restaurantName'],
              textHaloWidth: 1,
              textAnchor: 'top',
              textOffset: [0, 0.5],
              textSize: 10,
            }}
          />
        </ShapeSource>

        {/* poin */}
        {selectedPoint && (
          <MarkerView
            id="selected-location-id"
            key="selected-location"
            coordinate={[selectedPoint.longitude, selectedPoint.latitude]}>
            <Image
              source={images.location_dot_solid_red}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
          </MarkerView>
        )}

        {/* Directions */}
        <ShapeSource
          id="routeSource"
          lineMetrics
          shape={{
            properties: {},
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: direction ?? [],
            },
          }}>
          <LineLayer
            id="exampleLineLayer"
            style={{
              lineColor: '#42A2D9',
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 5,
            }}
          />
        </ShapeSource>
        {/* navigation */}
      </MapBoxGL.MapView>

      <MapRestaurantBottomSheet
        snapoints={MapRestaurantSnapoint}
        bottomSheetModalRef={MapRestaurantBottomSheetRef}
        animatedPosition={animatedPosition}
        heightAnimatedStyle={BottomSheetHeightAnimatedStyle}
        restaurants={listRestaurantForDistance}
        handleDirections={handleDirections}
        handleRestaurantPress={handleRestaurantPress}
      />
    </Layout>
  );
};

const $locationBtn: SViewStyle = [
  style.p_sm,
  {backgroundColor: palette.white, borderRadius: 999},
];
