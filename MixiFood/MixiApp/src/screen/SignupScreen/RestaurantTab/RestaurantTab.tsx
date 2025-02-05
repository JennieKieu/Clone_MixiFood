import {Button, Text} from '@rneui/themed';
import {Layout} from '../../../components/Layout/Layout';
import {SViewStyle} from '../../../models/Style';
import {scale, style} from '../../../theme';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {useEffect} from 'react';
import {
  AppInput,
  EAppInputBorderWidth,
  EAppInputHeight,
} from '../../../components/AppInput';
import {images} from '../../../../assets';
import {useTranslation} from 'react-i18next';
import {useFormik} from 'formik';
import {TRegisterRestaurant} from '../../../api/api.types';
import * as yup from 'yup';
import {getTrErrorMessage, Validators} from '../../../utils/Validate';
import {useLoader} from '../../../contexts/loader-provider';
import {ELoaderType} from '../../../components/AppLoader';
import {delay} from '../../../utils';
import {loginApi} from '../../../api/loginApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AxiosError} from 'axios';
import {useAppDispatch} from '../../../hooks';
import {setUserId} from '../../../store';

export type TRestaurantTabProps = {
  handleNextPress: (phoneNumber: string) => Promise<void>;
};

export const RestaurantTab: React.FC<TRestaurantTabProps> = ({
  handleNextPress,
}) => {
  const {t} = useTranslation();
  const {isVisible, show, hide} = useLoader();
  const errorMsg = getTrErrorMessage(t);
  const dispatch = useAppDispatch();

  const formik = useFormik<TRegisterRestaurant>({
    initialValues: {
      restaurantName: __DEV__ ? 'MixiFood' : '',
      phoneNumber: __DEV__ ? '0339122327' : '',
      email: __DEV__ ? 'phong11@gmail.com' : '',
      password: __DEV__ ? '12345678' : '',
      confirmPassword: __DEV__ ? '12345678' : '',
      restaurantAddress: __DEV__ ? 'HCM' : '',
    },
    validationSchema: yup.object().shape({
      email: Validators.email(t),
      restaurantName: Validators.fullName(t),
      phoneNumber: Validators.phoneNumber(t),
      password: Validators.password(t),
    }),
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      show(ELoaderType.animation1);
      await delay(3000);
      const registerData: TRegisterRestaurant = {
        phoneNumber: values.phoneNumber,
        restaurantName: values.restaurantName,
        email: values.email,
        password: values.password,
        restaurantAddress: values.restaurantAddress,
      };
      try {
        const response = await loginApi.register_restaurant(registerData);
        // console.log('res111', response.data);
        if (response.data.success) {
          await AsyncStorage.setItem('token', response.data.token);
          dispatch(setUserId(response.data.user._id));
          handleNextPress(values.phoneNumber);
          hide();
        }
        hide();
      } catch (error) {
        console.log(error);

        if (error instanceof AxiosError) {
          if (error.status === 409) {
            setErrors({
              phoneNumber: t('errorMessage.input.phoneNumberUsed'),
            });
          } else if (error.status === 404) {
            setErrors({
              email: t('errorMessage.input.phoneNumberUsed'),
            });
          }
        }
        hide();
      }
    },
    validate: values => {
      if (values.confirmPassword !== values.password) {
        return {
          confirmPassword: errorMsg.compare('input.confirmPassword.label'),
        };
      }
    },
    validateOnMount: true,
  });

  return (
    <Layout style={$root}>
      <View style={$innerContainer}>
        <AppInput
          containerBorderWidth={EAppInputBorderWidth.MEDIUM}
          lefttIconImageSource={images.user}
          placeholder={t('input.restaurantName.label')}
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
          value={formik.values.restaurantName}
          onChangeText={formik.handleChange('restaurantName')}
          onBlur={formik.handleBlur('restaurantName')}
          errorMessage={
            formik.touched.restaurantName && formik.errors.restaurantName
              ? formik.errors.restaurantName
              : undefined
          }
        />
        <View style={$distance}></View>
        <AppInput
          containerBorderWidth={EAppInputBorderWidth.MEDIUM}
          lefttIconImageSource={images.phone}
          placeholder={t('input.phoneNumber.placeholder')}
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
          value={formik.values.phoneNumber}
          onChangeText={formik.handleChange('phoneNumber')}
          onBlur={formik.handleBlur('phoneNumber')}
          errorMessage={
            formik.touched.phoneNumber && formik.errors.phoneNumber
              ? formik.errors.phoneNumber
              : undefined
          }
        />
        <View style={$distance}></View>
        <AppInput
          containerBorderWidth={EAppInputBorderWidth.MEDIUM}
          lefttIconImageSource={images.email}
          placeholder={t('input.email.placeholder')}
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          errorMessage={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
        />
        <View style={$distance}></View>
        <AppInput
          containerBorderWidth={EAppInputBorderWidth.MEDIUM}
          lefttIconImageSource={images.location}
          placeholder={t('input.address.placeholder')}
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
          value={formik.values.restaurantAddress}
          onChangeText={formik.handleChange('restaurantAddress')}
          onBlur={formik.handleBlur('restaurantAddress')}
          errorMessage={
            formik.touched.restaurantAddress && formik.errors.restaurantAddress
              ? formik.errors.restaurantAddress
              : undefined
          }
        />
        <View style={$distance}></View>
        <AppInput
          containerBorderWidth={EAppInputBorderWidth.MEDIUM}
          lefttIconImageSource={images.lock}
          placeholder={t('input.password.placeholder')}
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          errorMessage={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : undefined
          }
        />
        <View style={$distance}></View>
        <AppInput
          containerBorderWidth={EAppInputBorderWidth.MEDIUM}
          lefttIconImageSource={images.lock}
          placeholder={t('input.confirmPassword.placeholder')}
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
          value={formik.values.confirmPassword}
          onChangeText={formik.handleChange('confirmPassword')}
          onBlur={formik.handleBlur('confirmPassword')}
          errorMessage={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
        />
        <View style={$distance}></View>
      </View>
      <View style={$footerItem}>
        <Button
          type="solid"
          buttonStyle={$button}
          title={t('common.next')}
          titleStyle={$buttonText}
          disabled={!formik.isValid}
          onPress={formik.submitForm}></Button>
      </View>
    </Layout>
  );
};

const $root: SViewStyle = [
  style.flex_1,
  style.w_screenWidth,
  style.my_sm,
  style.justify_between,
];
const $innerContainer: SViewStyle = [style.mx_sm, style.align_center];
const $inputContainer: SViewStyle = [style.my_lg, {borderWidth: 20}];
const $distance: SViewStyle = [style.my_xs];
const $button: SViewStyle = [
  {height: scale.y(45, 90), borderRadius: scale.x(10, 20)},
];
const $buttonText: StyleProp<TextStyle> = [
  style.tx_font_bold,
  style.tx_size_lg,
];
const $footerItem: StyleProp<ViewStyle> = [style.w_screenWidth, style.px_lg];
