import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Layout} from '../../../components/Layout/Layout';
import {useFetchFoods} from '../../../hooks/Food';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {selectFoodsByEmployee, updateSeatOrder} from '../../../store';
import {Alert, Image, Platform, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {palette, scaleFontSize, style} from '../../../theme';
import {SImageStyle, SViewStyle, TSeatingForStore} from '../../../models';
import {RenderFood} from '../RenderFood';
import {Button, Text} from '@rneui/themed';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';
import {PrieviewFoodBottomSheet} from './OrderFoodBottomSheet';
import {TFood} from '../../../models/food';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {employeeApi} from '../../../api/employeeApi';
import {useLoader} from '../../../contexts/loader-provider';
import {TFoodByOrder} from '../../../models/order';

export type TPrieViewFood = {
  quantity: number;
} & TFood;

export const OrderFoodScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'OrderFoodScreen'>
> = props => {
  useFetchFoods([], true);
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();

  const scrollViewRef = useRef<ScrollView>(null);
  const PrieViewFoodBottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [Platform.OS === 'android' ? '100%' : '95%'],
    [],
  );
  const [selectedPrieViewFood, setSelectedPrieViewFood] =
    useState<TPrieViewFood>();

  const foods = useAppSelector(selectFoodsByEmployee);

  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const [orderedFoods, setOrderedFoods] = useState(
    foods.map((food, index) => ({
      ...food,
      quantity: 0,
    })),
  );

  useEffect(() => {
    setOrderedFoods(prev =>
      foods.map((food, index) => ({
        ...food,
        quantity: 0,
      })),
    );
  }, [foods]);

  const updateQuantity = (id: string, quantity: number) => {
    setOrderedFoods(prevState =>
      prevState.map((food, index) =>
        food._id === id ? {...food, quantity: quantity} : food,
      ),
    );
  };

  const getOrderedFoods = useMemo(() => {
    return orderedFoods.filter(food => food.quantity > 0);
  }, [orderedFoods]);

  useEffect(() => {
    if (getOrderedFoods.length > 0) {
      translateY.value = withTiming(0, {duration: 100});
      opacity.value = withTiming(1, {duration: 100});
    } else {
      translateY.value = withTiming(100, {duration: 100});
      opacity.value = withTiming(0, {duration: 100});
    }
  }, [getOrderedFoods]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }));

  const handlePrieViewFood = (food: TPrieViewFood) => {
    setSelectedPrieViewFood(food);
    PrieViewFoodBottomSheetRef.current?.present();
  };

  const handleConfirmOrder = () => {
    props.navigation.navigate('ConfirmOrderScreen', {
      orderedFoods: getOrderedFoods,
      seatId: props.route.params.seatId,
    });
  };

  const handleConfirmOnBottomSheet = () => {
    PrieViewFoodBottomSheetRef.current?.dismiss();
  };

  return (
    <Layout safeAreaOnBottom style={style.justify_between}>
      <ScrollView ref={scrollViewRef}>
        <View style={$innerContainer}>
          {orderedFoods.map((item, index) => (
            <RenderFood
              key={`${item._id}`}
              available={item.available}
              foodName={item.name}
              price={item.price}
              foodImage={item?.foodImage}
              quantity={item.quantity}
              onQuantityChange={quantity => updateQuantity(item._id, quantity)}
            />
          ))}
        </View>
      </ScrollView>

      {orderedFoods && (
        <PrieviewFoodBottomSheet
          handleConfirm={handleConfirmOnBottomSheet}
          bottomSheetModalRef={PrieViewFoodBottomSheetRef}
          snapPoints={snapPoints}
          food={selectedPrieViewFood || orderedFoods[0]}
          onQuantityChange={quantity =>
            updateQuantity(
              selectedPrieViewFood?._id || '',
              selectedPrieViewFood?.quantity || 0,
            )
          }
        />
      )}
      <Animated.View
        style={[
          animatedStyle,
          {backgroundColor: colorScheme.background},
          $prieViewContainer,
        ]}>
        <View style={[$innerContainer, style.row_between]}>
          <ScrollView horizontal>
            {getOrderedFoods.map((item, index) => (
              <TouchableOpacity
                key={item._id + Date.toString()}
                style={$prieviewBtn}
                onPress={() => handlePrieViewFood(item)}>
                <Image
                  source={{uri: item.foodImage}}
                  style={$orverFoodImg}></Image>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button
            type="solid"
            title={t('common.confirm')}
            onPress={handleConfirmOrder}></Button>
        </View>
      </Animated.View>
    </Layout>
  );
};

const $innerContainer: SViewStyle = [style.mx_sm];
const $orverFoodImg: SImageStyle = [
  {
    width: scaleFontSize(50),
    height: scaleFontSize(50),
    borderRadius: 999,
    resizeMode: 'cover',
  },
];
const $prieviewBtn: SViewStyle = [style.mx_sm, style.center, style.py_xs];
const $prieViewContainer: SViewStyle = [
  {
    borderTopWidth: 1,
    borderColor: palette.gray5,
  },
];
