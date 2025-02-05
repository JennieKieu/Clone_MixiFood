import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {STextStyle, SViewStyle} from '../../../../models';
import {scale, scaleFontSize, spacing, style} from '../../../../theme';
import {Text} from '@rneui/themed';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../../assets/lottieAnimation';
import {TKitchangeFoodItemStatus} from '../../../../api/api.types';

type KithchenActionBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handleStatusChange: (status: TKitchangeFoodItemStatus) => void;
  handleDismiss: () => void;
} & Omit<BottomSheetModalProps, 'children'>;

export const KitchenActionBottomSheet: React.FC<
  KithchenActionBottomSheetProps
> = ({bottomSheetModalRef, handleStatusChange, handleDismiss, ...rest}) => {
  const {t} = useTranslation();

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
      onDismiss={handleDismiss}>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          <View style={$innerContainer}>
            <TouchableOpacity
              style={$optionBtn}
              onPress={() => handleStatusChange('complete')}>
              <LottieView
                source={lottieAnmiations.checkBox}
                autoPlay
                style={$icon}
              />
              <View style={$section}>
                <Text style={$optionBtnText}>{t('common.complete')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={$optionBtn}
              onPress={() => handleStatusChange('cancel')}>
              <LottieView
                source={lottieAnmiations.cancel}
                autoPlay
                style={$icon}
                resizeMode="cover"
              />
              <View style={$section}>
                <Text style={$optionBtnText}>{t('common.cancel')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
  style.mb_md,
];
const $innerContainer: SViewStyle = [style.mx_sm];
const $optionBtn: SViewStyle = [
  style.row_between,
  style.align_center,
  style.mb_md,
];
const $icon: SViewStyle = [
  {width: scale.x(40, 40 * 1.5), height: scale.x(40, 40 * 1.5)},
];
const $section: SViewStyle = [
  {width: '85%', borderBottomWidth: 1.5, borderColor: '#ccc'},
];

const $optionBtnText: STextStyle = [
  {fontSize: scaleFontSize(18, 18 * 1.5), paddingBottom: 4},
  style.tx_font_bold,
];
