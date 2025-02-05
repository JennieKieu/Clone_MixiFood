import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {STextStyle, SViewStyle} from '../../../models';
import {palette, scale, scaleFontSize, spacing, style} from '../../../theme';
import {Button, Text} from '@rneui/themed';
import {ScrollView} from 'react-native-gesture-handler';
import {images} from '../../../../assets';
import {useTranslation} from 'react-i18next';
import {useCallback, useMemo, useState} from 'react';
import Animated, {
  AnimatedStyle,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from '../../../contexts/ThemeContext';

type RestaurantBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheet>;
  snapoints: string[];
  handleNavigation: () => void;
  animatedPosition: SharedValue<number>;
  heightAnimatedStyle: AnimatedStyle<{height: number}>;
};

const {height} = Dimensions.get('screen');
export const RestaurantBottomSheet: React.FC<RestaurantBottomSheetProps> = ({
  bottomSheetModalRef,
  snapoints,
  handleNavigation,
  animatedPosition,
  ...rest
}) => {
  const {t} = useTranslation();
  const insert = useSafeAreaInsets();
  const {colorScheme} = useThemeContext();
  // const animatedPosition = useSharedValue(0);
  const animatedIndex = useSharedValue(0);

  const handleSheetAnimate = (fromIndex: number, toIndex: number) => {
    const currentPosition = animatedPosition.value;
    console.log(`Index đang di chuyển từ ${fromIndex} đến ${toIndex}`);
  };
  useAnimatedReaction(
    () => animatedPosition.value,
    position => {
      // console.log(`Chiều cao hiện tại của BottomSheet: ${position}`);
    },
  );

  // const heightAnimatedStyle = useAnimatedStyle(() => {
  //   const bottomSheetHeight = height - animatedPosition.value;
  //   // console.log(`Chiều cao hiện tại của BottomSheet131: ${bottomSheetHeight}`);
  //   return {
  //     height: bottomSheetHeight,
  //   };
  // });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const snapPoint0 = height * 0.1;
    const snapPoint1 = height * 0.99;

    // Opacity giảm dần từ 1 đến 0 khi kéo BottomSheet xuống
    const opacity = interpolate(
      animatedPosition.value,
      [snapPoint1, snapPoint0], // Mức độ di chuyển của BottomSheet
      [0, 1], // Opacity thay đổi từ 1 đến 0
      Extrapolation.CLAMP, // Giới hạn giá trị opacity từ 0 đến 1
    );
    return {
      opacity,
    };
  });

  const restaurantNameAnimatedStyle = useAnimatedStyle(() => {
    // Di chuyển tên nhà hàng lên khi kéo BottomSheet
    const translateY = interpolate(
      animatedPosition.value,
      [0, height * 0.3],
      [0, -30],
    );
    return {
      transform: [{translateY}],
    };
  });

  const scrollViewAnimatedStyle = useAnimatedStyle(() => {
    // Đưa ScrollView lên khi kéo xuống
    const translateY = interpolate(
      animatedPosition.value,
      [0, height * 0.3],
      [0, -15],
    );
    return {
      transform: [{translateY}],
    };
  });

  return (
    <BottomSheet
      {...rest}
      ref={bottomSheetModalRef}
      enablePanDownToClose
      snapPoints={snapoints}
      index={-1}
      //   onChange={handleSheetChange}
      onAnimate={handleSheetAnimate}
      animatedPosition={animatedPosition}
      animatedIndex={animatedIndex}
      style={{marginTop: insert.top || 60}}>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          <View style={style.mx_md}>
            {/* <TouchableOpacity style={[style.row]}>
              <Animated.View style={imageAnimatedStyle}>
                <Image
                  source={{
                    uri: 'https://static.wanderon.in/wp-content/uploads/2023/12/restaurants-in-vietnam.jpg',
                  }}
                  style={{width: 120, height: 120, borderRadius: 8}}
                />
                <View style={style.row_center}>
                  <Image source={images.star_solid}></Image>
                  <Text> | 4.0 </Text>
                </View>
                <View style={style.row_center}>
                  <Text>icon</Text>
                  <Text>1 km</Text>
                </View>
              </Animated.View>
              <View
                style={[{width: '60%'}, style.ml_sm, style.justify_between]}>
                <View>
                  <Text style={$restaurantName}>Restaurant name</Text>
                  <Text>Số 463 Phan Văn Trị, P.5, Q. Gò Vấp</Text>
                </View>
                <Button type="solid" title={'Đặt bàn'}></Button>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity style={[style.row]}>
              <Animated.View style={imageAnimatedStyle}>
                <Image
                  source={{
                    uri: 'https://static.wanderon.in/wp-content/uploads/2023/12/restaurants-in-vietnam.jpg',
                  }}
                  style={{width: 120, height: 120, borderRadius: 8}}
                />
                <View style={style.row_center}>
                  <Image source={images.star_solid}></Image>
                  <Text> | 4.0 </Text>
                </View>
                <View style={style.row_center}>
                  <Text>icon</Text>
                  <Text>1 km</Text>
                </View>
              </Animated.View>
              <View
                style={[{width: '60%'}, style.ml_sm, style.justify_between]}>
                <View>
                  <Text style={$restaurantName}>Restaurant name</Text>
                  <Text>Số 463 Phan Văn Trị, P.5, Q. Gò Vấp</Text>
                </View>
                <Button type="solid" title={'Đặt bàn'}></Button>
              </View>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={$btn} onPress={handleNavigation}>
                <Image
                  source={images.navigation_siolid}
                  style={{marginRight: scaleFontSize(5)}}
                />
                <Text
                  style={[
                    style.tx_font_bold,
                    {fontSize: scaleFontSize(14), color: palette.white},
                  ]}>
                  Đường đi
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
];

const $restaurantName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(18)},
];
const $btn: SViewStyle = [
  style.p_sm,
  style.row_center,
  {backgroundColor: palette.primary4, borderRadius: 999},
];
