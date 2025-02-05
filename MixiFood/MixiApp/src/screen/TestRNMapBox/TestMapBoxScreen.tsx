import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {palette, scale, scaleFontSize, spacing, style} from '../../theme';
import MapBoxGL, {
  Images,
  LineLayer,
  LocationPuck,
  MarkerView,
  PointAnnotation,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import {Layout} from '../../components/Layout/Layout';
import {lightColors, Text, useThemeMode} from '@rneui/themed';
import {SViewStyle} from '../../models';
import {AppImage} from '../../components/AppImage';
import {images} from '../../../assets';
import {insert} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect, useMemo, useRef, useState} from 'react';
import {SearchBox} from '@mapbox/search-js-react';
import {featureCollection, point} from '@turf/helpers';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../navigators';
import routeResponse from './testRouter.json';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {locationApi} from '../../api/locationApi';
import {TDirectionCoordinate} from './MapBox.types';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import {RestaurantBottomSheet} from './BottomSheet/RestaurantBottomSheet';
import {Feature, GeoJsonProperties, Geometry} from 'geojson';
import {delay} from '../../utils';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {AppInput} from '../../components/AppInput';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import testSerchRSJS from './TestSearchBox.json';
import {debounce} from 'lodash';

MapBoxGL.setAccessToken(
  'sk.eyJ1IjoiZGluaHBob25naXVoIiwiYSI6ImNtMzc2cjkxajBjZngydnNjbTA3bnprOGwifQ.shuYxnDiqiFIF46wzp-spA',
);

type TSuggestionData = {
  name: string;
  mapbox_id: string;
  address: string;
  full_address: string;
};

type TExampleRSLocation = {
  id: number;
  long: number;
  last: number;
  restaurantName: string;
};

const exampleRestaurantScooters: TExampleRSLocation[] = [
  {
    id: 1,
    long: 106.64313,
    last: 10.796012,
    restaurantName: 'MixiFood',
  },
  {
    id: 2,
    long: 106.642397,
    last: 10.794633,
    restaurantName: 'MixiFood1',
  },
];

// MapBoxGL.setConnected(true);
MapBoxGL.setTelemetryEnabled(false);

const {height} = Dimensions.get('screen');
export const TestRnMapBox: React.FC<
  NativeStackScreenProps<AppStackParamList, 'TestRnMapBox'>
> = props => {
  const {t} = useTranslation();
  const {top} = useSafeAreaInsets();
  const [direction, setDirection] = useState<any[][]>();
  const insert = useSafeAreaInsets();

  const [directionTemp, setDirectionTemp] = useState<any[][]>();
  const [isNavigation, setIsNavigation] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<TSuggestionData[]>([]);

  const [selectedCoordinate, setSelectedCoordinate] = useState<
    [number, number] | null
  >(null);
  const translateY = useSharedValue(-100);
  const animatedPosition = useSharedValue(0);
  const RestaurantPrieViewBottomSheetRef = useRef<BottomSheet>(null);
  const RestaurantPreivewSnapoints = useMemo(() => ['20%', '45%', '100%'], []);

  const cameraRef = useRef<MapBoxGL.Camera>(null);
  const {mode} = useThemeMode();
  const [myLastLong, setMyLastLong] = useState<{last: number; long: number}>();

  const points = exampleRestaurantScooters.map(scooter =>
    point([scooter.long, scooter.last], {name: scooter.restaurantName}),
  );

  const scootersFeatures = featureCollection(points);

  const handlePositioning = async () => {
    try {
      const location = await MapBoxGL.locationManager.getLastKnownLocation();
      // console.log(location);
      if (location) {
        const {latitude, longitude} = location.coords;
        cameraRef.current?.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: 16,
          animationDuration: 500,
        });
        setMyLastLong({
          last: location?.coords.latitude || 0,
          long: location?.coords.longitude || 0,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy vị trí hiện tại:', error);
    }
  };

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

  console.log(
    calculateDistance(
      myLastLong?.last || 0,
      myLastLong?.long || 0,
      exampleRestaurantScooters[1].last,
      exampleRestaurantScooters[1].long,
      'm',
    ) + 'm',
  );

  const onPointPress = async (event: OnPressEvent) => {
    console.log(event);
    RestaurantPrieViewBottomSheetRef.current?.close();
    await delay(200);
    RestaurantPrieViewBottomSheetRef.current?.snapToIndex(1);

    try {
      const fromData = {
        longitude: myLastLong?.long.toString() || '',
        latitude: myLastLong?.last.toString() || '',
      };
      const toData = {
        longitude: event?.coordinates.longitude.toString(),
        latitude: event?.coordinates.latitude.toString(),
      };
      const response = await locationApi.getDirections(fromData, toData);
      const directionsData = response.data.data;
      // console.log('fetching', directionsData.routes[0].geometry.coordinates);

      if (directionsData && directionsData.routes.length > 0) {
        // Lấy `coordinates` từ kết quả
        const coordinates = directionsData;
        if (coordinates) {
          // Cập nhật state `direction` với tọa độ đường đi
          setDirectionTemp(coordinates.routes[0].geometry.coordinates);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onMapPress = async (feature: Feature<Geometry, GeoJsonProperties>) => {
    console.log(feature.geometry);

    const longitude = feature.geometry?.coordinates[0];
    const latitude = feature.geometry?.coordinates[1];
    RestaurantPrieViewBottomSheetRef.current?.close();

    !selectedCoordinate
      ? setSelectedCoordinate([longitude, latitude])
      : setSelectedCoordinate(null);
  };

  const handleNavigation = () => {
    setDirection(prev => directionTemp);
    if (direction && directionTemp) {
      const middleIndex = Math.floor(directionTemp.length / 2);

      // cameraRef.current?.setCamera({
      //   centerCoordinate: [myLastLong?.long || 0, myLastLong?.last || 0],
      //   zoomLevel: 16,
      //   animationDuration: 500,
      // });
      cameraRef.current?.setCamera({
        centerCoordinate: [
          directionTemp[middleIndex][0] || 0,
          directionTemp[middleIndex][1] || 0,
        ],
        zoomLevel: 15,
        animationDuration: 500,
      });
    }
  };

  // const directionCoordinate = routeResponse.routes[0].geometry.coordinates;
  const directionCoordinate = routeResponse.routes[0].geometry.coordinates;

  // console.log('direction: ', direction);

  const absLocationStyle = useAnimatedStyle(() => {
    return {
      bottom: withTiming(animatedPosition.value, {duration: 10}), // Thực hiện chuyển động từ 10 đến 150
    };
  });

  console.log('absNavigationView', absLocationStyle.bottom);

  const handleBackOrFocusSearch = () => {
    console.log('dasdasdasas', isInputFocused);

    if (isInputFocused) {
      setIsInputFocused(prev => false);
      textInputRef.current?.blur();
    } else textInputRef.current?.focus();
  };

  useEffect(() => {
    translateY.value = withTiming(isInputFocused ? 0 : -100, {
      duration: 100, // Thời gian hiệu ứng (200ms)
    });
  }, [isInputFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value, // Điều chỉnh vị trí theo trục Y
        },
      ],
      opacity: withTiming(isInputFocused ? 1 : 0, {duration: 100}),
    };
  });

  const testSearchResult = testSerchRSJS.suggestions;

  // search
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query) {
        try {
          const response = await locationApi.search(query);
          setSearchResults(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    }, 200),
  ).current;

  useEffect(() => {
    debouncedSearch(searchText);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText]);

  // console.log(selectedCoordinate);

  const handleHandleSearchResult = async (input: TSuggestionData) => {
    try {
      const response = await locationApi.getRetrievePoint(input.mapbox_id);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //
  const BottomSheetheightAnimatedStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = height - animatedPosition.value;
    // console.log(`Chiều cao hiện tại của BottomSheet131: ${bottomSheetHeight}`);
    return {
      height: bottomSheetHeight,
    };
  });

  const locationStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = height - animatedPosition.value;

    // Tính toán giá trị bottom của Animated.View sao cho luôn lớn hơn bottomSheetHeight + 10
    const bottom =
      bottomSheetHeight > insert.bottom
        ? bottomSheetHeight - spacing.xl
        : insert.bottom;

    const opacity = interpolate(
      bottomSheetHeight,
      [height / 1.5, height],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      position: 'absolute',
      bottom: bottom,
      right: 10,
      opacity,
      zIndex: 100,
    };
  });

  const searchComponetStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = height - animatedPosition.value;

    const translateY = interpolate(
      bottomSheetHeight,
      [height * 0.7, height], // Bắt đầu khi BottomSheet lớn hơn 60% đến 100% chiều cao màn hình
      [0, -100], // Đẩy lên từ 0 đến -100 pixel (có thể điều chỉnh giá trị này theo ý muốn)
      Extrapolation.CLAMP, // Giới hạn giá trị trong khoảng [0, -100]
    );

    const opacity = interpolate(
      bottomSheetHeight,
      [height * 0.7, height], // Bắt đầu khi BottomSheet lớn hơn 70% đến 100% chiều cao màn hình
      [1, 0], // Giảm `opacity` từ 1 đến 0
      Extrapolation.CLAMP,
    );

    return {
      transform: [{translateY}],
      opacity,
    };
  });

  // const testAnimatedViewStyle =
  const testAnimatedViewStyle = useAnimatedStyle(() => {
    const bottomSheetHeight = height - animatedPosition.value;

    // Tăng dần chiều cao của Animated.View từ 0 đến 80 khi bottomSheetHeight từ 80% về 0%
    const animatedHeight = interpolate(
      height - bottomSheetHeight, // Quy đổi `heightScreen - bottomSheetHeight`
      [80, 0], // Từ 80 đến 0
      [0, 80], // Chiều cao tăng từ 0 đến 80
      Extrapolation.CLAMP,
    );

    // Tăng dần opacity từ 0 đến 1 khi Animated.View xuất hiện
    const opacity = interpolate(
      height - bottomSheetHeight,
      [80, 0], // Từ 80 đến 0
      [0, 1], // Opacity tăng từ 0 đến 1
      Extrapolation.CLAMP,
    );

    console.log(animatedHeight);

    return {
      height: animatedHeight,
      opacity,
      backgroundColor: palette.white,
      left: 0,
      right: 0,
      top: 0,
    };
  });

  return (
    <Layout>
      <Animated.View
        style={[
          testAnimatedViewStyle,
          {
            position: 'absolute',
            top: Platform.OS === 'ios' ? insert.top : 0,
            zIndex: 200,
          },
        ]}>
        <View style={[{marginTop: insert.top}, style.mx_md]}>
          <TouchableOpacity
            onPress={() =>
              RestaurantPrieViewBottomSheetRef.current?.snapToIndex(1)
            }>
            <AppImage source={images.chevron_down} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* <SearchBox accessToken="sk.eyJ1IjoiZGluaHBob25naXVoIiwiYSI6ImNtMzc2cjkxajBjZngydnNjbTA3bnprOGwifQ.shuYxnDiqiFIF46wzp-spA"></SearchBox> */}
      <Animated.View
        style={[
          locationStyle,
        ]}>
        <TouchableOpacity style={$locationBtn} onPress={handlePositioning}>
          <AppImage source={images.location} />
        </TouchableOpacity>
      </Animated.View>

      {isInputFocused && (
        <Animated.View
          style={[
            style.flex_10,
            style.abs_fo,
            {zIndex: 100, backgroundColor: palette.white},
            animatedStyle,
          ]}>
          <View
            style={{
              marginTop: Platform.OS === 'ios' ? insert.top * 2 : 90,
            }}>
            <ScrollView>
              <View style={[style.mx_md]}>
                {searchResults.map(item => (
                  <TouchableOpacity
                    key={item.mapbox_id}
                    style={[style.row_between, style.my_sm]}>
                    <View>
                      <Image source={images.location} />
                    </View>
                    <View
                      style={[
                        {
                          borderBottomWidth: 1,
                          width: '90%',
                          borderColor: palette.gray5,
                        },
                        style.pb_sm,
                      ]}>
                      <Text>{item.name}</Text>
                      <Text numberOfLines={1} ellipsizeMode="tail">
                        {item.full_address}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      )}

      <Animated.View
        style={[
          style.abs,
          {
            top: Platform.OS === 'ios' ? insert.top : 10,
            zIndex: 100,
            backgroundColor: palette.white,
            width: '95%',
            borderRadius: 999,
          },
          isInputFocused && {
            borderWidth: 1,
            borderColor: palette.gray5,
          },
          style.mx_sm,
          !isInputFocused && style.shadow,
          style.p_xs,
          searchComponetStyle,
        ]}>
        <Animated.View style={[]}></Animated.View>
        <View
          style={[style.flex_1, style.row_between]}
          // onPress={() => !isInputFocused && textInputRef.current?.focus()}
        >
          <View style={[style.row, style.align_center]}>
            <TouchableOpacity
              onPress={handleBackOrFocusSearch}
              style={style.mx_xs}>
              <Image
                source={!isInputFocused ? images.location : images.angle_left1}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Tìm địa chỉ ở đây"
              ref={textInputRef}
              onFocus={() => setIsInputFocused(true)}
              onChangeText={setSearchText}
              // onBlur={() => setIsInputFocused(false)}
              style={[
                style.tx_font_bold,
                {fontSize: scaleFontSize(14), width: '76%'},
              ]}
            />
          </View>
          <View>
            <Text>Icon</Text>
          </View>
        </View>
      </Animated.View>

      <MapBoxGL.MapView
        styleURL={
          mode === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : undefined
        }
        compassEnabled
        projection="mercator"
        style={style.flex_1}
        attributionEnabled={false}
        logoEnabled={false}
        // thanh đo tỷ lệ
        scaleBarEnabled={false}
        onPress={onMapPress}>
        {/*  */}
        <MapBoxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          // followUserLocation={true}
        />

        {/* Hiển thị vị trí người dùng đã chọn */}
        {selectedCoordinate && (
          <MarkerView
            id="selected-location-id"
            key="selected-location"
            coordinate={selectedCoordinate}>
            {/* <View style={{backgroundColor: 'red', width: 30, height: 30}} /> */}
            <Image
              source={images.location_dot_solid_red}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
          </MarkerView>
        )}

        <MapBoxGL.UserLocation
          visible={true}
          onUpdate={location => {
            isNavigation &&
              cameraRef.current?.setCamera({
                centerCoordinate: [
                  location?.coords.longitude,
                  location?.coords.latitude,
                ],
                zoomLevel: 16,
                animationDuration: 500,
              });
            // console.log('Vị trí hiện tại:', location.coords);
          }}
          //
        />
        <ShapeSource
          id="scooters"
          cluster
          shape={scootersFeatures}
          onPress={onPointPress}>
          <SymbolLayer
            id="scooter-icons"
            style={{
              iconImage: images.mixiLogo,
              iconSize: 0.2,
              iconAllowOverlap: true,
              iconAnchor: 'bottom',
              //
              textField: ['get', 'name'],
              textHaloWidth: 1,
              textAnchor: 'top',
              textOffset: [0, 0.5],
              textSize: 10,
            }}
          />

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
        </ShapeSource>
      </MapBoxGL.MapView>

      <RestaurantBottomSheet
        animatedPosition={animatedPosition}
        snapoints={RestaurantPreivewSnapoints}
        bottomSheetModalRef={RestaurantPrieViewBottomSheetRef}
        handleNavigation={handleNavigation}
        heightAnimatedStyle={BottomSheetheightAnimatedStyle}
      />
    </Layout>
  );
};

const $location: SViewStyle = [
  // style.abs,
  // {
  //   // bottom: spacing.xxxl,
  //   bottom: 40,
  //   right: 10,
  //   zIndex: 100,
  //   position: 'absolute',
  // },
];
const $locationBtn: SViewStyle = [
  style.p_sm,
  {backgroundColor: palette.white, borderRadius: 999},
];
const $location1: SViewStyle = [
  style.abs,
  {bottom: spacing.xxxl, top: 40, zIndex: 100, left: 10, position: 'absolute'},
];
