import {CompositeScreenProps} from '@react-navigation/native';
import {Layout} from '../../../components/Layout/Layout';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {AppRestaurantDrawerStackParamList} from '../../../navigators/AppRestaurantDrawerStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import {palette, scaleFontSize, spacing, style} from '../../../theme';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {useLoader} from '../../../contexts/loader-provider';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {TInvoiceForStore} from '../../../models/invoice';
import {useAppSelector} from '../../../hooks';
import {
  resetInvoicesByFillter,
  selectInvoices,
  selectInvoicesByFilter,
  selectIsInvoiceFilter,
  selectTotalRevenue,
} from '../../../store';
import {SImageStyle, SViewStyle} from '../../../models';
import {Text} from '@rneui/themed';
import {format} from 'date-fns';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {TXPaymentBottomSheet} from '../PendingPaymentScreen/BottomSheet';
import {ELoaderType} from '../../../components/AppLoader';
import {restaurantApi} from '../../../api/restaurantApi';
import {TFilterDrawerParamlist, TPaymentHistoryProps} from './Drawer';
import {AppInput} from '../../../components/AppInput';
import {formatPrice} from '../../../utils/number';

export const PaymentHistoriesScreen: React.FC<
  CompositeScreenProps<
    DrawerScreenProps<TFilterDrawerParamlist, 'PaymentHistoriesScreen'>,
    NativeStackScreenProps<AppStackParamList>
  >
> = ({...props}) => {
  const {t} = useTranslation();
  const {show, hide} = useLoader();
  const {colorScheme} = useThemeContext();

  const TxPaymentBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const isInvoiceFilter = useAppSelector(selectIsInvoiceFilter);
  const totalRevenue = useAppSelector(selectTotalRevenue);
  const invoices: TInvoiceForStore[] = useAppSelector(selectInvoicesByFilter)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
  const [selectedInvoice, setSelectedInvoice] = useState<TInvoiceForStore>(
    invoices[0],
  );

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <View style={style.ml_md}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <AppImage source={images.angle_left} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={style.mr_md}>
          <TouchableOpacity onPress={props.navigation.openDrawer}>
            <AppImage source={images.filter} />
          </TouchableOpacity>
        </View>
      ),

      headerTitle: () => <View></View>,
    });
  }, []);

  const handlePressTxPayment = (select: TInvoiceForStore) => {
    setSelectedInvoice(select);
    TxPaymentBottomSheetModalRef.current?.present();
  };

  const handleConfirmOnBottomSheet = async () => {
    TxPaymentBottomSheetModalRef.current?.dismiss();
    show(ELoaderType.invoiceLoader);

    try {
      hide();
      props.navigation.navigate('PrinterPaymentInvoiceScreen', {
        invoiceId: selectedInvoice?._id || '',
      });
    } catch (error) {
      console.log(error);
      hide();
    }
  };

  // fetching data on limit -> custom hook

  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleScroll = useCallback(
    ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
      const paddingToBottom = 20; // Khoảng cách tính từ dưới lên để kích hoạt tải thêm

      // Kiểm tra nếu vị trí cuộn gần đến cuối nội dung
      const isNearBottom =
        nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - paddingToBottom;

      if (isNearBottom && !isFetching) {
        // Nếu cuộn gần cuối và chưa đang tải, tăng số trang để tải thêm
        setIsFetching(true); // Đặt trạng thái đang tải để tránh gọi nhiều lần
        setPage(prevPage => prevPage + 1);
      }
    },
    [isFetching], // Chỉ gọi lại khi `isFetching` thay đổi
  );

  const fetchMoreData = useCallback(async () => {
    if (isFetching) {
      setTimeout(() => {
        setIsFetching(false);
      }, 1000);
    }
  }, [isFetching]);

  useEffect(() => {
    if (page > 1) console.log('kê');
  }, [page, fetchMoreData]);

  // fetching data on limit

  const totoalPriceToday = useMemo(() => {
    return '100.000 VND';
  }, []);

  return (
    <Layout>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={style.mx_md}>
          {invoices &&
            invoices.map(item => (
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
          {invoices.length === 0 && (
            <Text style={[style.tx_center, style.tx_font_bold]}>
              The restaurant hasn't had any orders yet today!
            </Text>
          )}
        </View>
      </ScrollView>
      <View style={$totalPriceToDay}>
        <View>
          <Text style={[style.tx_font_bold, {fontSize: scaleFontSize(16)}]}>
            {t('common.totalPrice')}
          </Text>
        </View>
        <Text style={[style.tx_font_bold, {fontSize: scaleFontSize(16)}]}>
          {formatPrice(totalRevenue) || 0} VNĐ
        </Text>
      </View>
      {selectedInvoice && (
        <TXPaymentBottomSheet
          isHistory
          handleConfirmInvoice={handleConfirmOnBottomSheet}
          pendingPayment={selectedInvoice}
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
const $pendingSpanContainer: SViewStyle = [style.row_center, style.p_xs];
const $dot: SViewStyle = [
  {
    width: scaleFontSize(10),
    height: scaleFontSize(10),
    backgroundColor: palette.gray10,
    borderRadius: 999,
  },
  style.mr_xs,
];
const $employeeImg: SImageStyle = [
  {
    width: scaleFontSize(40),
    height: scaleFontSize(40),
    borderRadius: 999,
    marginTop: scaleFontSize(10),
  },
];
const $totalPriceToDay: SViewStyle = [
  style.p_sm,
  style.row_between,
  style.shadow,
];
