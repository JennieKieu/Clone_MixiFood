import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {View} from 'react-native';
import {SViewStyle} from '../../../../models';
import {spacing, style} from '../../../../theme';
import {Button} from '@rneui/themed';
import {TPaymentMethods} from '../../../../api/api.types';
import {selectUserInfo} from '../../../../store';
import {useAppSelector} from '../../../../hooks';

type AddPaymentMethodBottomSheet = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handleSelectedMethod: (method: TPaymentMethods) => void;
};

export const AddPaymentMethodBottomSheet: React.FC<
  AddPaymentMethodBottomSheet
> = ({bottomSheetModalRef, handleSelectedMethod, ...rest}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const userInfo = useAppSelector(selectUserInfo);

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
      handleIndicatorStyle={{backgroundColor: colorScheme.text}}>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          <Button
            title={'vnpay'}
            buttonStyle={$btn}
            onPress={() => handleSelectedMethod('vnpay')}
          />
          <Button
            title={'momo'}
            buttonStyle={$btn}
            onPress={() => handleSelectedMethod('momo')}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.mb_sm,
  style.mx_md,
];
const $btn: SViewStyle = [style.my_sm];
