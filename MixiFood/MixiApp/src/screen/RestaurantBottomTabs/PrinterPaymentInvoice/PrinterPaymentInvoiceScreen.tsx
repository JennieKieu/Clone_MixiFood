import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import {Layout} from '../../../components/Layout/Layout';
import {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {useLoader} from '../../../contexts/loader-provider';
import {useTranslation} from 'react-i18next';
import {ELoaderType} from '../../../components/AppLoader';
import {restaurantApi} from '../../../api/restaurantApi';
import {SViewStyle, TRestaurantInfo, TSeating} from '../../../models';
import {TOrderItem} from '../../../models/order';
import {TInvoice} from '../../../models/invoice';
import {TOrderItemForInvoice} from '../../EmployeeBottomTabs/InvoicePrieViewScreen';
import {formatPrice} from '../../../utils/number';
import {Alert, Dimensions, TouchableOpacity, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {Text} from '@rneui/themed';
import {style} from '../../../theme';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';

export const PrinterPaymentInvoiceScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'PrinterPaymentInvoiceScreen'>
> = props => {
  const {hide, show} = useLoader();
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();

  const [pdfUri, setPdfUri] = useState<{pdfUri: string | undefined}>();
  const {invoiceId} = props.route.params;

  const createPDF = async () => {
    show(ELoaderType.invoiceLoader);

    try {
      const response = await restaurantApi.getInvoiceInfomation(invoiceId);
      if (response.data.success) {
        const restaurant: TRestaurantInfo = response.data.restaurant;
        const orderItems: TOrderItemForInvoice[] = response.data.orderItems;
        const invoice: TInvoice = response.data.invoice;
        const seat: TSeating = response.data.seat;

        const orderItemsHTML = orderItems
          .map(
            item => `
            <div class="order">
              <span>${item.foodName} (x${item.quantity}):</span>
              <span>${formatPrice(item.price?.toString() || 'NAN')} VNĐ</span>
            </div>
          `,
          )
          .join('');
        const seatName = t('common.table');

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
                  <h1>${restaurant.restaurantName}</h1>
                  <p>${t('common.address')}: ${restaurant.restaurantAddress}</p>
                  <p>${t('common.time')}: ${new Date().toLocaleString()}</p>
                  <p>${t('common.invoiceId')}: ${invoiceId}</p>
                  <p>${t('common.employeeId')}: ${invoice.employeeId}</p>
                  <p>${t('common.table')}: ${seat?.seatName}</p>
                  ${
                    invoice.status === 'success' &&
                    `
                      <p>
                        ${t('common.paymentMethod')}: ${invoice?.paymentMethod}
                      </p>
                    `
                  }
  
                </div>
                <div class="invoice">
                  <h1>${t('common.invoiceInformation')}</h1>
                  <div class="invoice-details">
                    <div class="invoice-details">
                    ${orderItemsHTML} <!-- Hiển thị tất cả các orderItems -->
                  </div>
                  </div>
                  <div class="total">${t('common.totalPrice')}: ${formatPrice(
            response.data.totalPrice,
          )} VNĐ</div>
                </div>
              </body>
            </html>
          `,
          fileName: 'invoicePreview',
          directory: 'Documents', // Tùy chọn này có thể không cần thiết nếu không lưu file
          base64: true,
        };
        const file = await RNHTMLtoPDF.convert(options);
        hide();
        setPdfUri({pdfUri: file.filePath});
        hide();
      }
    } catch (error) {
      Alert.alert(`${t('common.fail')}`, `${t('errorMessage.internet')}`);
      props.navigation.goBack();
      hide();
    }
  };

  const handlePrint = async () => {
    pdfUri?.pdfUri && (await RNPrint.print({filePath: pdfUri?.pdfUri}));
  };

  useEffect(() => {
    createPDF();
  }, []);

  return (
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
          <View style={$printBtn}>
            <TouchableOpacity
              style={$borderBtn}
              onPress={() => props.navigation.goBack()}>
              <AppImage source={images.back_icon} />
            </TouchableOpacity>

            <TouchableOpacity style={$borderBtn} onPress={handlePrint}>
              <Text>{t('common.print')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Layout>
  );
};

const $printBtn: SViewStyle = [
  style.abs,
  {
    top: 0,
    right: 0,
    padding: 5,
    left: 0,
  },
  style.mx_sm,
  style.row_between,
];

const $borderBtn: SViewStyle = [{borderWidth: 1, borderRadius: 4}, style.p_xxs];
