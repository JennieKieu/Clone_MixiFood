import BottomSheet, {
  BottomSheetProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  STextStyle,
  SViewStyle,
  TCoordinate,
  TRestaurantForMap,
} from '../../../../models';
import {scaleFontSize, spacing, style} from '../../../../theme';
import {Button, Text} from '@rneui/themed';
import {
  AnimatedStyle,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {images} from '../../../../../assets';
import {AppImage} from '../../../../components/AppImage';

type MapRestaurantBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheet>;
  snapoints: string[];
  animatedPosition: SharedValue<number>;
  heightAnimatedStyle: AnimatedStyle<{height: number}>;
  restaurants: TRestaurantForMap[] | undefined;
  handleDirections: (coordinate: TCoordinate) => void;
  handleRestaurantPress: (
    restaurantId: string,
    locationDat: TRestaurantForMap,
  ) => void;
} & Omit<BottomSheetProps, 'children'>;

const {height} = Dimensions.get('screen');
export const MapRestaurantBottomSheet: React.FC<
  MapRestaurantBottomSheetProps
> = ({
  bottomSheetModalRef,
  snapoints,
  animatedPosition, //screen height - bottomSheet height
  heightAnimatedStyle,
  restaurants,
  handleDirections,
  handleRestaurantPress,
  ...rest
}) => {
  const {t} = useTranslation();
  const insert = useSafeAreaInsets();
  const animatedIndex = useSharedValue(0);

  useAnimatedReaction(
    () => animatedPosition.value,
    position => {
      //   console.log(`Chiều cao hiện tại của BottomSheet: ${position}`);
    },
  );

  return (
    <BottomSheet
      {...rest}
      ref={bottomSheetModalRef}
      enablePanDownToClose
      snapPoints={snapoints}
      index={1}
      style={{marginTop: insert.top}}
      animatedPosition={animatedPosition}>
      <BottomSheetScrollView>
        <View style={[$modalContent]}>
          {/* filter  */}
          <View style={$filter}>
            <TouchableOpacity style={$filterBtn}>
              <Text>fillter</Text>
              <AppImage
                source={images.chevron_down}
                style={{marginHorizontal: spacing.xxs}}
              />
            </TouchableOpacity>
          </View>
          {/* restaurants */}
        </View>
        <View style={[style.mx_md, style.mt_sm, {marginBottom: insert.bottom}]}>
          {restaurants?.map(item => (
            <TouchableOpacity
              style={$restaurant}
              key={item._id}
              onPress={() => handleRestaurantPress(item.restaurantId, item)}>
              <View style={style.flex_1}>
                <Image
                  source={{
                    uri: 'https://static.wanderon.in/wp-content/uploads/2023/12/restaurants-in-vietnam.jpg',
                  }}
                  style={{height: 120, borderRadius: 8}}
                />
                <View style={[style.row_center, style.my_xxs]}>
                  <Image source={images.star_solid} />
                  <Text>4.0</Text>
                </View>
                <View style={style.row_center}>
                  <AppImage
                    source={images.map_location}
                    style={{width: 14, height: 14, resizeMode: 'contain'}}
                  />
                  {/* <Text> 1.9 km</Text> */}
                  <Text> {item.distance?.toFixed(2) || ''} km</Text>
                </View>
              </View>
              <View style={[style.ml_sm, style.justify_between, {flex: 2}]}>
                <View>
                  <Text style={$restaurantName}>{item.directionName}</Text>
                  {/* <Text>Số 463 Phan Văn Trị, P.5, Q. Gò Vấp</Text> */}
                  <Text>{item.full_address}</Text>
                </View>
                <Button
                  type="outline"
                  title={t('common.directions')}
                  onPress={() => handleDirections(item.direction)}
                />
                <Button type="solid" title={t('common.reservation')} />
              </View>
            </TouchableOpacity>
          ))}
          {/* <TouchableOpacity style={$restaurant}>
            <View style={style.flex_1}>
              <Image
                source={{
                  uri: 'https://static.wanderon.in/wp-content/uploads/2023/12/restaurants-in-vietnam.jpg',
                }}
                style={{height: 120, borderRadius: 8}}
              />
              <View style={[style.row_center, style.my_xxs]}>
                <Image source={images.star_solid} />
                <Text>4.0</Text>
              </View>
              <View style={style.row_center}>
                <AppImage
                  source={images.map_location}
                  style={{width: 14, height: 14, resizeMode: 'contain'}}
                />
                <Text> 1.9 km</Text>
              </View>
            </View>
            <View style={[style.ml_sm, style.justify_between, {flex: 2}]}>
              <View>
                <Text style={$restaurantName}>Restaurant name</Text>
                <Text>Số 463 Phan Văn Trị, P.5, Q. Gò Vấp</Text>
              </View>
              <Button type="outline" title={t('common.directions')} />
              <Button type="solid" title={t('common.reservation')} />
            </View>
          </TouchableOpacity> */}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  //   style.overflow_hidden,
];
const $filter: SViewStyle = [style.mx_md, style.row];
const $restaurant: SViewStyle = [style.row, style.mb_md];
const $restaurantName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(18)},
];
const $filterBtn: SViewStyle = [
  style.p_sm,
  {borderRadius: 999, borderWidth: 1},
  style.row_center,
];
