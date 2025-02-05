import React, {Dispatch, SetStateAction, useEffect, useMemo} from 'react';
import {Button, Text} from '@rneui/themed';
import {Layout} from '../../../components/Layout/Layout';
import {SViewStyle} from '../../../models/Style';
import {scale, style} from '../../../theme';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {
  AppInput,
  EAppInputBorderWidth,
  EAppInputHeight,
} from '../../../components/AppInput';
import {useTranslation} from 'react-i18next';
import {images} from '../../../../assets';
import {Formik, useFormik} from 'formik';
import * as yup from 'yup';
import {getTrErrorMessage, Validators} from '../../../utils/Validate';
import {delay} from '../../../utils';
import {TRegisterUser} from '../../../api/api.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {loginApi} from '../../../api/loginApi';
import {useLoader} from '../../../contexts/loader-provider';
import {AxiosError} from 'axios';
import {ELoaderType} from '../../../components/AppLoader';
import {EUserType, setUserId} from '../../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../../hooks';

// const validate = (values: {
//   fullname: string;
//   phonenumber: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }) => {
//   const errors: {
//     fullname?: string;
//     phonenumber?: string;
//     email?: string;
//     password?: string;
//     confirmPassword?: string;
//   } = {};

//   if (!values.fullname) {
//     errors.fullname = 'Fullname is required';
//   }

//   if (!values.phonenumber) {
//     errors.phonenumber = 'Phone number is required';
//   }

//   if (!values.email) {
//     errors.email = 'Email is required';
//   } else if (!/\S+@\S+\.\S+/.test(values.email)) {
//     errors.email = 'Invalid email address';
//   }

//   if (!values.password) {
//     errors.password = 'Password is required';
//   } else if (values.password.length < 6) {
//     errors.password = 'Password must be at least 6 characters';
//   }

//   if (!values.confirmPassword) {
//     errors.confirmPassword = 'Confirm password is required';
//   } else if (values.confirmPassword !== values.password) {
//     errors.confirmPassword = 'Passwords must match';
//   }

//   return errors;
// };

export type TUserTabProps = {
  formik?: ReturnType<typeof useFormik<TRegisterUser>>;
  handleNextPress: (phoneNumber: string) => Promise<void>;
};

export const UserTab: React.FC<TUserTabProps> = ({handleNextPress}) => {
  const {t} = useTranslation();
  const errorMsg = getTrErrorMessage(t);
  const {isVisible, show, hide} = useLoader();
  const dispatch = useAppDispatch();

  const formik = useFormik<TRegisterUser>({
    initialValues: {
      fullName: __DEV__ ? 'nhennhenNoWayHome' : '',
      phoneNumber: __DEV__ ? '0339122327' : '',
      email: __DEV__ ? 'phong11@gmail.com' : '',
      password: __DEV__ ? '12345678' : '',
      confirmPassword: __DEV__ ? '12345678' : '',
    },
    validationSchema: yup.object().shape({
      email: Validators.email(t),
      fullName: Validators.fullName(t),
      phoneNumber: Validators.phoneNumber(t),
      password: Validators.password(t),
    }),
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      show(ELoaderType.animation1);
      await delay(3000);
      const registerData: TRegisterUser = {
        phoneNumber: values.phoneNumber,
        userName: values.fullName,
        email: values.email,
        password: values.password,
      };
      try {
        const response = await loginApi.register_User(registerData);
        console.log('res111', response.data);
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
          placeholder={t('input.fullName.placeholder')}
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
          value={formik.values.fullName}
          onChangeText={formik.handleChange('fullName')}
          onBlur={formik.handleBlur('fullName')}
          errorMessage={
            formik.touched.fullName && formik.errors.fullName
              ? formik.errors.fullName
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
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          errorMessage={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
          style={$inputContainer}
          height={EAppInputHeight.MEDIUM}
        />

        <View style={$distance}></View>

        <AppInput
          containerBorderWidth={EAppInputBorderWidth.MEDIUM}
          lefttIconImageSource={images.lock}
          secureTextEntry
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
          secureTextEntry
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
