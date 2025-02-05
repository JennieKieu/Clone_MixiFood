import {
  Image,
  StyleProp,
  View,
  ViewStyle,
  TextStyle,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Layout} from '../../components/Layout/Layout';
import {scale, scaleFontSize, spacing, style} from '../../theme';
import {images} from '../../../assets';
import {AppInput} from '../../components/AppInput/AppInput';
import {Text, useThemeMode, Button, Switch, useTheme} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {useEffect, useMemo, useState} from 'react';
import {SViewStyle} from '../../models/Style';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {AppStackParamList} from '../../navigators';
import {AppImage} from '../../components/AppImage';
import {EAppInputBorderWidth, EAppInputHeight} from '../../components/AppInput';
import {TAccount} from '../../api/api.types';
import {loginApi} from '../../api/loginApi';
import axios, {AxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../hooks';
import {
  EUserType,
  login,
  setProfile,
  setUserId,
  setUserType,
  TProfile,
} from '../../store';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {Validators} from '../../utils/Validate';
import {TLoginModel} from './LoginScreen.types';
import {delay} from '../../utils';
import {VerifyModal} from './VerifyModal';
import {useLoader} from '../../contexts/loader-provider';
import {ELoaderType} from '../../components/AppLoader';
import {TEmployeeForStore, TRestaurantInfo, TUserInfo} from '../../models';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../assets/lottieAnimation';

export const LoginScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'LoginScreen'>
> = props => {
  const {t} = useTranslation();
  const [isRestaurant, setIsRestaurant] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const [verifyModalVisible, setVerifyModalVisible] = useState<boolean>(false);
  const {isVisible, show, hide} = useLoader();
  const hanldeCancelActive = () => {
    setVerifyModalVisible(false);
  };

  const handleActiveAccount = () => {
    setVerifyModalVisible(false);
    props.navigation.navigate('SmsVerifyScreen', {
      phoneNumber: formik.values.phoneNumber,
      userType: isRestaurant ? EUserType.restaurant : EUserType.user,
    });
  };

  const formik = useFormik<TLoginModel>({
    initialValues: {
      phoneNumber: __DEV__ ? '0339122327' : '',
      password: __DEV__ ? '12345678' : '',
    },
    validationSchema: yup.object().shape({
      phoneNumber: Validators.phoneNumber(t),
      password: Validators.password(t),
    }),
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      show(ELoaderType.animation1);
      const account: TAccount = {
        phoneNumber: formik.values.phoneNumber,
        password: formik.values.password,
        userType: isRestaurant ? EUserType.restaurant : EUserType.user,
      };
      try {
        const response = await loginApi.login(account);
        await AsyncStorage.setItem('token', response.data.token);
        let profile: TProfile = {
          _id: '',
          userName: '',
          phoneNumber: '',
          email: '',
          avatar: '',
          coverImage: '',
          userType: EUserType.user,
        };
        if (response.data.user.role === EUserType.restaurant) {
          const restaurantData: TRestaurantInfo = response.data.user;

          profile = {
            _id: restaurantData._id,
            userName: restaurantData.restaurantName,
            phoneNumber: restaurantData.phoneNumber,
            email: restaurantData.email,
            avatar: restaurantData.avatar,
            coverImage: restaurantData.coverImage,
            userType: restaurantData.role,
            address: restaurantData.restaurantAddress,
            locationId: restaurantData.locationId,
            paymentMethods: restaurantData.paymentMethods,
          };
        } else if (response.data.user.role === EUserType.employee) {
          const employeeData: TEmployeeForStore = response.data.user;
          profile = {
            _id: employeeData._id,
            avatar: employeeData.avatar,
            coverImage: employeeData.coverImage,
            phoneNumber: employeeData.phoneNumber,
            userName: employeeData.fullName,
            userType: employeeData.role,
            restaurantRole: employeeData.restaurantRole,
            restaurantId: employeeData.restaurant,
          };
        } else if (response.data.user.role === EUserType.user) {
          const userInfo: TUserInfo = response.data.user;

          profile = {
            _id: userInfo._id,
            userName: userInfo.userName,
            phoneNumber: userInfo.phoneNumber,
            email: userInfo.email,
            avatar: userInfo.avatar,
            coverImage: userInfo.coverImage,
            userType: userInfo.role,
          };
        }
        // console.log(profile);
        dispatch(setProfile(profile));
        if (response.data.success) {
          dispatch(login());
          dispatch(setUserType(response.data.user.role));
          dispatch(setUserId(response.data.user._id));

          props.navigation.navigate('AppBottomTabbar');

          hide();
        } else {
          setVerifyModalVisible(true);
          // props.navigation.navigate('SmsVerifyScreen', {
          //   phoneNumber: response.data.user.phoneNumber,
          //   userType: response.data.user.role,
          // });
          hide();
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            setErrors({
              password: t('errorMessage.input.incorrect'),
            });
          } else if (error.response?.status === 404)
            setErrors({
              phoneNumber: t('errorMessage.phoneNumberNotFound'),
            });
          else {
            Alert.alert('Netword error');
          }
          // console.log(error.response.status);
        }
        hide();
      } finally {
        setSubmitting(false);
      }
    },
    validateOnMount: true,
  });

  const handleLogin = async () => {
    show(ELoaderType.animation1);
    const account: TAccount = {
      phoneNumber: formik.values.phoneNumber,
      password: formik.values.password,
      userType: isRestaurant ? EUserType.restaurant : EUserType.user,
    };
    try {
      const response = await loginApi.login(account);
      await AsyncStorage.setItem('token', response.data.token);
      if (response.data.success) {
        dispatch(login());
        dispatch(setUserType(response.data.user.role));
        dispatch(setUserId(response.data.user._id));
        props.navigation.navigate('AppBottomTabbar');
        hide();
      } else {
        setVerifyModalVisible(true);
        // props.navigation.navigate('SmsVerifyScreen');
        hide();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status) {
        }
        // console.log(error.response.status);
      }
      hide();
    }
  };

  return (
    <Layout>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.isVisible() && Keyboard.dismiss()}>
        <SafeAreaView style={$root}>
          <View style={$innerContainer}>
            <View style={$logo}>
              <Image source={images.textMixiLogo}></Image>
              <AppImage source={images.mixiLogo}></AppImage>
            </View>
            <View style={$viewCenter}>
              {/* <View style={$switchContainer}>
                <View style={style.row}>
                  <Text h4 h4Style={{}}>
                    {t('common.user')}
                  </Text>
                  <Switch
                    value={isRestaurant}
                    onChange={() => setIsRestaurant(!isRestaurant)}
                    style={$switch}></Switch>
                  <Text h4 h4Style={{}}>
                    {t('common.restaurant')}
                  </Text>
                </View>
              </View> */}
              <AppInput
                containerBorderWidth={EAppInputBorderWidth.MEDIUM}
                height={EAppInputHeight.MEDIUM}
                lefttIconImageSource={images.phone}
                // placeholder="Phone number"
                // value={phoneNumber}
                placeholder={t('input.phoneNumber.placeholder')}
                value={formik.values.phoneNumber}
                onChangeText={formik.handleChange('phoneNumber')}
                onBlur={formik.handleBlur('phoneNumber')}
                errorMessage={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? formik.errors.phoneNumber
                    : undefined
                }
                keyboardType="numeric"></AppInput>
              <AppInput
                height={EAppInputHeight.MEDIUM}
                containerBorderWidth={EAppInputBorderWidth.MEDIUM}
                secureTextEntry
                lefttIconImageSource={images.lock}
                // placeholder="Password"
                passwordRules={t('input.password.label')}
                value={formik.values.password}
                onBlur={formik.handleBlur('password')}
                errorMessage={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : undefined
                }
                onChangeText={formik.handleChange('password')}
                // onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity
              style={[{width: '100%'}, style.row, style.align_center]}
              onPress={() => setIsRestaurant(prev => !prev)}>
              <TouchableOpacity
                style={$checkboxBtn}
                onPress={() => setIsRestaurant(prev => !prev)}>
                {isRestaurant && (
                  <LottieView
                    source={lottieAnmiations.checkBox}
                    autoPlay
                    style={{width: '150%', height: '150%'}}
                    resizeMode="contain"
                    loop={false}
                    speed={1.5}
                  />
                )}
              </TouchableOpacity>
              <Text>{t('common.forRestaurant')}</Text>
            </TouchableOpacity>
            <View style={$buttonForgotPass}>
              <TouchableOpacity>
                <Text style={$textForgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={$footerItem}>
            <Button
              // onPress={formik.submitForm}
              onPress={formik.submitForm}
              buttonStyle={$button}
              type="solid"
              size="md"
              title={t('common.login')}
              titleStyle={$buttonText}
              disabled={!formik.isValid}
            />
          </View>
          <VerifyModal
            modalVisible={verifyModalVisible}
            setModalVisible={setVerifyModalVisible}
            handleCancel={hanldeCancelActive}
            handleActive={handleActiveAccount}></VerifyModal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

const $root: StyleProp<ViewStyle> = [
  style.flex_1,
  style.align_center,
  style.justify_between,
  style.my_sm,
];

const $innerContainer: StyleProp<ViewStyle> = [
  style.align_center,
  {width: '94%'},
];
const $button: StyleProp<ViewStyle> = [{height: 55}];
const $buttonText: StyleProp<TextStyle> = [
  style.tx_font_bold,
  // style.tx_size_lg,
  {fontSize: scale.x(spacing.lg, spacing.md)},
];

const $textForgotPassword: StyleProp<TextStyle> = [
  style.tx_font_light,
  style.tx_size_md,
  {
    textDecorationLine: 'underline',
  },
];
const $logo: StyleProp<ViewStyle> = [style.align_center];
const $viewCenter: StyleProp<ViewStyle> = [{width: '100%', marginTop: 50}];
const $buttonForgotPass: StyleProp<ViewStyle> = [
  {
    width: '100%',
    alignItems: 'flex-end',
  },
  style.py_sm,
];
const $footerItem: StyleProp<ViewStyle> = [style.w_screenWidth, style.px_sm];
const $switchContainer: StyleProp<ViewStyle> = [style.align_center];
const $switch: SViewStyle = [{marginHorizontal: 20}];
const $checkboxBtn: SViewStyle = [
  {
    width: scaleFontSize(25),
    height: scaleFontSize(25),
    borderWidth: 0.5,
    borderRadius: 25,
  },
  style.center,
  style.my_sm,
  style.mr_sm,
];
