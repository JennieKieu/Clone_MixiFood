// import React from 'react';
// import {ThemeSpacing, useTheme} from '@rneui/themed';
// import {
//   ColorValue,
//   StyleProp,
//   StyleSheet,
//   View,
//   ViewProps,
//   ViewStyle,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {useThemeContext} from 'contexts/ThemeContext';
// import {spacing} from 'components/theme';

// type LayoutProps = {
//   padding?: keyof ThemeSpacing;
//   paddingX?: keyof ThemeSpacing;
//   paddingY?: keyof ThemeSpacing;
//   safeAreaOnTop?: boolean;
//   safeAreaOnBottom?: boolean;
//   backgroundColor?: ColorValue;
//   nonFill?: boolean;
// } & ViewProps &
//   React.PropsWithChildren;

// export const Layout: React.FC<LayoutProps> = props => {
//   const {colorScheme} = useThemeContext();
//   const {theme} = useTheme();
//   console.log(colorScheme.background);
//   const insets = useSafeAreaInsets();
//   const {
//     nonFill,
//     style: overriedStyle,
//     backgroundColor,
//     padding,
//     paddingX,
//     paddingY,
//     safeAreaOnTop,
//     safeAreaOnBottom,
//   } = props;

//   const $style: StyleProp<ViewStyle> = StyleSheet.flatten([
//     !nonFill ? $root : undefined,
//     overriedStyle,
//     {backgroundColor: backgroundColor || colorScheme.background},
//     padding !== undefined && {padding: theme.spacing[padding]},
//     paddingX !== undefined && {paddingHorizontal: theme.spacing[paddingX]},
//     paddingY !== undefined && {paddingVertical: theme.spacing[paddingY]},
//     safeAreaOnTop && {paddingTop: insets.top},
//     safeAreaOnBottom && {paddingBottom: insets.bottom || spacing.md},
//   ]);

//   return <View style={$style}></View>;
// };

// const $root: StyleProp<ViewStyle> = {
//   flex: 1,
// };

import React from 'react';
import {ThemeSpacing, useTheme} from '@rneui/themed';
import {
  ColorValue,
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {spacing} from '../../theme';
import {useThemeContext} from '../../contexts/ThemeContext';

type LayoutProps = {
  padding?: keyof ThemeSpacing;
  paddingX?: keyof ThemeSpacing;
  paddingY?: keyof ThemeSpacing;
  safeAreaOnTop?: boolean;
  safeAreaOnBottom?: boolean;
  backgroundColor?: ColorValue;
  nonFill?: boolean;
} & ViewProps &
  React.PropsWithChildren;

export const Layout: React.FC<LayoutProps> = props => {
  const {colorScheme} = useThemeContext();
  const {theme} = useTheme();

  const insets = useSafeAreaInsets();
  const {
    children,
    style: overriedStyle,
    padding,
    paddingX,
    paddingY,
    safeAreaOnTop,
    safeAreaOnBottom,
    backgroundColor,
    nonFill,
  } = props;

  const $style: StyleProp<ViewStyle> = StyleSheet.flatten([
    !nonFill ? $root : undefined,
    overriedStyle,
    {backgroundColor: backgroundColor || colorScheme.background},
    padding !== undefined && {padding: theme.spacing[padding]},
    paddingX !== undefined && {paddingHorizontal: theme.spacing[paddingX]},
    paddingY !== undefined && {paddingVertical: theme.spacing[paddingY]},
    safeAreaOnTop && {paddingTop: insets.top},
    safeAreaOnBottom && {paddingBottom: insets.bottom || spacing.md},
  ]);

  return <View style={$style}>{children}</View>;
};

const $root: StyleProp<ViewStyle> = {
  flex: 1,
};
