import {
  Image,
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {scale, scaleFontSize, style} from '../../../theme';
import {Text} from '@rneui/themed';
import {formatPrice} from '../../../utils/number';
import {TextInput} from 'react-native-gesture-handler';

export type TRenderFood = {
  foodName: string;
  start?: number;
  price: string;
  available: boolean;
  foodImage: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
} & TouchableOpacityProps;

export const RenderFood: React.FC<TRenderFood> = ({
  available,
  foodName,
  price,
  start,
  foodImage,
  onQuantityChange,
  quantity,
  ...rest
}) => {
  const {colorScheme} = useThemeContext();

  const increaseQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <TouchableOpacity
      {...rest}
      disabled={!available}
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
              // uri: 'https://mixiappmobile1.s3.amazonaws.com/uploads/1729045435761_image.png',
              uri: foodImage,
            }}
          />
        </View>
        <View
          style={[
            {
              borderWidth: 0.4,
              borderStyle: 'dashed',
              // height: 70,
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
        <View style={style.row_between}>
          <Text style={$foodTitle}>{foodName}</Text>
          <View
            style={{
              backgroundColor: available
                ? colorScheme.success
                : colorScheme.error,
              width: 10,
              height: 10,
              borderRadius: 10,
            }}></View>
        </View>
        <Text style={$foodDescription}>descriptTion ?</Text>
        <View style={[style.row_between, style.pb_lg]}>
          <Text style={$priceText}>{formatPrice(price)} VNĐ</Text>
          <View style={style.row_center}>
            {quantity !== 0 && (
              <TouchableOpacity
                disabled={!available}
                style={[{backgroundColor: colorScheme.buttonSolid}, $volumnBtn]}
                onPress={decreaseQuantity}>
                <Text style={[{color: colorScheme.textSolid}, $buttonTitle]}>
                  -
                </Text>
              </TouchableOpacity>
            )}
            <TextInput
              value={String(quantity)}
              style={[style.mx_xxs]}
              maxLength={2}
              keyboardType="numeric"
              editable={available}
            />
            <TouchableOpacity
              disabled={!available}
              onPress={increaseQuantity}
              style={[{backgroundColor: colorScheme.buttonSolid}, $volumnBtn]}>
              <Text style={[{color: colorScheme.textSolid}, $buttonTitle]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
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
    height: scale.y(130, 130 * 2),
  },
];
const $addAnimated: SViewStyle = [
  {width: scaleFontSize(30), height: scaleFontSize(30)},
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
const $rightFoodBtn: SViewStyle = [
  {
    width: '70%',
    height: '100%',
    borderTopLeftRadius: 14,
    borderBottomStartRadius: 14,
    // padding: 4,
    borderRadius: 6,
  },
  style.p_sm,
];
const $leftBtnContent: SViewStyle = [
  {padding: scaleFontSize(4), width: '98%', height: '100%'},
];
const $foodImg: SImageStyle = [
  {resizeMode: 'contain', maxWidth: '100%', height: '100%'},
];
const $foodTitle: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(16)},
];
const $priceText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(14), maxWidth: '50%'},
];
const $foodDescription: STextStyle = [style.tx_font_extraLight, style.py_sm];
const $buttonTitle: STextStyle = [
  style.py_xxs,
  style.px_xs,
  {fontSize: scaleFontSize(20)},
];
const $volumnBtn: SViewStyle = [{borderRadius: scaleFontSize(4)}];
