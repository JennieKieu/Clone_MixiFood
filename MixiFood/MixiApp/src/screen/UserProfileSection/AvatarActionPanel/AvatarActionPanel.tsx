import {Text, useTheme} from '@rneui/themed';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useRef} from 'react';
import {ImageSourcePropType, Pressable, View} from 'react-native';
import {lottieAnmiations} from '../../../../assets/lottieAnimation';
import {images} from '../../../../assets';
import {TxKeyPath} from '../../../i18n';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {STextStyle, SViewStyle} from '../../../models';
import {scale, scaleFontSize, style} from '../../../theme';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';

export type AvatarActionType =
  | 'viewAvatar'
  | 'editAvatar'
  | 'viewCoverImage'
  | 'editCoverImage';

type AvatarActionPanelProps = {
  onpress: (actionType: AvatarActionType) => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  renderAction: AvatarActionType[];
} & Omit<BottomSheetModalProps, 'children'>;

export const AvatarActionPanel: React.FC<AvatarActionPanelProps> = props => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {colorScheme} = useThemeContext();

  const actionTypes = useRef<AvatarActionType[]>([
    'viewAvatar',
    'editAvatar',
    'editCoverImage',
    'viewCoverImage',
  ]).current;
  const renderAction = (type: AvatarActionType): React.ReactNode => {
    const iconNames: Record<AvatarActionType, string> = {
      editAvatar: lottieAnmiations.edit1,
      editCoverImage: lottieAnmiations.edit1,
      viewAvatar: lottieAnmiations.avatar,
      viewCoverImage: lottieAnmiations.avatar,
    };

    const actionName: Record<AvatarActionType, TxKeyPath> = {
      editAvatar: t('ProfileScreen.avatarBottom.editAvatar'),
      editCoverImage: t('ProfileScreen.avatarBottom.editCover'),
      viewAvatar: t('ProfileScreen.avatarBottom.viewAvatar'),
      viewCoverImage: t('ProfileScreen.avatarBottom.viewCover'),
    };

    return (
      <TouchableOpacity style={$optionBtn}>
        <LottieView
          source={iconNames[type]}
          autoPlay
          style={$icon}></LottieView>
        <View style={$section}>
          <Text style={$optionBtnText}>{actionName[type]}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetModal
      ref={props.bottomSheetModalRef}
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
      //   snapPoints={['50%']}
      backgroundStyle={{backgroundColor: colorScheme.background}}
      handleIndicatorStyle={{backgroundColor: colorScheme.text}}>
      <BottomSheetView>
        <View style={style.pt_sm}>{props.renderAction.map(renderAction)}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

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
  {fontSize: scaleFontSize(16, 16 * 1.5), paddingBottom: 4},
  style.tx_font_bold,
];
