import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../components/Layout/Layout';
import {AppStackParamList} from '../../../navigators';
import {
  Alert,
  Keyboard,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {scaleFontSize, style} from '../../../theme';
import {AppInput} from '../../../components/AppInput';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import {TCreateVnPayment, TPaymentMethods} from '../../../api/api.types';
import {useLoader} from '../../../contexts/loader-provider';
import {restaurantApi} from '../../../api/restaurantApi';
import {useFormik} from 'formik';
import {ELoaderType} from '../../../components/AppLoader';
import {useAppDispatch} from '../../../hooks';
import {addRestaurantPaymentMethod} from '../../../store';
import {TRestaurantPaymentMethods} from '../../../models';

export const AddPaymentMethodScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'AddPaymentMethodScreen'>
> = props => {
  const {method} = props.route.params;
  const {t} = useTranslation();
  const loader = useLoader();

  const dispatch = useAppDispatch();

  const vnPayformik = useFormik<TCreateVnPayment>({
    initialValues: {
      tmnCode: '',
      secret: '',
    },
    onSubmit: async (values, {setErrors}) => {
      loader.show(ELoaderType.foodLoader1);
      try {
        const response = await restaurantApi.createVnPayment({
          tmnCode: values.tmnCode,
          secret: values.secret,
        });
        if (response.data.success) {
          const paymentMethod: TRestaurantPaymentMethods =
            response.data.paymentMethod;
          dispatch(addRestaurantPaymentMethod(paymentMethod));
          loader.hide();
          Alert.alert(t('common.success'));
          props.navigation.goBack();
        }
      } catch (error) {
        loader.hide();
        Alert.alert(t('common.fail'));
        console.log(error);
      }
    },
  });

  return (
    <Layout safeAreaOnTop safeAreaOnBottom style={style.justify_between}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.isVisible() && Keyboard.dismiss()}>
        <View style={style.mx_md}>
          {method === 'vnpay' && (
            <View>
              <AppInput
                label="Tmn Code"
                value={vnPayformik.values.tmnCode}
                onChangeText={vnPayformik.handleChange('tmnCode')}
                onBlur={vnPayformik.handleBlur('tmnCode')}
                errorMessage={
                  vnPayformik.touched.tmnCode && vnPayformik.errors.tmnCode
                    ? vnPayformik.errors.tmnCode
                    : undefined
                }
              />
              <View style={style.my_xs} />
              <AppInput
                label="Secret"
                value={vnPayformik.values.secret}
                onChangeText={vnPayformik.handleChange('secret')}
                onBlur={vnPayformik.handleBlur('secret')}
                errorMessage={
                  vnPayformik.touched.secret && vnPayformik.errors.secret
                    ? vnPayformik.errors.secret
                    : undefined
                }
              />
            </View>
          )}
          {method === 'momo' && (
            <Text
              style={[
                style.tx_font_bold,
                style.tx_center,
                {fontSize: scaleFontSize(30)},
              ]}>
              Comming son!
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
      {method === 'vnpay' && (
        <Button
          type="solid"
          title={t('common.confirm')}
          buttonStyle={style.mx_md}
          onPress={vnPayformik.submitForm}
        />
      )}
    </Layout>
  );
};
