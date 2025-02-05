import MapBoxGL, {MarkerView} from '@rnmapbox/maps';
import {Layout} from '../../../components/Layout/Layout';
import {Text, useThemeMode} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {style} from '../../../theme';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchLocation} from './Search';
import {TextInput} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {debounce} from 'lodash';
import {locationApi} from '../../../api/locationApi';
import {Feature, GeoJsonProperties, Geometry} from 'geojson';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {images} from '../../../../assets';
import {
  TFeatureForGeocoding,
  TfeaturesForRetrieve,
  TGeocoding,
} from './ConfirmLocationMapScreen.types';
import {SelectedAddressBottomSheet} from './BottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {delay} from '../../../utils';
import {AppModal} from '../../../components/AppModal';
import {useLoader} from '../../../contexts/loader-provider';
import {ELoaderType} from '../../../components/AppLoader';
import {restaurantApi} from '../../../api/restaurantApi';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../../hooks';
import {login, updateRestaurantLocation} from '../../../store';

MapBoxGL.setAccessToken(
  'sk.eyJ1IjoiZGluaHBob25naXVoIiwiYSI6ImNtMzc2cjkxajBjZngydnNjbTA3bnprOGwifQ.shuYxnDiqiFIF46wzp-spA',
);

type TCoordinates = {
  longitude: number;
  latitude: number;
};

type TFeature = {
  coordinates: [TCoordinates['longitude'], TCoordinates['latitude']];
  type: string;
};

export type TSuggestionData = {
  name: string;
  mapbox_id: string;
  address: string;
  full_address: string;
};

export const ConfirmLocationMapScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'ConfirmLocationMapScreen'>
> = props => {
  const {t} = useTranslation();
  const {mode} = useThemeMode();
  const {hide, show} = useLoader();
  const dispatch = useAppDispatch();
  const insert = useSafeAreaInsets();
  const cameraRef = useRef<MapBoxGL.Camera>(null);
  const [myLocation, setMyLocation] = useState<[number, number]>();
  const [selectedCoordinate, setSelectedCoordinate] = useState<
    [number, number] | null
  >(null);
  const [selectedPoint, setSelectedPoint] = useState<TFeatureForGeocoding>();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [confirmModalVisible, setConfirmModalVisible] =
    useState<boolean>(false);

  const SelectedAddressBottomSheetRef = useRef<BottomSheetModal>(null);

  // search
  const textInputRef = useRef<TextInput>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const translateYSearchContainer = useSharedValue(0);
  const [searchResults, setSearchResults] = useState<TSuggestionData[]>([]);
  console.log(translateYSearchContainer.value);

  const handleBackOrFocusSearch = () => {
    SelectedAddressBottomSheetRef.current?.dismiss();

    if (isInputFocused) {
      setIsInputFocused(prev => false);
      textInputRef.current?.blur();
    } else textInputRef.current?.focus();
  };

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
    }, 100),
  ).current;

  useEffect(() => {
    debouncedSearch(searchText);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText]);
  // end search

  const handleMapPress = async (feature: any) => {
    SelectedAddressBottomSheetRef.current?.close();
    await delay(500);
    SelectedAddressBottomSheetRef.current?.present();
    const featureData: TFeature = feature.geometry;
    setSelectedCoordinate(prev => [
      featureData.coordinates[0],
      featureData.coordinates[1],
    ]);

    // console.log(feature);
    try {
      const response = await locationApi.getGeocodingByCoodinate(
        featureData.coordinates[0].toString(),
        featureData.coordinates[1].toString(),
      );

      if (response.data.success) {
        const data: TGeocoding = response.data.data;
        // console.log('datqez', data.features[0].properties.fullAddress);
        setSelectedPoint(prev => data.features[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchResultPress = async (mapbox_id: string) => {
    setIsInputFocused(false);
    try {
      const response = await locationApi.getRetrievePoint(mapbox_id);
      if (response.data.success) {
        const data: TfeaturesForRetrieve = response.data.data.features[0];
        setSelectedCoordinate([
          Number(data.geometry.coordinates[0]),
          Number(data.geometry.coordinates[1]),
        ]);
        const propertie = data.properties;
        // console.log('zczcz', propertie.full_address);
        setSearchText(propertie.address);
        SelectedAddressBottomSheetRef.current?.present();
        setSelectedPoint({
          properties: {
            address: propertie.address,
            category: '',
            fullAddress: propertie.full_address,
          },
          place_name: '',
          text: propertie.full_address,
          center: [data.geometry.coordinates[0], data.geometry.coordinates[1]],
        });
        cameraRef.current?.setCamera({
          centerCoordinate: [
            data.geometry.coordinates[0],
            data.geometry.coordinates[1],
          ],
          zoomLevel: 16,
          animationDuration: 200,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rightSearch = useMemo(() => {
    return searchText ? (
      <View style={[style.row, style.mx_xxs]}>
        <TouchableOpacity>
          <Image source={images.xmark_solid} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    ) : undefined;
  }, [searchText]);

  // const rightSearch: React.FC = () => {
  //   return (
  //     <View style={[style.row, style.mx_xxs]}>
  //       <TouchableOpacity>
  //         <Image source={images.xmark_solid} resizeMode="contain" />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const handleConfirmOnBottomSheet = () => {
    if (!selectedPoint) {
      Alert.alert(`${t('common.fail')}`, 'Chưa chọn vị trí!');
    } else {
      setConfirmModalVisible(true);
    }
  };

  const handleConfirm = async () => {
    setConfirmModalVisible(false);
    show(ELoaderType.locationloader);
    await delay(1000);
    if (selectedCoordinate) {
      console.log(selectedPoint?.properties.address);
      hide();
      try {
        const response = await restaurantApi.setLocation({
          longitude: selectedCoordinate[0],
          latitude: selectedCoordinate[1],
          full_address:
            selectedPoint?.properties.address ||
            selectedPoint?.properties.fullAddress ||
            '',
        });
        if (response.data.success) {
          dispatch(login());
          dispatch(updateRestaurantLocation(response.data.location._id));
          Alert.alert(`${t('common.success')}`);
          hide();
          props.navigation.navigate('AppBottomTabbar');
        }
      } catch (error) {
        Alert.alert(`${t('common.fail')}`, `${t('errorMessage.internet')}`);
        hide();
        console.log('error set restaurant location', error);
      }
    }
  };

  return (
    <Layout>
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
      />

      <MapBoxGL.MapView
        styleURL={
          mode === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : undefined
        }
        compassEnabled
        // projection="mercator"
        projection="globe"
        style={style.flex_1}
        attributionEnabled={false}
        logoEnabled={false}
        scaleBarEnabled={false}
        onPress={handleMapPress}>
        <MapBoxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          // followUserLocation={isFirstLoad}
          animationDuration={100}
        />
        <MapBoxGL.UserLocation
          visible={true}
          onUpdate={async location => {
            // console.log('Vị trí hiện tại:', location.coords);
            // !myLocation &&
            //   setMyLocation([
            //     location.coords.longitude,
            //     location.coords.latitude,
            //   ]);
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

              try {
                const response = await locationApi.getGeocodingByCoodinate(
                  location.coords.longitude.toString(),
                  location.coords.latitude.toString(),
                );

                if (response.data.success) {
                  const data: TGeocoding = response.data.data;
                  // console.log('myData', data.features);
                  setSelectedPoint(data.features[0]);
                  SelectedAddressBottomSheetRef.current?.present();
                }
              } catch (error) {
                console.log(error);
              }
            }
          }}
          //
        />

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
      </MapBoxGL.MapView>

      <SelectedAddressBottomSheet
        feature={selectedPoint as TFeatureForGeocoding}
        bottomSheetModalRef={SelectedAddressBottomSheetRef}
        handleConfirm={handleConfirmOnBottomSheet}
      />

      <AppModal
        modalVisible={confirmModalVisible}
        setModalVisible={setConfirmModalVisible}
        content={t('input.confirmLocation.label')}
        title={t('common.confirm')}
        handleCancel={() => setConfirmModalVisible(false)}
        handleOk={handleConfirm}
        btn2Title={t('common.confirm')}
      />
    </Layout>
  );
};
