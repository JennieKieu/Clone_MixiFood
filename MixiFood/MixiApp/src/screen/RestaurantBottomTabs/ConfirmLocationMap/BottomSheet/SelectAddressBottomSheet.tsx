import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {STextStyle, SViewStyle} from '../../../../models';
import {spacing, style} from '../../../../theme';
import {Button, Text} from '@rneui/themed';
import {TFeatureForGeocoding} from '../ConfirmLocationMapScreen.types';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type SelectedAddressBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  feature: TFeatureForGeocoding;
  handleConfirm: () => void;
};

export const SelectedAddressBottomSheet: React.FC<
  SelectedAddressBottomSheetProps
> = ({bottomSheetModalRef, feature, handleConfirm, ...rest}) => {
  const {t} = useTranslation();
  const insert = useSafeAreaInsets();

  return (
    <BottomSheetModal
      {...rest}
      ref={bottomSheetModalRef}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          <View style={[style.mx_md]}>
            <Text style={$address}>{feature?.properties?.address || ''}</Text>
            <Text>{feature?.properties?.fullAddress || ''}</Text>
            <Text
              style={[
                style.my_xs,
              ]}>{`[${feature?.center[0]} - ${feature?.center[1]}]`}</Text>
            <Button
              type="solid"
              title={t('common.confirm')}
              buttonStyle={[style.my_sm]}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
];
const $address: STextStyle = [style.my_xs];
