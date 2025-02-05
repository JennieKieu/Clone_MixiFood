import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../components/Layout/Layout';
import {AppStackParamList} from '../../../navigators';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {palette, scaleFontSize, style} from '../../../theme';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {
  SImageStyle,
  STextStyle,
  SViewStyle,
  TSeatingForStore,
} from '../../../models';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {formatPrice} from '../../../utils/number';
import {useState} from 'react';
import {TPrieViewFood} from '../OrderFood';
import {
  TFoodByOrder,
  TOrder,
  TOrderFoodBySite,
  TOrderStatus,
} from '../../../models/order';
import {employeeApi} from '../../../api/employeeApi';
import {useLoader} from '../../../contexts/loader-provider';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {
  resetOrderByEmployee,
  selectSeatingsByEmployee,
  updateSeatOrder,
} from '../../../store';
import {ELoaderType} from '../../../components/AppLoader';
import {delay} from '../../../utils';

export const ConfirmOrderScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'ConfirmOrderScreen'>
> = props => {
  const {t} = useTranslation();
  const {show, hide} = useLoader();
  const selectedSeat = useAppSelector(selectSeatingsByEmployee).find(
    item => item._id === props.route.params.seatId,
  );

  const dispatch = useAppDispatch();

  const [orderedFoods, setOrderedFoods] = useState<TPrieViewFood[]>(
    props.route.params.orderedFoods,
  );
  const {colorScheme, isDarkMode} = useThemeContext();

  const updateQuantity = (id: string, quantity: number) => {
    setOrderedFoods(prevState =>
      prevState.map((food, index) =>
        food._id === id ? {...food, quantity: quantity} : food,
      ),
    );
  };

  const increaseQuantity = (id: string, quantity: number) => {
    updateQuantity(id, ++quantity);
  };

  const decreaseQuantity = (id: string, quantity: number) => {
    quantity > 1
      ? updateQuantity(id, --quantity)
      : setOrderedFoods(prev => prev.filter(item => item._id !== id));
  };

  const handleOrder = async () => {
    show(ELoaderType.orderLoader1);
    const foodByOrder: TFoodByOrder[] = orderedFoods.map(food => ({
      foodId: food._id,
      quantity: food.quantity,
    }));

    const data: TOrderFoodBySite = {
      seatId: props.route.params.seatId,
      foodItems: foodByOrder,
    };

    try {
      // when seat empty order
      if (!selectedSeat?.currentOrderId) {
        const response = await employeeApi.orderFoodOnSite(data);
        if (response.data.success) {
          const seat: TSeatingForStore = response.data.seat;
          dispatch(updateSeatOrder(seat));
          Alert.alert(
            t(
              'common.success',
              t('confirmOrderScreenByEmployee.alert.orderSuccess.title'),
            ),
          );
          props.navigation.goBack();
          hide();
        }
      } else {
        const response = await employeeApi.nextOrder(data);
        if (response.data.order) {
          Alert.alert(
            t(
              'common.success',
              t('confirmOrderScreenByEmployee.alert.orderSuccess.title'),
            ),
          );
          props.navigation.goBack();
        }
        hide();
      }
    } catch (error) {
      console.log('orderError ?', error);
      hide();
    }
  };

  return (
    <Layout
      safeAreaOnTop
      backgroundColor={isDarkMode ? palette.gray20 : palette.gray3}>
      <View style={[style.mx_md, style.row_between, style.mb_lg]}>
        <TouchableOpacity
          style={[
            {backgroundColor: colorScheme.textSolid, borderRadius: 6},
            style.p_sm,
          ]}
          onPress={() => props.navigation.goBack()}>
          <AppImage source={images.back_icon} resizeMode="contain"></AppImage>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={style.mx_md}>
          <View>
            <Text style={$textTile1}>
              {t('confirmOrderScreenByEmployee.title.1')}
            </Text>
            <Text style={$textTile2}>
              {t('confirmOrderScreenByEmployee.title.2')}
            </Text>
          </View>
          {/* foods */}
          <View>
            {orderedFoods.map((item, index) => (
              <View style={$foodContainer} key={item._id}>
                <View style={$leftFoodContainer}>
                  <Image source={{uri: item.foodImage}} style={$foodImg} />
                  <View>
                    <Text style={$foodName}>{item.name}</Text>
                    <View style={[style.row_center, style.mt_xxs]}>
                      <Text style={$price}>
                        {formatPrice(
                          (Number(item.price) * item.quantity).toString(),
                        )}
                      </Text>
                      <Text style={$quantity}>x{item.quantity}</Text>
                    </View>
                  </View>
                </View>
                <View style={[$rightFoodContainer, {backgroundColor: '#000'}]}>
                  <TouchableOpacity
                    style={[
                      $increaseBnt,
                      {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
                    ]}
                    onPress={() => increaseQuantity(item._id, item.quantity)}>
                    <Text style={[$increaseText, {color: palette.white}]}>
                      +
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[$decreaseBtn, {backgroundColor: '#000'}]}
                    onPress={() => decreaseQuantity(item._id, item.quantity)}>
                    <Text style={[$increaseText, {color: palette.white}]}>
                      –
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          {/*  */}
        </View>
      </ScrollView>
      <View
        style={[
          {
            // height: 200,
            backgroundColor: colorScheme.background,
            borderRadius: scaleFontSize(30),
          },
          style.shadow,
          style.justify_end,
          style.pb_xl,
        ]}>
        <View style={[style.mx_xl, style.mt_xl]}>
          <View style={style.row_between}>
            <Text style={$subDetailText}>Subtotal</Text>
            <Text style={$subDetailText}>
              {formatPrice(
                orderedFoods
                  .reduce(
                    (acc, cur) => acc + Number(cur.price) * cur.quantity,
                    0,
                  )
                  .toString(),
              )}{' '}
              VNĐ
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[style.my_sm, {opacity: 0.5}]}>
            {`-`.repeat(500)}ád
          </Text>
          <View style={style.row_between}>
            <Text style={$detailtText}>Total</Text>
            <Text style={$detailtText}>
              {formatPrice(
                orderedFoods
                  .reduce(
                    (acc, cur) => acc + Number(cur.price) * cur.quantity,
                    0,
                  )
                  .toString(),
              )}{' '}
              VNĐ
            </Text>
          </View>
          <Button
            type="solid"
            title={'Order now'}
            containerStyle={style.pt_lg}
            disabled={orderedFoods.length < 1}
            onPress={handleOrder}
          />
        </View>
      </View>
    </Layout>
  );
};

const $textTile1: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(25)},
];

const $textTile2: STextStyle = [
  style.tx_font_regular,
  {fontSize: scaleFontSize(25)},
];
const $foodImg: SImageStyle = [
  {
    height: '100%',
    // width: scaleFontSize(80),
    width: '40%',
    resizeMode: 'contain',
    borderRadius: 999,
  },
];
const $foodName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(16)},
  style.pb_xxs,
];
const $price: STextStyle = [
  style.tx_font_semiBold,
  {fontSize: scaleFontSize(14)},
  style.mr_sm,
];
const $quantity: STextStyle = [
  style.tx_font_bold,
  {opacity: 0.5, fontSize: scaleFontSize(14)},
];
const $increaseBnt: SViewStyle = [
  {
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
    width: '100%',
    height: '50%',
  },
  style.center,
];
const $decreaseBtn: SViewStyle = [
  {height: '50%', width: '100%'},
  style.center,
  style.px_md,
];
const $foodContainer: SViewStyle = [
  style.row_between,
  {height: scaleFontSize(100)},
  style.mb_lg,
];
const $leftFoodContainer: SViewStyle = [
  style.row,
  {width: '80%', height: '100%'},
  style.align_center,
];
const $rightFoodContainer: SViewStyle = [
  {
    height: '100%',
    borderRadius: scaleFontSize(8),
  },
  style.justify_between,
  style.align_center,
  style.overflow_hidden,
];
const $increaseText: STextStyle = [{fontSize: scaleFontSize(25)}];
const $subDetailText: STextStyle = [style.tx_font_bold, {opacity: 0.5}];
const $detailtText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(15)},
];
