import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../components/Layout/Layout';
import {STextStyle, SViewStyle} from '../../models/Style';
import {AppStackParamList} from '../../navigators';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Button, Text, useThemeMode} from '@rneui/themed';
import {AppImage} from '../../components/AppImage';
import {images} from '../../../assets';
import {palette, scale, scaleFontSize, style} from '../../theme';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import useCountDown from '../../hooks/useCountDown';
import {loginApi} from '../../api/loginApi';
import {useAppDispatch} from '../../hooks';
import {login, setUserType} from '../../store';
import {useLoader} from '../../contexts/loader-provider';
import {ELoaderType} from '../../components/AppLoader';
import {useThemeContext} from '../../contexts/ThemeContext';
import {AppModal} from '../../components/AppModal';

export const SmsVerifyScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'SmsVerifyScreen'>
> = props => {
  const {t} = useTranslation();
  const refs = useRef<Array<TextInput>>([]);
  const {mode} = useThemeMode();
  const [isFocused, setIsfocused] = useState<number | null>(null);
  const {intervalId, start, value, isRunning} = useCountDown(60);
  const [otpNumber, setOtpNumber] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const {show, hide} = useLoader();
  const dispatch = useAppDispatch();
  const {phoneNumber, userType} = props.route.params;
  const {colorScheme} = useThemeContext();
  const [confirmAddLocationModalVisible, setConfirmAddLocationModalVisible] =
    useState<boolean>(false);

  useLayoutEffect(() => {
    start();
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AppImage source={images.angle_left}></AppImage>
        </TouchableOpacity>
      ),
      headerTitle: '',
    });
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSendSmsOtp = async () => {
    try {
      const response = await loginApi.sendSmsOtp({phoneNumber, userType});
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextPress = async () => {
    Keyboard.isVisible() && Keyboard.dismiss();
    show();
    try {
      const response = await loginApi.verifySmsOtp({
        phoneNumber,
        userType,
        smsOtp: otpNumber.join(''),
      });
      if (response.data.success) {
        // dispatch(login());
        dispatch(setUserType(userType));
        // props.navigation.navigate('AppBottomTabbar');
        // props.navigation.navigate('ConfirmLocationMapScreen');
        setConfirmAddLocationModalVisible(true);
        hide();
      } else {
        Alert.alert(
          t('smsScreen.errorMsg.title'),
          t('smsScreen.errorMsg.message'),
        );
        hide();
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        t('smsScreen.errorMsg.title'),
        t('smsScreen.errorMsg.message'),
      );
      hide();
    }
  };

  useEffect(() => {
    handleSendSmsOtp();
  }, []);

  const handleInputChange = (index: number, text: string) => {
    const newOtpNumber = [...otpNumber];
    newOtpNumber[index] = text;
    setOtpNumber(newOtpNumber);
    if (text.length === 0 && index > 0) {
      let newIndex = index - 1;
      while (newIndex >= 0 && newOtpNumber[newIndex] === '') {
        newIndex--;
      }
      if (newIndex >= 0) {
        refs.current[newIndex].focus();
      }
    } else if (text.length === 1 && index < otpNumber.length - 1)
      refs.current[index + 1].focus();
  };

  const handleInputFocus = (index: number) => {
    for (let i = index - 1; i >= 0; i--) {
      if (otpNumber[i] === '') {
        refs.current[i].focus();
        return;
      }
    }
    setIsfocused(index);
    refs.current[index].focus();
  };

  const handleInputBlur = (index: number) => {
    setIsfocused(null);
    refs.current[index].blur();
  };

  const handleResendCode = () => {
    start();
    handleSendSmsOtp();
  };

  const handleConfirmSetLocation = () => {
    setConfirmAddLocationModalVisible(false);
    props.navigation.navigate('ConfirmLocationMapScreen');
  };

  return (
    <Layout style={$root} safeAreaOnBottom safeAreaOnTop>
      <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.isVisible() && Keyboard.dismiss()}>
          <View style={$innerContainer}>
            <View style={$centerContainer}>
              <AppImage source={images.smsOtp}></AppImage>
              <Text style={$textTitle}>
                {t('smsScreen.title', {
                  phoneNumber: props.route.params.phoneNumber,
                })}
              </Text>
              <Text style={$textSpan}>{t('smsScreen.span')}</Text>
              <View style={$smsOtpContainer}>
                {otpNumber.map((digit, index) => (
                  <View
                    key={index}
                    style={[
                      $inputContainer,
                      {
                        borderBlockColor:
                          isFocused === index
                            ? '#21d0f4'
                            : mode === 'light'
                            ? palette.black
                            : palette.white,
                      },
                    ]}>
                    <TextInput
                      key={index}
                      ref={(ref: TextInput) => (refs.current[index] = ref)}
                      keyboardType="numeric"
                      maxLength={1}
                      value={digit}
                      style={[$input, {color: colorScheme.text}]}
                      onChangeText={text => handleInputChange(index, text)}
                      onFocus={() => handleInputFocus(index)}
                      onBlur={() => handleInputBlur(index)}
                      onKeyPress={({nativeEvent}) => {
                        if (nativeEvent.key === 'Backspace') {
                          handleInputChange(index, '');
                        }
                      }}></TextInput>
                  </View>
                ))}
              </View>
              {value !== 0 ? (
                <Text style={$resendText}>
                  {t('smsScreen.resend')}{' '}
                  <Text style={[$resendText, {color: palette.primary5}]}>
                    {t('smsScreen.countDown', {countDown: value})}
                  </Text>
                </Text>
              ) : (
                <Button
                  type="outline"
                  title={t('smsScreen.resend')}
                  buttonStyle={style.mt_lg}
                  onPress={handleResendCode}></Button>
              )}
            </View>
            <View style={$footerItem}>
              <Button
                type="solid"
                buttonStyle={$button}
                title={t('common.next')}
                titleStyle={$buttonText}
                onPress={handleNextPress}
                disabled={
                  otpNumber.join('').length === 6 ? false : true
                }></Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <AppModal
        modalVisible={confirmAddLocationModalVisible}
        setModalVisible={setConfirmAddLocationModalVisible}
        title={t('common.confirm')}
        content={t('smsScreen.modal.confirmSetLocation')}
        btn2Title={t('common.confirm')}
        handleCancel={() => setConfirmAddLocationModalVisible(false)}
        handleOk={handleConfirmSetLocation}
      />
    </Layout>
  );
};

const $root: SViewStyle = [style.flex_1];

const $innerContainer: SViewStyle = [
  style.flex_1,
  style.px_lg,
  style.justify_between,
  style.align_center,
];

const $centerContainer: SViewStyle = [style.align_center];
const $textTitle: STextStyle = [
  style.tx_center,
  style.tx_font_bold,
  {fontSize: scaleFontSize(16, 32)},
];
const $textSpan: STextStyle = [
  style.tx_font_light,
  {fontSize: scaleFontSize(12, 24)},
  style.tx_center,
  style.py_sm,
];

const $inputContainer: SViewStyle = [
  {borderBottomWidth: 1},
  // style.row,
  style.justify_between,
];
const $smsOtpContainer: SViewStyle = [
  style.align_center,
  {width: '100%'},
  style.row_between,
  style.px_lg,
];
const $input: SViewStyle | STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(18, 32)},
];
const $footerItem: SViewStyle = [style.w_screenWidth, style.px_lg];
const $button: SViewStyle = [
  {height: scale.y(45, 95), borderRadius: scale.x(10, 20)},
];
const $buttonText: STextStyle = [style.tx_font_bold, style.tx_size_lg];
const $resendText: STextStyle = [style.my_lg, style.tx_font_semiBold];
