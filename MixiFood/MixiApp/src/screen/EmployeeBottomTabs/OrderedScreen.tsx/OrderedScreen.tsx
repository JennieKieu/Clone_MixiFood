import {Button, Text, useThemeMode} from '@rneui/themed';
import {Layout} from '../../../components/Layout/Layout';
import {useTranslation} from 'react-i18next';
import {palette, scaleFontSize, style} from '../../../theme';
import {ScrollView} from 'react-native-gesture-handler';
import {Image, View} from 'react-native';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {useAppSelector} from '../../../hooks';
import {selectFoodsByEmployee, selectSeatingsByEmployee} from '../../../store';
import {formatPrice} from '../../../utils/number';
import {useEffect, useMemo, useState} from 'react';
import {TFoodByOrder, TOrderedFood} from '../../../models/order';
import {employeeApi} from '../../../api/employeeApi';
import {TFood} from '../../../models/food';
import {format} from 'date-fns';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../assets/lottieAnimation';
import socketClient from '../../../socket/socketClient';
import {TUpdateOrderItemStatus} from '../../../hooks/Ordes';

export type OrderedScreenProps = {
  seatId: string;
  handlePayPress: () => void;
  paymentding: boolean;
};

export const OrderedScreen: React.FC<OrderedScreenProps> = ({
  seatId,
  handlePayPress,
  paymentding,
}) => {
  const {mode} = useThemeMode();
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const [orderedFoods, setOrderedFoods] = useState<TOrderedFood[]>([]);
  const seat = useAppSelector(selectSeatingsByEmployee).find(
    item => item._id === seatId,
  );

  const foods = useAppSelector(selectFoodsByEmployee);

  useEffect(() => {
    // START FIX
    socketClient
      .getSocket()
      ?.on('onKitchenChangeOrderStatus', async (data: any) => {
        const updateData: TUpdateOrderItemStatus = {
          orderId: data.orderId,
          orderItemId: data.foodItemId,
          status: data.status,
        };
        // fix sau ?

        try {
          const res = await employeeApi.getFoodOrderBySeat(seatId);
          if (res.data.orderFoods) {
            const data: TOrderedFood[] = res.data.orderFoods.foodItems;
            setOrderedFoods(data);
          }
          //   console.log('orderred foods: ', res.data);
        } catch (error) {
          console.log(error);
        }
      });
    // END FIX
    seat?.currentOrderId &&
      (async () => {
        try {
          const res = await employeeApi.getFoodOrderBySeat(seatId);
          if (res.data.orderFoods) {
            const data: TOrderedFood[] = res.data.orderFoods.foodItems;
            setOrderedFoods(data);
          }
          //   console.log('orderred foods: ', res.data);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [seat?.currentOrderId]);

  const total_amount = useMemo(() => {
    return orderedFoods.reduce((total, order) => {
      if (order.status !== 'cancel' && order.status !== 'canceling') {
        const food = foods.find(f => f._id === order.foodId);
        if (food) {
          return total + Number(food.price) * order.quantity;
        }
      }
      return total;
    }, 0);
  }, [orderedFoods, foods]);

  return (
    <Layout backgroundColor={mode === 'dark' ? palette.gray20 : palette.gray3}>
      <ScrollView>
        <View style={style.mx_md}>
          {/* <View>
            <Text style={$textTile1}>
              {t('confirmOrderScreenByEmployee.title.1')}
            </Text>
            <Text style={$textTile2}>
              {t('confirmOrderScreenByEmployee.title.2')}
            </Text>
          </View> */}
        </View>
        {/*  */}
        {orderedFoods?.map((item, index) => {
          const food = foods.find(x => x._id === item.foodId) as TFood;

          return (
            <View style={$foodContainer} key={`${item._id}`}>
              <View style={$leftFoodContainer}>
                <Image source={{uri: food?.foodImage}} style={$foodImg} />
                <View>
                  <Text style={$foodName}>{food?.name}</Text>
                  <View style={[style.row_center, style.mt_xxs]}>
                    <Text style={$price}>
                      {item.status === 'cancel'
                        ? 0
                        : item.status !== 'canceling'
                        ? formatPrice(
                            (Number(food.price) * item.quantity).toString(),
                          )
                        : 0}
                    </Text>
                    <Text style={$quantity}>x{item.quantity}</Text>
                  </View>
                </View>
              </View>
              <View style={[$rightFoodContainer]}>
                {/* <Text>{item.status}</Text> */}
                <View>
                  {item.status === 'pending' || item.status === 'serve' ? (
                    <LottieView
                      source={lottieAnmiations.pending}
                      style={{
                        width: scaleFontSize(25),
                        height: scaleFontSize(25),
                      }}
                      resizeMode="contain"
                      autoPlay
                      loop
                    />
                  ) : item.status === 'complete' ? (
                    <LottieView
                      source={lottieAnmiations.checkBox}
                      style={{
                        width: scaleFontSize(40),
                        height: scaleFontSize(40),
                      }}
                      resizeMode="cover"
                      autoPlay
                      loop={false}
                    />
                  ) : (
                    <LottieView
                      source={lottieAnmiations.cancel}
                      style={{
                        width: scaleFontSize(40),
                        height: scaleFontSize(40),
                      }}
                      resizeMode="cover"
                      autoPlay
                      speed={1.5}
                      loop
                    />
                  )}
                </View>
                <Text>{format(item.orderTime, 'HH:mm')}</Text>
              </View>
            </View>
          );
        })}
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
              {formatPrice(total_amount.toString())}
              VNĐ
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[style.my_sm, {opacity: 0.5}]}>
            {`-`.repeat(500)}
          </Text>
          <View style={style.row_between}>
            <Text style={$detailtText}>Total</Text>
            <Text style={$detailtText}>
              {formatPrice(total_amount.toString())}
              VNĐ
            </Text>
          </View>
          {orderedFoods.length > 0 && (
            <Button
              type="solid"
              title={paymentding ? t('common.review_invoice') : t('common.pay')}
              containerStyle={style.pt_lg}
              onPress={handlePayPress}
            />
          )}
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
const $foodContainer: SViewStyle = [
  style.row_between,
  {height: scaleFontSize(100)},
  style.mb_lg,
  style.mx_sm,
];
const $leftFoodContainer: SViewStyle = [
  style.row,
  {width: '70%', height: '100%'},
  style.align_center,
];
const $rightFoodContainer: SViewStyle = [
  {
    width: '30%',
    height: '100%',
    borderRadius: scaleFontSize(8),
  },
  style.justify_center,
  style.align_end,
  style.overflow_hidden,
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
const $increaseText: STextStyle = [{fontSize: scaleFontSize(25)}];
const $subDetailText: STextStyle = [style.tx_font_bold, {opacity: 0.5}];
const $detailtText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(15)},
];
