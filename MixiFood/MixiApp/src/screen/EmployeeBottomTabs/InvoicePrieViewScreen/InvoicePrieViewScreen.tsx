import {useEffect, useMemo, useRef, useState} from 'react';
import {Layout} from '../../../components/Layout/Layout';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Alert, Dimensions, TouchableOpacity, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {Button, Text} from '@rneui/themed';
import {style} from '../../../theme';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {useTranslation} from 'react-i18next';
import {SViewStyle, TRestaurantInfo} from '../../../models';
import RNPrint from 'react-native-print';
import {PaymentMethodBottomSheet} from './BottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useLoader} from '../../../contexts/loader-provider';
import {employeeApi} from '../../../api/employeeApi';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {TOrder, TOrderItem, TOrderStatus} from '../../../models/order';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {
  createOrEditOrderByEmployee,
  ERestaurantPayment,
  selectFoodsByEmployee,
  selectSeatingsByEmployee,
} from '../../../store';
import {formatPrice} from '../../../utils/number';
import {ELoaderType} from '../../../components/AppLoader';
import {delay} from '../../../utils';
import {TCreateInvoice, TPaymentMethods} from '../../../api/api.types';
import {TPaymentBottomSheetContent} from './InvoicePrieViewScreen.types';
import {TInvoice} from '../../../models/invoice';
import QRCode from 'qrcode';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import socketClient from '../../../socket/socketClient';

export type TOrderItemForInvoice = {
  foodName: string;
  totalPrice: string;
  status: TOrderStatus;
  price?: number;
} & TOrderItem;

export const InvoicePrieViewScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'InvoicePrieViewScreen'>
> = props => {
  const [pdfUri, setPdfUri] = useState<{pdfUri: string | undefined}>();
  const [orderStatus, setOrderStatus] = useState<TOrderStatus>();
  const {colorScheme} = useThemeContext();
  const dispatch = useAppDispatch();
  const {seatId} = props.route.params;
  const seat = useAppSelector(selectSeatingsByEmployee).find(
    x => x._id === seatId,
  );
  const {hide, show} = useLoader();
  const {t} = useTranslation();
  const [qrcodeUrl, setQrcodeToUrl] = useState<string>();
  const [currentInvoice, setCurrentInvoice] = useState<TInvoice>();

  const generateQRBase64 = async (text: string) => {
    try {
      const qrBase64 = await QRCode.toString(text, {type: 'svg'});
      return qrBase64;
    } catch (err) {
      console.error('Failed to generate QR:', err);
    }
  };

  const [paymentOption, setPaymentOption] = useState<
    TPaymentBottomSheetContent[]
  >(['default']);
  const [paymentContent, setPaymentContent] =
    useState<TPaymentBottomSheetContent>('default');
  const PatmenMethodsBottomSheetRef = useRef<BottomSheetModal>(null);

  const createPDF = async (qrCodeStr?: string) => {
    show(ELoaderType.invoiceLoader);

    try {
      const response = await employeeApi.getOrderBySeatId(seatId);
      if (response.data.success) {
        const restaurant: TRestaurantInfo = response.data.restaurant;

        const availablePaymentMethods =
          restaurant.paymentMethods?.map(method => method.paymentMethodName) ||
          [];
        const newPaymentOption: ERestaurantPayment[] = [];
        if (availablePaymentMethods.includes(ERestaurantPayment.vnpay)) {
          newPaymentOption.push(ERestaurantPayment.vnpay);
        }
        if (availablePaymentMethods.includes(ERestaurantPayment.momo)) {
          newPaymentOption.push(ERestaurantPayment.momo);
        }
        setPaymentOption(newPaymentOption);

        const order: {totalAmount: string} & TOrder = response.data.order;
        setOrderStatus(order.status);
        const orderItems: TOrderItemForInvoice[] =
          order.foodItems as TOrderItemForInvoice[];

        //
        socketClient.joinWaitingPayment({orderId: order._id});
        socketClient
          .getSocket()
          ?.on(
            'onPaymentNotification',
            (data: {msg: string; content: string}) => {
              Alert.alert(data.content);
            },
          );
        //
        let invoice: TInvoice | undefined = undefined;
        let qrcode;
        if (order.status === 'payment') {
          invoice = response.data.invoice;
          setQrcodeToUrl(invoice?.vnpayUrl);
          setPaymentContent('vnpay');
          setCurrentInvoice(invoice);
          qrCodeStr = await generateQRBase64(invoice?.vnpayUrl || '');
        }
        //

        //
        const restaurantName = `${t('common.restaurant')} ${
          restaurant.restaurantName
        }`;
        const address = `${t('common.address')}`;
        const time = `${t('common.time')}`;
        const invoiceInformation = t('common.invoiceInformation');
        const totalPrice = t('common.totalPrice');
        const employeeId = t('common.employeeId');
        const orderItemsHTML = orderItems
          .map(
            item => `
            <div class="order">
              <span>${item.foodName} (x${item.quantity}):</span>
              <span>${formatPrice(item.totalPrice)} VNĐ</span>
            </div>
          `,
          )
          .join('');
        const seatName = t('common.table');
        //

        const options = {
          html: `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; height: '100%'}
                .header { text-align: center; padding: 20px; }
                .header img { width: 100px; }
                .invoice { margin: 20px; }
                .invoice h1 { text-align: center; }
                .invoice-details { margin-top: 20px; }
                .order { display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding: 10px 0; }
                .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <img src="${restaurant.avatar}" alt="Restaurant Logo" />
                <h1>${restaurantName}</h1>
                <p>${address}: ${restaurant.restaurantAddress}</p>
                <p>${time}: ${new Date().toLocaleString()}</p>
                <p>${employeeId}: ${order.employeeId}</p>
                <p>${seatName}: ${seat?.seatName}</p>

              </div>
              <div class="invoice">
                <h1>${invoiceInformation}</h1>
                <div class="invoice-details">
                  <div class="invoice-details">
                  ${orderItemsHTML} <!-- Hiển thị tất cả các orderItems -->
                </div>
                </div>
                <div class="total">${totalPrice}: ${formatPrice(
            order.totalAmount,
          )} VNĐ</div>
              </div>
               <div style="width: 30%; margin-left: auto; margin-right: auto;">${qrCodeStr}</div>

            </body>
          </html>
        `,
          fileName: 'invoicePreview',
          directory: 'Documents', // Tùy chọn này có thể không cần thiết nếu không lưu file
          base64: true,
        };
        //
        const file = await RNHTMLtoPDF.convert(options);
        hide();
        setPdfUri({pdfUri: file.filePath});
      }
    } catch (error) {
      hide();
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const handlePrint = async () => {
    console.log('padfUri', pdfUri?.pdfUri);
    pdfUri?.pdfUri && (await RNPrint.print({filePath: pdfUri?.pdfUri}));
  };

  useEffect(() => {
    createPDF();
  }, [orderStatus]);

  const handlePayNow = () => {
    PatmenMethodsBottomSheetRef.current?.present();
  };

  const handlePayOnBottomSheet = async (paymentMethod: TPaymentMethods) => {
    const data: TCreateInvoice = {
      orderId: seat?.currentOrderId || '',
      paymentMethod: paymentMethod,
    };
    switch (paymentMethod) {
      case (paymentMethod = 'cash'): {
        show(ELoaderType.invoiceLoader);
        try {
          const response = await employeeApi.createInvoice(data);
          if (response.data.success) {
            setOrderStatus(response.data.order.status);
            dispatch(createOrEditOrderByEmployee(response.data.order));
            hide();
            PatmenMethodsBottomSheetRef.current?.dismiss();
            Alert.alert(`${t('common.success')}`);
          }
        } catch (error) {
          hide();
          console.log(error);
          Alert.alert(`${t('common.fail')}`, `${t('errorMessage.internet')}`);
          PatmenMethodsBottomSheetRef.current?.dismiss();
        }
        break;
      }
      case (paymentMethod = 'momo'):
        console.log('momo payment');
        break;
      case (paymentMethod = 'vnpay'): {
        show(ELoaderType.invoiceLoader);
        try {
          const response = await employeeApi.createInvoice(data);
          if (response.data.success) {
            const invoice: TInvoice = response.data.invoice;
            setCurrentInvoice(invoice);
            const qrCode = await generateQRBase64(invoice.vnpayUrl || '');
            setPdfUri(undefined);
            await createPDF(qrCode);
            console.log('issInvoice', invoice);

            setOrderStatus(response.data.order.status);
            dispatch(createOrEditOrderByEmployee(response.data.order));
            hide();
            setPaymentContent('vnpay');
            Alert.alert(`${t('common.success')}`);
          }
        } catch (error) {
          hide();
          console.log(error);
          Alert.alert(`${t('common.fail')}`, `${t('errorMessage.internet')}`);
          PatmenMethodsBottomSheetRef.current?.dismiss();
        }
        break;
      }
    }
  };

  const handleBottomSheetDismiss = () => {
    paymentContent !== 'default' && setPaymentContent('default');
  };

  return (
    <>
      <Layout safeAreaOnTop safeAreaOnBottom>
        {pdfUri && (
          <View
            style={{
              flex: 1,
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height,
            }}>
            <Pdf
              source={{uri: pdfUri.pdfUri, cache: true}}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: colorScheme.background,
              }}
            />
            <TouchableOpacity
              style={$backBtn}
              onPress={() => props.navigation.goBack()}>
              <AppImage source={images.angle_left} />
            </TouchableOpacity>
            <TouchableOpacity style={$printBtn} onPress={handlePrint}>
              <Text>{t('common.print')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Button
          title={t('common.payNow')}
          type="solid"
          buttonStyle={style.mx_sm}
          onPress={handlePayNow}
          disabled={orderStatus === 'payment'}
        />
      </Layout>
      <PaymentMethodBottomSheet
        handlePay={(input: TPaymentMethods) => handlePayOnBottomSheet(input)}
        bottomSheetModalRef={PatmenMethodsBottomSheetRef}
        handleDismiss={handleBottomSheetDismiss}
        paymentContent={paymentContent}
        paymentOption={paymentOption}
        currentInvoice={currentInvoice}
      />
    </>
  );
};

const $printBtn: SViewStyle = [
  {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
    borderWidth: 1,
    borderRadius: 4,
  },
  style.mr_sm,
];

const $backBtn: SViewStyle = [
  {
    position: 'absolute',
    top: 0,
    left: 10,
    padding: 5,
    borderWidth: 1,
    borderRadius: 4,
  },
  style.mr_sm,
];
