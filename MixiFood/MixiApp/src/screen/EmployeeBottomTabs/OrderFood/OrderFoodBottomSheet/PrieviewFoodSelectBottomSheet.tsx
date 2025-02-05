import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo} from 'react';
import {TFood} from '../../../../models/food';
import {
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {SImageStyle, STextStyle, SViewStyle} from '../../../../models';
import {palette, scaleFontSize, spacing, style} from '../../../../theme';
import {Button, Text} from '@rneui/themed';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {images} from '../../../../../assets';
import {BottomSheetDefaultFooterProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {formatPrice} from '../../../../utils/number';

type PrieviewFoodBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
  food: TFood;
  onQuantityChange: (quantity: number) => void;
  handleConfirm: () => void;
} & Omit<BottomSheetModalProps, 'children'>;

export const PrieviewFoodBottomSheet: React.FC<
  PrieviewFoodBottomSheetProps
> = ({
  bottomSheetModalRef,
  food,
  snapPoints,
  onQuantityChange,
  handleConfirm,
  ...rest
}) => {
  const {t} = useTranslation();
  const layout = useWindowDimensions();
  const {colorScheme, isDarkMode} = useThemeContext();

  const increaseQuantity = () => {
    food.quantity && onQuantityChange(food.quantity++);
  };

  const decreaseQuantity = () => {
    if (food.quantity && food.quantity > 0) {
      onQuantityChange(food.quantity--);
    }
  };

  useMemo(() => {
    food?.quantity === 0 && bottomSheetModalRef.current?.dismiss();
  }, [food?.quantity]);

  const renderFooter = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={14} style={style.mx_sm}>
        <View style={$footerContainer}>
          <View>
            <Text style={[{opacity: 0.5}, style.tx_font_bold]}>
              {t('common.totalPrice')}
            </Text>
            <Text style={[style.tx_font_bold, {fontSize: scaleFontSize(24)}]}>
              {formatPrice(
                (Number(food.price) * (food.quantity || 1)).toString(),
              )}
              <Text style={[{color: '#febd2e'}, style.tx_font_bold]}>VNĐ</Text>{' '}
            </Text>
          </View>
          <View style={{width: '50%'}}>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[$footerBtn, {backgroundColor: colorScheme.buttonSolid}]}>
              <Text
                style={[
                  {color: colorScheme.textSolid, fontSize: scaleFontSize(14)},
                ]}>
                {t('common.confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetFooter>
    ),
    [food, food?.quantity],
  );

  return (
    <BottomSheetModal
      {...rest}
      ref={bottomSheetModalRef}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      enablePanDownToClose
      enableDismissOnClose
      //   enableDynamicSizing
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: isDarkMode ? palette.gray20 : palette.gray3,
      }}
      footerComponent={renderFooter}>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          <View style={[{height: layout.height / 2.5}, style.center]}>
            <Image source={{uri: food?.foodImage}} style={[$foodImage]} />
          </View>
          <View
            style={[
              $contentContainer,
              {backgroundColor: colorScheme.background},
            ]}>
            <View style={style.center}>
              <View style={$controlleView}>
                <View
                  style={[
                    $leftController,
                    {
                      backgroundColor: colorScheme.background,
                      shadowColor: colorScheme.text,
                    },
                  ]}>
                  <Image source={images.star_solid}></Image>
                  <Text
                    style={[
                      {fontSize: scaleFontSize(16)},
                      style.tx_font_medium,
                    ]}>
                    {' '}
                    5.0
                  </Text>
                </View>
                <View
                  style={[$rightController, {shadowColor: colorScheme.text}]}>
                  <TouchableOpacity onPress={decreaseQuantity}>
                    <Text style={{fontSize: scaleFontSize(25)}}>–</Text>
                  </TouchableOpacity>
                  <Text style={$quantityText}>
                    {Number(food?.quantity) > 10
                      ? food?.quantity
                      : `0${food?.quantity}`}
                  </Text>
                  <TouchableOpacity onPress={increaseQuantity}>
                    <Text style={{fontSize: scaleFontSize(25)}}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* <Text>content</Text> */}
            <View style={$content}>
              <View style={[style.row_between, style.mt_md]}>
                <View style={{width: '50%'}}>
                  <Text style={$foodName}>{food?.name}</Text>
                </View>
                <View style={[style.row]}>
                  <Image source={images.alarm_clock}></Image>
                  <Text
                    style={[
                      style.ml_xs,
                      style.tx_font_medium,
                      {fontSize: scaleFontSize(14), opacity: 0.6},
                    ]}>
                    10-15 Mins
                  </Text>
                </View>
              </View>
              {/* Description View */}
              <View style={style.mt_sm}>
                <Text style={[{opacity: 0.5}, style.tx_font_regular]}>
                  Grilled meat skewears, shish kebad and healthy to vegetable
                  salad of fresh tomato cucumbe.
                </Text>
              </View>
              {/* End description View */}
              {/* Toping comming son */}
              <View style={[style.row_between, style.my_md]}>
                <Text
                  style={[style.tx_font_bold, {fontSize: scaleFontSize(14)}]}>
                  Topping for you
                </Text>
                <TouchableOpacity>
                  <Text
                    style={[
                      {color: palette.primary4, opacity: 0.6},
                      style.tx_font_bold,
                    ]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal>
                <View style={[style.pt_sm]}>
                  <View
                    style={[
                      {
                        backgroundColor: isDarkMode
                          ? palette.gray20
                          : palette.gray3,
                        width: scaleFontSize(60),
                        height: scaleFontSize(60),
                        borderRadius: 6,
                      },
                    ]}>
                    <TouchableOpacity
                      style={[
                        style.abs,
                        {
                          right: -10,
                          top: -10,
                          backgroundColor: colorScheme.text,
                          borderRadius: 999,
                          width: scaleFontSize(30),
                          height: scaleFontSize(30),
                        },
                        style.center,
                      ]}>
                      <Text
                        style={[
                          {
                            color: colorScheme.textSolid,
                            fontSize: scaleFontSize(20),
                          },
                        ]}>
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[style.center, style.ml_lg]}>
                  <Text>Comming son ...</Text>
                </View>
              </ScrollView>
              {/* End toping comming son */}
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
];

const $foodImage: SImageStyle = [
  {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
];
const $contentContainer: SViewStyle = [
  {
    borderRadius: 30,
    // backgroundColor: 'white',
    height: '1000%',
  },
];
const $controlleView: SViewStyle = [
  style.abs,
  {width: '80%'},
  style.mx_sm,
  style.row_between,
];
const $leftController: SViewStyle = [
  {backgroundColor: palette.white, borderRadius: scaleFontSize(999)},
  style.shadow,
  style.p_xs,
  style.row_center,
];
const $rightController: SViewStyle = [
  style.p_xxs,
  style.px_md,
  {backgroundColor: '#febd2e', borderRadius: 999},
  style.row_center,
  style.shadow,
];
const $quantityText: STextStyle = [
  style.mx_sm,
  {fontSize: scaleFontSize(16)},
  style.tx_font_semiBold,
];
const $content: SViewStyle = [style.mx_xl, style.mt_xl];
const $foodName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(25)},
];
const $footerContainer: SViewStyle = [
  style.row_between,
  style.mx_sm,
  Platform.OS === 'ios' && style.mb_md,
];
const $footerBtn: SViewStyle = [
  style.p_md,
  style.center,
  {borderTopRightRadius: 18, borderBottomLeftRadius: 18, height: '100%'},
];
