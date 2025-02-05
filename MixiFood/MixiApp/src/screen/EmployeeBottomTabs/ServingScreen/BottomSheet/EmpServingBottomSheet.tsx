import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {View} from 'react-native';
import {SViewStyle, TSeatingForStore} from '../../../../models';
import {scaleFontSize, spacing, style} from '../../../../theme';
import {Button, Text} from '@rneui/themed';
import {TFoodToServing} from '../ServingScreen';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../../assets/lottieAnimation';

type EmpServingBottomSheet = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  data?: TFoodToServing;
  handleConfirm: () => void;
} & Omit<BottomSheetModalProps, 'children'>;

export const EmpServingBottomSheet: React.FC<EmpServingBottomSheet> = ({
  bottomSheetModalRef,
  data,
  handleConfirm,
  ...rest
}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();

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
      //   snapPoints={['50%']}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing
      backgroundStyle={{backgroundColor: colorScheme.background}}
      handleIndicatorStyle={{
        backgroundColor: colorScheme.text,
      }}>
      <BottomSheetView>
        <View style={$modalContent}>
          <View style={style.row_between}>
            <Text>{t('seating.name')}</Text>
            <Text>{data?.seat.seatName}</Text>
          </View>
          <Button
            type="solid"
            title={
              data?.status === 'serve'
                ? t('common.complete')
                : `${t('common.confirm')} ${t('common.cancel')}`
            }
            buttonStyle={$confirmBtn}
            onPress={handleConfirm}>
            <Text style={[{color: colorScheme.textSolid}]}>
              {data?.status === 'serve'
                ? t('common.complete')
                : `${t('common.confirm')} ${t('common.cancel')}`}
            </Text>
            <LottieView
              source={
                data?.status === 'canceling'
                  ? lottieAnmiations.cancel
                  : lottieAnmiations.checkBox
              }
              autoPlay
              style={{width: 30, height: 30, marginLeft: scaleFontSize(12)}}
              resizeMode="cover"
            />
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  //   style.overflow_hidden,
  style.mx_sm,
  style.mb_lg,
];
const $confirmBtn: SViewStyle = [style.mt_md, style.align_center];
