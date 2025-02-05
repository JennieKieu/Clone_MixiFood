import {
  Image,
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {scaleFontSize, style} from '../../../theme';
import {Text} from '@rneui/themed';
import {formatPrice} from '../../../utils/number';
import {TFoodToServing} from './ServingScreen';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../assets/lottieAnimation';
import {format} from 'date-fns';

export type TRenderServingFoodsProps = {
  food?: TFoodToServing;
} & TouchableOpacityProps;

export const RenderServingFoods: React.FC<TRenderServingFoodsProps> = ({
  food,
  ...rest
}) => {
  const {colorScheme} = useThemeContext();

  return (
    <TouchableOpacity
      {...rest}
      style={[
        $foodBtn,
        {shadowColor: colorScheme.text},
        Platform.OS === 'android' && {
          // sshadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        },
      ]}>
      <View
        style={[
          $leftFoodBtn,
          {backgroundColor: colorScheme.background},
          Platform.OS === 'android' && {
            // sshadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
        ]}>
        <View style={$leftBtnContent}>
          <Image
            style={$foodImg}
            source={{
              uri: food?.foodImage,
            }}
          />
        </View>
        <View
          style={[
            {
              borderWidth: 0.4,
              borderStyle: 'dashed',
              opacity: 0.6,
              width: 0.8,
              borderRadius: 14,
            },
            {},
          ]}
        />
      </View>
      <View
        style={[
          $rightFoodBtn,
          {backgroundColor: colorScheme.background},
          Platform.OS === 'android' && {
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
        ]}>
        <View style={{width: '85%'}}>
          <View style={style.row_between}>
            <Text style={$foodTitle}>{food?.name}</Text>
          </View>
          <Text style={$foodDescription}>{food?.seat.seatName}</Text>
          <View style={[style.row, style.align_center]}>
            <Text style={$priceText}>
              {formatPrice(food?.price as string)} VNĐ
            </Text>
            <Text style={$quantityText}>x{food?.quantity}</Text>
          </View>
        </View>
        <View style={style.align_end}>
          <Text>{format(food?.orderTime || 0, 'HH:mm')}</Text>
          <LottieView
            source={
              food?.status === 'pending'
                ? lottieAnmiations.pending
                : food?.status === 'cancel'
                ? lottieAnmiations.cancel
                : food?.status === 'complete'
                ? lottieAnmiations.checkBox
                : food?.status === 'serve'
                ? lottieAnmiations.pending
                : lottieAnmiations.cancel
            }
            autoPlay
            style={{
              width: scaleFontSize(
                food?.status === 'cancel' || food?.status === 'canceling'
                  ? 30
                  : 20,
              ),
              height: scaleFontSize(
                food?.status === 'cancel' || food?.status === 'canceling'
                  ? 30
                  : 20,
              ),
            }}
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const $foodBtn: SViewStyle = [
  style.row_between,
  style.mb_sm,
  // fix shadow on android ???
  {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 1.0,

    elevation: 5,
    height: scaleFontSize(130),
  },
];
const $leftFoodBtn: SViewStyle = [
  style.row,
  style.justify_between,
  style.overflow_hidden,
  {
    width: '30%',
    borderTopRightRadius: 14,
    borderBottomEndRadius: 14,
    borderRadius: 6,
  },
];
const $foodImg: SImageStyle = [
  {resizeMode: 'contain', maxWidth: '100%', height: '100%'},
];
const $leftBtnContent: SViewStyle = [
  {padding: scaleFontSize(4), width: '98%', height: '100%'},
];
const $priceText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(14), maxWidth: '50%'},
  style.mr_xs,
];
const $foodTitle: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(16)},
];
const $rightFoodBtn: SViewStyle = [
  {
    width: '70%',
    height: '100%',
    borderTopLeftRadius: 14,
    borderBottomStartRadius: 14,
    borderRadius: 6,
  },
  style.p_sm,
  style.row_between,
];
const $foodDescription: STextStyle = [style.tx_font_boldItalic, style.py_sm];
const $quantityText: STextStyle = [
  {fontSize: scaleFontSize(14)},
  style.tx_font_bold,
];
