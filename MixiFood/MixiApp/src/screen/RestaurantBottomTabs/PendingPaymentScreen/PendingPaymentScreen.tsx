import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../components/Layout/Layout';
import {AppStackParamList} from '../../../navigators';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {SImageStyle, SViewStyle} from '../../../models';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {palette, scaleFontSize, style} from '../../../theme';
import {Text} from '@rneui/themed';
import Svg, {Circle} from 'react-native-svg';
import {useLoader} from '../../../contexts/loader-provider';
import {useEffect, useRef, useState} from 'react';
import {delay} from '../../../utils';
import {ELoaderType} from '../../../components/AppLoader';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {
  resetPendingInvoices,
  selectPendingInvoices,
  setNumberInvoicesToday,
} from '../../../store';
import {format} from 'date-fns';
import {TXPaymentBottomSheet} from './BottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {TInvoiceForStore} from '../../../models/invoice';
import {restaurantApi} from '../../../api/restaurantApi';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';

export const PendingPaymentScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'PendingPaymentScreen'>
> = props => {
  const {t} = useTranslation();
  const {show, hide} = useLoader();
  const {colorScheme} = useThemeContext();

  const dispatch = useAppDispatch();
  const TxPaymentBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const pendingInvoices = useAppSelector(selectPendingInvoices)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
  const [selectedPendingPayment, setSelectedPendingPayment] =
    useState<TInvoiceForStore>(pendingInvoices[0]);

  const handlePressTxPayment = (select: TInvoiceForStore) => {
    setSelectedPendingPayment(select);
    TxPaymentBottomSheetModalRef.current?.present();
  };

  const fetchPendingInvoices = async () => {
    try {
      const response = await restaurantApi.getPendingInvoices();
      if (response.data.success) {
        const data: TInvoiceForStore[] = response.data.invoicesWithEmployeeName;
        dispatch(resetPendingInvoices(data));
      }
    } catch (error) {
      console.log('error for pending invoces', error);
    }
  };

  const fetchNumberOfInvoicesToDay = async () => {
    try {
      const response = await restaurantApi.getNumberInvoicesToDay();
      if (response.data.success) {
        dispatch(setNumberInvoicesToday(response.data.numberOfInvoices));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmOnBottomSheet = async () => {
    TxPaymentBottomSheetModalRef.current?.dismiss();
    show(ELoaderType.invoiceLoader);

    try {
      const response = await restaurantApi.confirmCashPayment({
        invoiceId: selectedPendingPayment?._id || '',
      });
      if (response.data.success) {
        hide();
        await fetchPendingInvoices();
        await fetchNumberOfInvoicesToDay();
        props.navigation.navigate('PrinterPaymentInvoiceScreen', {
          invoiceId: selectedPendingPayment?._id || '',
        });
        Alert.alert(`${t('common.success')}`);
      }
    } catch (error) {
      Alert.alert(`${t('common.fail')}`, `${t('errorMessage.internet')}`);
      console.log(error);
      hide();
    }
  };

  return (
    <Layout safeAreaOnTop>
      {/* header */}
      <View style={[style.mx_md, style.my_sm]}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AppImage source={images.angle_left} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={style.mx_md}>
          {pendingInvoices &&
            pendingInvoices.map(item => (
              <TouchableOpacity
                key={item._id}
                onPress={() => handlePressTxPayment(item)}
                style={[$pendingBtn, {backgroundColor: colorScheme.default}]}>
                <View style={style.row_between}>
                  <View>
                    <Text>Issued on</Text>
                    <Text style={[style.tx_font_bold]}>
                      {item.createdAt
                        ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')
                        : 'N/A'}
                    </Text>
                  </View>
                  <View>
                    {/* <Text>Seat: seatName</Text>
                    <Text>Cash payment</Text> */}
                  </View>
                  <View>
                    <Text>Status</Text>
                    <View
                      style={[
                        {
                          backgroundColor: palette.primary1,
                          borderRadius: scaleFontSize(6),
                        },
                      ]}>
                      <View style={$pendingSpanContainer}>
                        <View style={$dot} />
                        <Text style={[style.tx_font_bold]}>
                          {t(`status.${item.status}`)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={[style.row_between, style.mt_md]}>
                  <View style={{width: '50%'}}>
                    <Text>{t('common.employee')}</Text>
                    <View style={[style.row, style.align_center]}>
                      <Image
                        source={{
                          uri: item.employeeAvatar,
                        }}
                        style={$employeeImg}
                      />
                      <View style={style.ml_xs}>
                        <Text style={style.tx_font_bold}>
                          {item.employeeName}
                        </Text>
                        <Text>Id: {item.employeeId}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text style={style.tx_font_bold}>{item.seatName}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          {pendingInvoices.length === 0 && (
            <View>
              <Text style={[style.tx_center, style.tx_font_bold]}>
                There are no invoices pending payment
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedPendingPayment && (
        <TXPaymentBottomSheet
          handleConfirmInvoice={handleConfirmOnBottomSheet}
          pendingPayment={selectedPendingPayment}
          bottomSheetModalRef={TxPaymentBottomSheetModalRef}
        />
      )}
    </Layout>
  );
};

const $pendingBtn: SViewStyle = [
  style.p_sm,
  {borderRadius: scaleFontSize(10)},
  style.shadow,
  style.mt_sm,
];
const $dot: SViewStyle = [
  {
    width: scaleFontSize(10),
    height: scaleFontSize(10),
    backgroundColor: palette.gray10,
    borderRadius: 999,
  },
  style.mr_xs,
];
const $pendingSpanContainer: SViewStyle = [style.row_center, style.p_xs];
const $employeeImg: SImageStyle = [
  {
    width: scaleFontSize(40),
    height: scaleFontSize(40),
    borderRadius: 999,
    marginTop: scaleFontSize(10),
  },
];
