import {CompositeScreenProps} from '@react-navigation/native';
import {Layout} from '../../../components/Layout/Layout';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {AppEmployeeBottomTabbarParamList} from '../../../navigators/EmployeeBottomTab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {
  resetOrderByEmployee,
  selectFoodsByEmployee,
  selectOrdersPendingByEmp,
  selectSeatingsByEmployee,
  updateOrderItemStatusByEmp,
} from '../../../store';
import {ScrollView} from 'react-native-gesture-handler';
import {RenderServingFoods} from './RenderServingFoods';
import {TFood} from '../../../models/food';
import {TOrderedFoodStatus} from '../../../models/order';
import {Alert, View} from 'react-native';
import {style} from '../../../theme';
import {useMemo, useRef, useState} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {EmpServingBottomSheet} from './BottomSheet/EmpServingBottomSheet';
import {TSeating, TSeatingForStore} from '../../../models';
import {
  TKitchangeFoodItemStatus,
  TKitchenChangeFoodItemsStatus,
} from '../../../api/api.types';
import {employeeApi} from '../../../api/employeeApi';
import {TUpdateOrderItemStatus} from '../../../hooks/Ordes';
import {useLoader} from '../../../contexts/loader-provider';
import {Text} from '@rneui/themed';

export type TFoodToServing = {
  status: TOrderedFoodStatus;
  orderTime: Date;
  quantity: number;
  seat: TSeatingForStore;
  orderId: string;
  orderItemId: string;
} & TFood;

export const ServingScreen: React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<AppEmployeeBottomTabbarParamList, 'ServingScreen'>,
    NativeStackScreenProps<AppStackParamList>
  >
> = () => {
  const {t} = useTranslation();
  const {show, hide} = useLoader();

  const orders = useAppSelector(selectOrdersPendingByEmp);
  const foods = useAppSelector(selectFoodsByEmployee);
  const seats = useAppSelector(selectSeatingsByEmployee);
  const dispatch = useAppDispatch();

  const [selectedOrderItem, setSelectedOrderItem] = useState<TFoodToServing>();

  const EmpServingBottomSheetModalRef = useRef<BottomSheetModal>(null);

  // const orderItems = orders.flatMap(item => item.foodItems);

  const orderItems = orders
    .flatMap(item => {
      const seat = seats.find(s => s.currentOrderId === item._id);
      return seat
        ? item.foodItems.map(foodItem => ({
            ...foodItem,
            seatId: seat._id,
            orderId: item._id,
          }))
        : [];
    })
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.orderTime);
      const dateB = new Date(b.orderTime);
      return dateA.getTime() - dateB.getTime();
    });

  const handleOpenBottomSheet = (input: TFoodToServing) => {
    setSelectedOrderItem(input);
    EmpServingBottomSheetModalRef.current?.present();
    // console.log('chea', input);
  };

  const handleConfirmOnBottomSheet = async () => {
    EmpServingBottomSheetModalRef.current?.dismiss();
    show();
    const data: TKitchenChangeFoodItemsStatus = {
      orderId: selectedOrderItem?.orderId || '',
      foodItemId: selectedOrderItem?.orderItemId || '',
      status: selectedOrderItem?.status === 'canceling' ? 'cancel' : 'complete',
    };
    // console.log('send Data', data);

    try {
      const response = await employeeApi.serveChangeFoodItemStatus(data);
      if (response.data.success) {
        // console.log('rezxad', response.data);

        const update: TUpdateOrderItemStatus = {
          orderId: data.orderId,
          orderItemId: data.foodItemId,
          status: response.data.foodItem.status as TOrderedFoodStatus,
        };

        dispatch(updateOrderItemStatusByEmp(update));
        Alert.alert(t('common.success'));
        hide();
      }
    } catch (error) {
      console.log(error);
      Alert.alert(t('common.fail'), t('errorMessage.internet'));
      hide();
    }
  };

  return (
    <Layout safeAreaOnTop>
      <ScrollView>
        <View style={style.mx_md}>
          {orderItems.map((item, index) => {
            const food = foods.find(food => food._id === item.foodId);
            const status = item.status;
            const foodToServing: TFoodToServing = {
              ...(food as TFood),
              status: status,
              orderTime: item.orderTime,
              quantity: item.quantity,
              seat: seats.find(x => x._id === item.seatId) as TSeatingForStore,
              orderId: item.orderId,
              orderItemId: item._id,
            };
            if (
              foodToServing.status !== 'serve' &&
              foodToServing.status !== 'canceling'
            )
              return;

            return (
              <RenderServingFoods
                food={foodToServing}
                key={foodToServing.orderItemId}
                onPress={() => handleOpenBottomSheet(foodToServing)}
              />
            );
          })}
          {!orderItems.length && (
            <Text style={[style.tx_font_bold, style.tx_center]}>
              There are currently no dishes waiting to be served.
            </Text>
          )}
        </View>
      </ScrollView>
      <EmpServingBottomSheet
        bottomSheetModalRef={EmpServingBottomSheetModalRef}
        data={selectedOrderItem}
        handleConfirm={handleConfirmOnBottomSheet}
      />
    </Layout>
  );
};
