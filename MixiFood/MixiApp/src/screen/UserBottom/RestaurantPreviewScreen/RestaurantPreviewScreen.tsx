import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../components/Layout/Layout';
import {AppStackParamList} from '../../../navigators';
import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Button, Text} from '@rneui/themed';
import {STextStyle, SViewStyle} from '../../../models';
import {palette, scaleFontSize, spacing, style} from '../../../theme';
import {images} from '../../../../assets';
import {AppImage} from '../../../components/AppImage';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useEffect, useLayoutEffect} from 'react';
import {useRestaurantInfo} from '../../../hooks/userHooks/useRestaurantInfo';

export const RestaurantPrieviewScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'RestaurantPrieviewScreen'>
> = props => {
  const {t} = useTranslation();
  const insert = useSafeAreaInsets();
  const {colorScheme} = useThemeContext();
  const {restaurantId, locationData} = props.route.params;

  const {restaurantInfo} = useRestaurantInfo({restaurantId});

  useLayoutEffect(() => {
    props.navigation.setOptions({
      animation: 'fade_from_bottom',
    });
  }, []);

  return (
    <Layout backgroundColor={colorScheme.grayBackgroundColor}>
      <View
        style={[$header, {top: insert.top || spacing.sm, right: 0, left: 0}]}>
        <View style={[style.mx_sm, style.row_between]}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <AppImage source={images.angle_left} />
          </TouchableOpacity>
          <View></View>
        </View>
      </View>
      <Animated.ScrollView>
        <ImageBackground
          source={{
            uri: 'https://static.wanderon.in/wp-content/uploads/2023/12/restaurants-in-vietnam.jpg',
          }}
          style={$imageBackground}>
          <View style={[style.row_between, style.mx_sm, style.mb_xxxs]}>
            <View style={$bcgView}>
              <Text>4.0 </Text>
              <Image source={images.star_solid} />
            </View>
            <View style={$bcgView}>
              <Image source={images.map_location} />
              <Text> {locationData?.distance?.toFixed(2) || ''} km</Text>
            </View>
          </View>
        </ImageBackground>
        {/*  */}
        <View style={[style.px_sm, {backgroundColor: palette.white}]}>
          <Text style={$restaurantName}>{restaurantInfo?.restaurantName}</Text>
          <View style={[style.row, style.align_center, style.my_xs]}>
            <AppImage
              source={images.location}
              style={{width: 16, height: 16}}
            />
            {/* <Text>108 Nguyễn Thái Sơn, Phường 3, Gò Vấp</Text> */}
            <Text numberOfLines={1}>{locationData.full_address}</Text>
          </View>
          <View style={[style.row, style.align_center, style.my_xs]}>
            <AppImage
              source={images.location}
              style={{width: 16, height: 16}}
            />
            <Text>250.000 - 500.000 đ/ người</Text>
          </View>
        </View>
        {/*  */}
        <View
          style={[style.px_sm, {backgroundColor: palette.white}, style.mt_sm]}>
          <View style={[style.row]}>
            <Text>Icon</Text>
            <Text> Đang mở cửa 08:00 - 23:00</Text>
          </View>
        </View>
        {/*  */}
        <View
          style={[style.px_sm, {backgroundColor: palette.white}, style.mt_sm]}>
          <View style={[style.row]}>
            <Text>Icon</Text>
            <Text> Đặt chỗ</Text>
          </View>
          <View style={[style.row_between]}>
            <Text>Icon</Text>
            <Button
              type="solid"
              title={'Book now'}
              onPress={() =>
                props.navigation.navigate('TableBookingScreen', {restaurantId})
              }
            />
          </View>
        </View>
      </Animated.ScrollView>
    </Layout>
  );
};

const $imageBackground: SViewStyle = [
  {width: '100%', height: 200, borderRadius: 8},
  style.justify_end,
];
const $bcgView: SViewStyle = [
  {backgroundColor: palette.primary1, borderRadius: 6},
  style.p_xxs,
  style.row_center,
];
const $restaurantName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(20)},
];
const $header: SViewStyle = [style.abs, {zIndex: 2}];
