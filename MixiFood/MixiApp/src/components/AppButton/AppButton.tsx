import {TOptions} from 'i18next';
import {TxKeyPath} from '../../i18n';
import {appButtonStyles, TAppButtonTypes} from './AppButton.types';
import {STextStyle, SViewStyle} from '../../models';
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../contexts/ThemeContext';
import {Text} from '@rneui/themed';
import {palette, scale, scaleFontSize} from '../../theme';

type TAppButtonProps = {
  txTitle?: TxKeyPath;
  txTitleOptions?: TOptions;
  type?: TAppButtonTypes;
  title?: string;
  titleStyle?: STextStyle;
  activeScale?: number;
} & TouchableOpacityProps;

export const AppButton: React.FC<TAppButtonProps> = props => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const {
    txTitle,
    txTitleOptions,
    type,
    title,
    titleStyle,
    activeScale = 0.97,
    disabled,
    style,
    children,
    ...rest
  } = props;

  const i18nText = txTitle && t(txTitle, txTitleOptions);

  const $disable: SViewStyle = [{backgroundColor: palette.gray8}];

  const $style: SViewStyle = [
    type && appButtonStyles[type],
    type === 'solid' && {backgroundColor: colorScheme.onBackground},
    type === 'outline' && {borderColor: colorScheme.text},
    disabled && $disable,
    style as SViewStyle,
  ];

  const $pressed: SViewStyle = {
    transform: [{scale: activeScale}],
    opacity: 0.5,
  };

  const $root = ({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => {
    return [$style, !!pressed && !disabled && $pressed];
  };

  const $textStyle: STextStyle = [
    type === 'solid' && {color: colorScheme.background},
    {fontSize: scaleFontSize(16)},
    titleStyle,
  ];

  return (
    <Pressable {...rest} style={$root}>
      {title || txTitle ? (
        <Text style={$textStyle}>{txTitle ? i18nText : title}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
