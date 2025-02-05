import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {View} from 'react-native';
import {SViewStyle} from '../../../../models';
import {palette, spacing, style} from '../../../../theme';
import {Button, Text} from '@rneui/themed';
import {TInvoiceForStore} from '../../../../models/invoice';
import {useAppSelector} from '../../../../hooks';
import {selectFoods} from '../../../../store';
import {useCallback, useEffect} from 'react';
import {useFetchFoods} from '../../../../hooks/Food';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetDefaultFooterProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import {formatPrice} from '../../../../utils/number';

type TTXPaymentBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  pendingPayment: TInvoiceForStore;
  handleConfirmInvoice: () => void;
  isHistory?: boolean;
} & Omit<BottomSheetModalProps, 'children'>;

export const TXPaymentBottomSheet: React.FC<TTXPaymentBottomSheetProps> = ({
  bottomSheetModalRef,
  pendingPayment,
  handleConfirmInvoice,
  isHistory,
  ...rest
}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const foods = useAppSelector(selectFoods);
  const insets = useSafeAreaInsets();

  const renderFooter = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={24} style={style.mx_sm}>
        <Button
          type="solid"
          title={t('EmployeeScreen.EmployeeOptionsBottomSheet.edit')}
        />
      </BottomSheetFooter>
    ),
    [],
  );

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
      handleIndicatorStyle={{
        backgroundColor: colorScheme.text,
      }}
      style={{marginTop: insets.top}}
      // footerComponent={renderFooter}
    >
      <BottomSheetScrollView style={{marginBottom: insets.bottom}}>
        <View style={$modalContent}>
          <View
            style={[
              style.row_between,
              style.p_sm,
              {backgroundColor: colorScheme.default, borderRadius: spacing.xs},
            ]}>
            <Text>{t('common.descriptions')}</Text>
            <Text>{t('common.price')}</Text>
          </View>
          {/*  */}
          {pendingPayment.orderItems.map(item => {
            const food = foods.find(x => x._id === item.foodId);

            return (
              <Item
                key={item._id}
                description={food?.name || ''}
                price={item?.price}
                quantity={item.quantity}
              />
            );
          })}
          <View style={$totalPrice}>
            <Text>{t('common.totalPrice')}</Text>
            <Text>{formatPrice(pendingPayment.totalPrice.toString())} VNĐ</Text>
          </View>
          {/*  */}
          {!isHistory ? (
            <View style={$footer}>
              <View></View>
              <View style={style.row}>
                <Button
                  type="outline"
                  title={t('common.cancel')}
                  buttonStyle={[style.mr_sm, $btn]}
                />
                <Button
                  type="solid"
                  title={t('common.confirm')}
                  buttonStyle={$btn}
                  onPress={handleConfirmInvoice}
                />
              </View>
            </View>
          ) : (
            <View style={$footer}>
              <View></View>
              <View>
                <Button
                  type="solid"
                  title={t('common.invoice')}
                  buttonStyle={$btn}
                  onPress={handleConfirmInvoice}
                />
              </View>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

type ItemProps = {
  description: string;
  price: number;
  quantity: number;
};

const Item: React.FC<ItemProps> = ({description, price, quantity}) => {
  const {t} = useTranslation();

  return (
    <View style={$item}>
      <View style={style.row}>
        <View>
          <View style={style.row_between}>
            <View style={style.row}>
              <Text>{description}</Text>
              <Text> {`(x${quantity})`}</Text>
            </View>
            <Text>{formatPrice(price.toString())} VNĐ</Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[style.my_sm, {opacity: 0.5}]}>
            {`-`.repeat(500)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const $modalContent: SViewStyle = [
  {borderRadius: spacing.md},
  style.mx_md,
  style.flex_1,
];
const $footer: SViewStyle = [
  style.row_between,
  style.my_sm,
  style.pt_md,
  {borderTopWidth: 1, borderColor: palette.gray10},
  style.pb_lg,
];
const $item: SViewStyle = [style.row_between, style.m_sm];
const $btn: SViewStyle = [{height: 40}];
const $totalPrice = [style.mx_sm, style.mb_sm, style.row_between];
