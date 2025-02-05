import {CompositeScreenProps} from '@react-navigation/native';
import {Layout} from '../../../components/Layout/Layout';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {AppEmployeeBottomTabbarParamList} from '../../../navigators/EmployeeBottomTab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {
  SImageStyle,
  STextStyle,
  SViewStyle,
  TFoodPendingForStore,
  TPendingOrder,
} from '../../../models';
import {useEffect, useRef, useState} from 'react';
import {employeeApi} from '../../../api/employeeApi';
import {useTranslation} from 'react-i18next';
import {palette, scaleFontSize, style} from '../../../theme';
import {useAppDispatch, useAppSelector, useAppState} from '../../../hooks';
import {
  removeMultiPendingOrderItem,
  removePendingOrderItem,
  selectFoodsByEmployee,
  selectPendingOrderItemByEmp,
  selectSeatingsByEmployee,
} from '../../../store';
import {TFood} from '../../../models/food';
import {Button, Text} from '@rneui/themed';
import {formatPrice} from '../../../utils/number';
import {format} from 'date-fns';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {KitchenActionBottomSheet} from './BottomSheet';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../assets/lottieAnimation';
import {
  TKitchangeFoodItemStatus,
  TKitchenChangeFoodItemsStatus,
  TKitchenChangeMultiOrderItemStatus,
} from '../../../api/api.types';
import {useFetchPendingOrderFoodItems} from '../../../hooks/pendingOrderITem';
import {useLoader} from '../../../contexts/loader-provider';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const KitchenScreen: React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<AppEmployeeBottomTabbarParamList, 'KitchenScreen'>,
    NativeStackScreenProps<AppStackParamList>
  >
> = props => {
  const {t} = useTranslation();
  const {show, hide} = useLoader();

  const seats = useAppSelector(selectSeatingsByEmployee);

  // const [pendingFoods, setPendingFoods] = useState<TPendingOrder[]>([]);
  const pendingFoods = useAppSelector(selectPendingOrderItemByEmp) || [];
  const [selectedItems, setSelectedItems] = useState<
    TKitchenChangeMultiOrderItemStatus[]
  >([]);
  const animationValue = useSharedValue(0);

  const KitchenBottomSheetRef = useRef<BottomSheetModal>(null);

  const dispatch = useAppDispatch();
  const foods = useAppSelector(selectFoodsByEmployee);

  useFetchPendingOrderFoodItems([]);
  const [selectedItem, setSelectedItem] =
    useState<TKitchenChangeFoodItemsStatus>();

  const onKitchenBottomSheetDismiss = () => {
    setSelectedItem(undefined);
  };

  useEffect(() => {
    if (selectedItems.length > 0) {
      animationValue.value = withTiming(1, {
        duration: 100,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      animationValue.value = withTiming(0, {
        duration: 100,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [selectedItems]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animationValue.value, // Animate opacity to 0 when no items selected
      height: withTiming(animationValue.value * 40, {duration: 100}), // Animate height to 0 when no items selected
      transform: [
        {
          translateY: withTiming(animationValue.value * 10, {duration: 100}), // Animate vertical movement
        },
      ],
    };
  });

  const handleSelectItems = (item: TKitchenChangeFoodItemsStatus) => {
    setSelectedItems(prevSelectedItems => {
      const orderIndex = prevSelectedItems.findIndex(
        order => order.orderId === item.orderId,
      );

      if (orderIndex !== -1) {
        const foodItemIndex = prevSelectedItems[
          orderIndex
        ].orderItemId.findIndex(foodItemId => foodItemId === item.foodItemId);

        if (foodItemIndex !== -1) {
          const updatedOrderItems = prevSelectedItems[
            orderIndex
          ].orderItemId.filter(foodItemId => foodItemId !== item.foodItemId);

          if (updatedOrderItems.length === 0) {
            return prevSelectedItems.filter(
              order => order.orderId !== item.orderId,
            );
          }

          const updatedOrders = [...prevSelectedItems];
          updatedOrders[orderIndex].orderItemId = updatedOrderItems;
          return updatedOrders;
        } else {
          const updatedOrders = [...prevSelectedItems];
          updatedOrders[orderIndex].orderItemId.push(item.foodItemId);
          return updatedOrders;
        }
      } else {
        return [
          ...prevSelectedItems,
          {
            orderId: item.orderId,
            orderItemId: [item.foodItemId],
            status: item.status,
          },
        ];
      }
    });
  };

  const handlePressFood = (input: TKitchenChangeFoodItemsStatus) => {
    setSelectedItem(input);
    KitchenBottomSheetRef.current?.present();
  };

  const handleStatusChange = async (status: TKitchangeFoodItemStatus) => {
    show();
    const data: TKitchenChangeFoodItemsStatus = {
      orderId: selectedItem?.orderId || '',
      foodItemId: selectedItem?.foodItemId || '',
      status: status,
    };

    try {
      const response = await employeeApi.kitchenChangeFoodItemStatus(data);
      // console.log(response.data);
      dispatch(removePendingOrderItem(data));
      Alert.alert(t('common.success'));
      KitchenBottomSheetRef.current?.dismiss();
      hide();
    } catch (error) {
      console.log(error);
      Alert.alert(t('common.fail', t('errorMessage.internet')));
      hide();
    }
  };

  const isSelectedItem = (item: TKitchenChangeFoodItemsStatus) => {
    return selectedItems.some(
      order =>
        order.orderId === item.orderId &&
        order.orderItemId.includes(item.foodItemId),
    );
  };

  const handleConfirmChangeMultiStatus = async (
    status: TKitchangeFoodItemStatus,
  ) => {
    show();

    if (selectedItems) {
      try {
        const response = await employeeApi.kitchenChangeMultiOrderItemStatus(
          selectedItems,
          status,
        );
        if (response.data.success) {
          Alert.alert(t('common.success'));
          dispatch(removeMultiPendingOrderItem(selectedItems));
          setSelectedItems([]);
          hide();
        }
      } catch (error) {
        Alert.alert(t('common.fail', t('errorMessage.internet')));
        hide();
        console.log(error);
      }
    }
  };

  return (
    <Layout safeAreaOnTop>
      {/* multi status change */}
      <Animated.View
        style={[
          style.mb_sm,
          style.row_between,
          style.mx_md,
          animatedStyle,
          {borderBottomWidth: 1, borderColor: palette.gray8},
          selectedItems.length !== 0 && style.pb_sm,
        ]}>
        <View />
        <View style={style.row_center}>
          <Button
            type="outline"
            title={t('common.cancel')}
            buttonStyle={[style.mr_sm, {height: scaleFontSize(35)}]}
            onPress={() => handleConfirmChangeMultiStatus('cancel')}
          />
          <Button
            type="solid"
            title={t('common.complete')}
            buttonStyle={[{height: scaleFontSize(35)}]}
            onPress={() => handleConfirmChangeMultiStatus('complete')}
          />
        </View>
      </Animated.View>
      {/*  */}
      <ScrollView>
        <View style={style.mx_md}>
          {pendingFoods.map(order =>
            order.pendingFoodItems
              .slice()
              .sort((a, b) => {
                const dateA = new Date(a.orderTime);
                const dateB = new Date(b.orderTime);
                return dateB.getTime() - dateA.getTime();
              })
              .map((item, index) => {
                const food = foods.find(x => x._id === item.foodId) as TFood;
                const selectedItem: TKitchenChangeFoodItemsStatus = {
                  orderId: order.orderId,
                  foodItemId: item._id,
                  status: item.status as TKitchangeFoodItemStatus,
                };

                const seat = seats.find(x => x._id === order.seatId);

                const isSelected = isSelectedItem(selectedItem);

                return (
                  <View
                    style={[
                      style.row_center,
                      {height: scaleFontSize(80)},
                      style.my_sm,
                      style.mx_md,
                    ]}
                    key={item._id}>
                    <TouchableOpacity
                      style={[
                        {
                          width: scaleFontSize(30),
                          height: scaleFontSize(30),
                          borderRadius: 999,
                          borderWidth: 1,
                        },
                        style.center,
                      ]}
                      onPress={() => handleSelectItems(selectedItem)}>
                      {isSelected && (
                        <LottieView
                          source={lottieAnmiations.verify1}
                          autoPlay
                          style={{
                            width: scaleFontSize(80),
                            height: scaleFontSize(80),
                          }}
                          resizeMode="cover"
                          loop={false}
                        />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={$foodContainer}
                      key={item._id}
                      onPress={() => handlePressFood(selectedItem)}>
                      <View style={$leftFoodContainer}>
                        <Image
                          source={{uri: food?.foodImage}}
                          style={$foodImg}
                        />
                        <View>
                          <Text style={$foodName}>{food?.name}</Text>
                          <Text>{seat?.seatName}</Text>
                          <View style={[style.row_center, style.mt_xxs]}>
                            <Text style={$price}>
                              {formatPrice(
                                (
                                  Number(food?.price) * item?.quantity
                                ).toString(),
                              )}
                            </Text>
                            <Text style={$quantity}>x{item.quantity}</Text>
                          </View>
                        </View>
                      </View>
                      {/* Right */}
                      <View style={[$rightFoodContainer]}>
                        <Text>{format(item.orderTime, 'HH:mm')}</Text>
                        <LottieView
                          source={lottieAnmiations.pending}
                          autoPlay
                          style={{
                            width: scaleFontSize(20),
                            height: scaleFontSize(20),
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }),
          )}
        </View>
      </ScrollView>
      <KitchenActionBottomSheet
        handleDismiss={onKitchenBottomSheetDismiss}
        bottomSheetModalRef={KitchenBottomSheetRef}
        handleStatusChange={handleStatusChange}
      />
    </Layout>
  );
};

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
