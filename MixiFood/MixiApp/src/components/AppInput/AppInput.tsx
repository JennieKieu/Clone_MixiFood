import {isIOS} from '@rneui/base';
import {Text, ThemeConsumer} from '@rneui/themed';
import React from 'react';
import {
  Pressable,
  View,
  StyleProp,
  TextInput,
  TextInputProps,
  ImageSourcePropType,
  Image,
  ImageStyle,
  PressableProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {palette, scale, scaleFontSize, style, typography} from '../../theme';
import {images} from '../../../assets';
import {hexToRgbA} from '../../utils/Color';
import {STextStyle, SViewStyle} from '../../models/Style';
import {
  EAppInputBackground,
  EAppInputBorderWidth,
  EAppInputHeight,
} from './AppInput.types';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {BottomSheetTextInputProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';
import {TextInput as TextInputB} from 'react-native-gesture-handler';

export const appInputHeight = scale.y(38, 64);

type AppInputProps = {
  rightIconImageSource?: ImageSourcePropType;
  lefttIconImageSource?: ImageSourcePropType;
  errorMessage?: string;
  rightIconPressableProps?: PressableProps;
  leftIconPressableProps?: PressableProps;
  label?: string;
  height?: EAppInputHeight;
  containerBorderWidth?: EAppInputBorderWidth;
  borderRadius?: number;
  backgroundColor?: EAppInputBackground;
  isBottomSheetTextInput?: boolean;
} & TextInputProps;

export class AppInput extends React.Component<
  AppInputProps,
  {isFocusing: boolean; secureTextEntry: boolean}
> {
  private inputRef: React.RefObject<TextInput>;
  private inputRefBT: React.RefObject<TextInputB>;

  constructor(props: AppInputProps) {
    super(props);
    this.state = {
      isFocusing: false,
      secureTextEntry: this.props.secureTextEntry || false,
    };
    this.inputRef = React.createRef<TextInput>();
    this.inputRefBT = React.createRef<TextInputB>();
  }

  get isMaskHidden(): boolean {
    return this.state.isFocusing || Boolean(this.props.value);
  }

  focus() {
    this.inputRef.current?.focus();
  }

  blur() {
    this.inputRef.current?.blur();
  }

  private get _rightIconImageSource() {
    return this.props.secureTextEntry
      ? this.state.secureTextEntry
        ? images.eye_closed
        : images.eye
      : this.props.rightIconImageSource;
  }

  private get _leftIconImageSource() {
    return this.props.lefttIconImageSource;
  }

  private get _height() {
    let height: number | undefined;
    switch (this.props.height) {
      case EAppInputHeight.MEDIUM:
        return 50;
      case EAppInputHeight.LARGE:
        height = 60;
        break;
      default:
        break;
    }
    return height;
  }

  private get _fontSize() {
    // tablet ??
    let fontSize: number | undefined;
    switch (this.props.height) {
      case EAppInputHeight.MEDIUM:
        fontSize = 16;
        break;
      case EAppInputHeight.LARGE:
        fontSize = 18;
        break;
      default:
        break;
    }
    return fontSize;
  }

  private _handleRightIconPressed() {
    if (this.props.secureTextEntry) {
      this.setState(prev => ({
        ...prev,
        secureTextEntry: !prev.secureTextEntry,
      }));
    } else {
      this.props.rightIconPressableProps?.onPress?.(undefined as any);
    }
  }

  private _handleFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    this.setState({isFocusing: true});
    this.props.onFocus?.(e);
  }

  private _handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    this.setState({isFocusing: false});
    this.props.onBlur?.(e);
  }

  render(): React.ReactNode {
    const height =
      this._height || appInputHeight * (this.props.multiline ? 1.3 : 1);

    const $multilineStyle: ViewStyle | undefined = this.props.multiline
      ? {
          paddingTop: isIOS ? height * 0.2 : 0,
          marginTop: isIOS ? 0 : height * 0.1,
        }
      : undefined;

    const fonSize = scaleFontSize(this._fontSize || 13);

    const Root =
      this.props.isBottomSheetTextInput && Platform.OS !== 'android'
        ? BottomSheetTextInput
        : TextInput;

    return (
      <ThemeConsumer>
        {({theme}) => {
          const placeholderColor = hexToRgbA(
            theme.mode == 'light' ? theme.colors.grey1 : theme.colors.white,
            0.4,
          );
          const borderColor =
            theme.mode === 'light' ? theme.colors.black : palette.white;

          const backgroundColor =
            theme.mode === 'light' ? palette.gray3 : palette.transparent;

          return (
            <>
              <Text style={$label}>{this.props.label}</Text>
              <Pressable
                style={[
                  $root,
                  {
                    backgroundColor:
                      this.props.backgroundColor && backgroundColor,
                    borderRadius: this.props.borderRadius || scale.x(8, 16),
                    height,
                    borderColor: this.props.errorMessage
                      ? palette.primary6
                      : borderColor,
                    borderWidth: this.props.containerBorderWidth || 1,
                  },
                ]}
                onPress={() => this.focus()}>
                {this._leftIconImageSource !== undefined && (
                  <View style={$iconViewContainer}>
                    <Image
                      resizeMode="contain"
                      source={this._leftIconImageSource}
                      style={$inputIcon}
                      tintColor={
                        theme.mode === 'light' ? palette.black : palette.white
                      }></Image>
                  </View>
                )}
                <Root
                  {...this.props}
                  ref={this.inputRefBT || this.inputRef}
                  value={this.props.value}
                  onChangeText={this.props.onChangeText}
                  style={[
                    $inputStyle,
                    $multilineStyle,
                    {
                      fontSize: fonSize,
                      color:
                        this.props.editable === false
                          ? placeholderColor
                          : theme.colors.black,
                    },
                    {
                      borderColor: 'red',
                    },
                  ]}
                  onFocus={e => this._handleFocus(e)}
                  onBlur={e => this._handleBlur(e)}
                  secureTextEntry={this.state.secureTextEntry}
                  placeholderTextColor={placeholderColor}
                />
                {this._rightIconImageSource !== undefined ? (
                  <Pressable
                    {...this.props.rightIconPressableProps}
                    style={$iconContainer}
                    onPress={() => this._handleRightIconPressed()}>
                    <Image
                      source={this._rightIconImageSource}
                      style={$inputIcon}
                      tintColor={
                        theme.mode === 'dark' ? palette.white : palette.black
                      }
                    />
                  </Pressable>
                ) : (
                  <View style={style.mr_md} />
                )}
              </Pressable>
              {this.props.errorMessage ? (
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={{width: '100%'}}>
                  <Text style={$errorText}>{this.props.errorMessage}</Text>
                </Animated.View>
              ) : undefined}
            </>
          );
        }}
      </ThemeConsumer>
    );
  }
}

const $root: SViewStyle = [
  {
    borderWidth: 1,
    // borderColor: palette.gray12,
    // borderRadius: scale.x(8, 16),
  },
  style.row,
  style.overflow_hidden,
];
const $inputStyle: STextStyle = [
  {
    fontSize: scaleFontSize(13),
    fontFamily: typography.regular,
  },
  style.flex_1,
  style.pl_xs,
];
const $label: STextStyle = [
  {fontSize: scaleFontSize(10), color: palette.gray12},
  style.mb_xxxs,
];
const $iconContainer: PressableProps['style'] = state => [
  style.px_sm,
  style.center,
  {transform: [{scale: state.pressed ? 0.9 : 1}]},
];
const $inputIcon: StyleProp<ImageStyle> = [
  {width: scale.x(24, 32), height: scale.x(24, 24)},
];
const $errorText: STextStyle = [
  style.tx_color_primary6,
  style.ml_xs,
  style.mt_xs,
  {textAlign: 'left'},
];

const $iconViewContainer: StyleProp<ViewStyle> = [style.center, style.pl_sm];
