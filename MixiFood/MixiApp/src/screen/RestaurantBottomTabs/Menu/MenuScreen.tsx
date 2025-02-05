import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Layout} from '../../../components/Layout/Layout';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {AppRestaurantBottomTabbarParamList} from '../../../navigators';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {palette, scale, scaleFontSize, style} from '../../../theme';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Text, useTheme} from '@rneui/themed';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../assets/lottieAnimation';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {AddFoodBottomSheet} from './BottomSheet/AddFoodBottomSheet';
import {useFetchFoods} from '../../../hooks/Food';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {
  createOrEditFood,
  deleteFoods,
  selectFoods,
  selectUserInfo,
} from '../../../store';
import {formatPrice} from '../../../utils/number';
import {useFormik} from 'formik';
import {Validators} from '../../../utils/Validate';
import * as yup from 'yup';
import {TCreateFood} from '../../../api/api.types';
import {restaurantApi} from '../../../api/restaurantApi';
import {Asset} from 'react-native-image-picker';
import {useLoader} from '../../../contexts/loader-provider';
import {TFood} from '../../../models/food';
import {ELoaderType} from '../../../components/AppLoader';
import {MenuOptionsBottomSheet} from './BottomSheet/MenuOptionBottomSheet';
import {AppModal} from '../../../components/AppModal';
import socketClient from '../../../socket/socketClient';

export const MenuScreen: React.FC<
  BottomTabScreenProps<AppRestaurantBottomTabbarParamList, 'Menu'>
> = props => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {colorScheme} = useThemeContext();
  const {show, hide} = useLoader();
  const restaurantId = useAppSelector(selectUserInfo)?._id;

  const AddFoodBottomSheetRef = useRef<BottomSheetModal>(null);
  const MenuOptionsBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isEditAction, setIsEditAction] = useState<boolean>(false);

  const [modalDeleteVisible, setModalDeleteVisible] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<TFood>();
  const snapPoints = useMemo(
    () => [Platform.OS === 'android' ? '100%' : '95%'],
    [],
  );
  const [foodImage, setFoodImage] = useState<Asset>();

  const dispatch = useAppDispatch();
  const foods = useAppSelector(selectFoods).filter(food => !food.isDelete);

  // useFetchFoods([props.navigation]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: t('appBottomTabbar.restaurant.Menu.title'),
      headerTitleAlign: 'center',
      headerRight: () => (
        <Button
          type="clear"
          onPress={() => AddFoodBottomSheetRef.current?.present()}>
          <LottieView
            source={lottieAnmiations.add2}
            autoPlay
            style={$addAnimated}></LottieView>
        </Button>
      ),
    });
  }, [props.navigation]);

  const createFoodFormik = useFormik<TCreateFood>({
    initialValues: {
      name: '',
      price: '',
      unit: '',
      isRemoveBg: true,
    },
    validationSchema: yup.object().shape({
      name: Validators.foodName(t),
      price: Validators.foodPrice(t),
    }),
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      AddFoodBottomSheetRef.current?.dismiss();
      show(ELoaderType.foodLoader1);
      const data: TCreateFood = {
        name: values.name,
        price: values.price,
        unit: values.unit,
        isRemoveBg: values.isRemoveBg,
      };
      try {
        const response = await restaurantApi.createFood(
          foodImage as Asset,
          data,
        );
        if (response.data.food) {
          const food: TFood = response.data.food;
          socketClient.sendUpadtedFood(food, restaurantId || '');
          dispatch(createOrEditFood([food]));
          Alert.alert('Success', 'Create food success !');
        }
        hide();
      } catch (error) {
        Alert.alert('Fail', 'Check your internet and try again !');
        console.log('error Create food', error);
        hide();
      }
    },
  });

  const handleDeleteFood = async () => {
    setModalDeleteVisible(false);
    show(ELoaderType.foodLoader1);

    if (selectedFood) {
      try {
        const response = await restaurantApi.deleteFoods([selectedFood._id]);
        if (response.data.deletedIds) {
          const deleteFoodIds: string[] = response.data.deletedIds;
          dispatch(deleteFoods(deleteFoodIds));
          Alert.alert(t('common.success'));
        }
        hide();
      } catch (error) {
        console.log(error);
        Alert.alert(t('common.fail', 'errorMessage.internet'));
        hide();
      }
    }
  };

  const handleDeleteOnBottomSheet = () => {
    if (selectedFood) {
      MenuOptionsBottomSheetModalRef.current?.dismiss();
      setModalDeleteVisible(true);
    }
  };

  const handleFoodOption = (food: TFood) => {
    setSelectedFood(prev => food);
    MenuOptionsBottomSheetModalRef.current?.present();
  };

  const onOptionBottomSheetDismiss = () => {
    setIsEditAction(false);
    setSelectedFood(prev => undefined);
  };

  const handleEditOnBottomSheet = () => {
    setIsEditAction(prev => true);
  };

  return (
    <Layout backgroundColor={colorScheme.background}>
      {/*  */}
      {/*  */}
      <ScrollView>
        <View style={$innerContainer}>
          {foods.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
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
                ]}
                onPress={() => handleFoodOption(item)}>
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
                        uri: item.foodImage,
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
                    ]}></View>
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
                    <Text style={$foodTitle}>{item.name}</Text>
                    <View
                      style={{
                        backgroundColor: item.available
                          ? colorScheme.success
                          : colorScheme.error,
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                      }}></View>
                  </View>
                  <Text style={$foodDescription}>descriptTion ?</Text>
                  <Text style={$foodTitle}>{formatPrice(item.price)} VNĐ</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <AddFoodBottomSheet
        foodImage={foodImage}
        setFoodImage={setFoodImage}
        formik={createFoodFormik}
        bottomSheetModalRef={AddFoodBottomSheetRef}
        snapPoints={snapPoints}
      />
      <MenuOptionsBottomSheet
        handleDelete={handleDeleteOnBottomSheet}
        handleEdit={handleEditOnBottomSheet}
        bottomSheetModalRef={MenuOptionsBottomSheetModalRef}
        snapPoints={snapPoints}
        isEditAction={isEditAction}
        handleDismiss={onOptionBottomSheetDismiss}
        food={selectedFood}
      />
      <AppModal
        modalVisible={modalDeleteVisible}
        setModalVisible={setModalDeleteVisible}
        title={t('menuFoodScreen.modal.deleteTitle')}
        content={t('menuFoodScreen.modal.deleteContent')}
        handleCancel={() => {
          setModalDeleteVisible(false);
        }}
        handleOk={handleDeleteFood}
        btn2Title={t('common.confirm')}
      />
    </Layout>
  );
};

const $innerContainer: SViewStyle = [style.flex_1, style.mx_sm];
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
    // height: scaleFontSize(120),
    height: scale.y(120, 120 * 2),
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
const $foodDescription: STextStyle = [style.tx_font_extraLight, style.py_sm];
