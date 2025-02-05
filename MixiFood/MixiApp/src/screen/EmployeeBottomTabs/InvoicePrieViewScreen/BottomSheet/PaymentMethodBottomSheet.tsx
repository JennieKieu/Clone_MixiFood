import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {Image, TouchableOpacity, View} from 'react-native';
import {STextStyle, SViewStyle} from '../../../../models';
import {scaleFontSize, spacing, style} from '../../../../theme';
import {Text} from '@rneui/themed';
import {images} from '../../../../../assets';
import {useTranslation} from 'react-i18next';
import {TPaymentMethods} from '../../../../api/api.types';
import QRCode from 'react-native-qrcode-svg';
import {TPaymentBottomSheetContent} from '../InvoicePrieViewScreen.types';
import {TInvoice} from '../../../../models/invoice';

type PaymentMethodBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handlePay: (paymentMethod: TPaymentMethods) => void;
  handleDismiss: () => void;
  paymentOption: TPaymentBottomSheetContent[];
  paymentContent: TPaymentBottomSheetContent;
  currentInvoice?: TInvoice;
};

export const PaymentMethodBottomSheet: React.FC<
  PaymentMethodBottomSheetProps
> = ({
  bottomSheetModalRef,
  handlePay,
  handleDismiss,
  paymentOption,
  paymentContent,
  currentInvoice,
  ...rest
}) => {
  const {colorScheme} = useThemeContext();
  const {t} = useTranslation();

  console.log('asjdwqc', currentInvoice);

  return (
    <BottomSheetModal
      {...rest}
      ref={bottomSheetModalRef}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing
      backgroundStyle={{backgroundColor: colorScheme.background}}
      handleIndicatorStyle={{backgroundColor: colorScheme.text}}
      onDismiss={handleDismiss}>
      <BottomSheetScrollView>
        {paymentContent === 'default' && (
          <View style={$modalContent}>
            <View style={$innerContainer}>
              <TouchableOpacity
                style={$paymentBtn}
                onPress={() => handlePay('cash')}>
                <Image source={images.cash} />
                <View style={$line}>
                  <Text style={$payMentTitle}>{t('common.cashPayment')}</Text>
                </View>
              </TouchableOpacity>
              {paymentOption.includes('vnpay') && (
                <TouchableOpacity
                  style={$paymentBtn}
                  onPress={() => handlePay('vnpay')}>
                  <Image
                    source={images.vnpay}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                  <View style={$line}>
                    <Text style={$payMentTitle}>VNPay</Text>
                  </View>
                </TouchableOpacity>
              )}
              {paymentOption.includes('momo') && (
                <TouchableOpacity
                  style={$paymentBtn}
                  onPress={() => handlePay('momo')}>
                  <Image
                    source={images.momo_circle}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                  <View style={$line}>
                    <Text style={$payMentTitle}>VNPay</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {paymentContent === 'vnpay' && (
          <View style={$modalContent}>
            <View style={[$innerContainer, style.center, style.mb_md]}>
              <QRCode
                value={currentInvoice?.vnpayUrl}
                size={200}
                logo={images.vnpay}
                logoBorderRadius={8}
              />
            </View>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
  style.mb_md,
];
const $innerContainer: SViewStyle = [style.mx_lg];
const $paymentBtn: SViewStyle = [style.row, style.mb_md];
const $payMentTitle: STextStyle = [{fontSize: scaleFontSize(16)}];
const $line: SViewStyle = [
  {borderBottomWidth: 1},
  style.ml_md,
  style.flex_1,
  style.pb_xxs,
];
