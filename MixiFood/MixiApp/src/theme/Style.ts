// import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
// import {KSpacing, scaleFontSize, spacing} from './Spacing';
// import {KPalette, palette} from './Palette';
// import {KTypography, typography} from './Typography';

// const mapStyleWithSpacing = (
//   prefix: string,
//   styleName: keyof ViewStyle | keyof TextStyle | keyof ImageStyle,
// ): unknown =>
//   Object.fromEntries(
//     Object.entries(spacing).map(key => [
//       `${prefix}_${key[0]}`,
//       {[styleName as string]: key[1]},
//     ]),
//   );

// const mapStyleWithColor = (
//   prefix: string,
//   styleName: keyof ViewStyle | keyof TextStyle | keyof ImageStyle,
// ): unknown =>
//   Object.fromEntries(
//     Object.entries(palette).map(key => [
//       `$${prefix}_${key[0]}`,
//       {[styleName as string]: key[1]},
//     ]),
//   );

// const mapStyleWithTypo = (): unknown =>
//   Object.fromEntries(
//     Object.entries(typography).map(key => [
//       `tx_font_${key[0]}`,
//       {fontFamily: key[1]},
//     ]),
//   );

// export const style = StyleSheet.create({
//   shadow: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   fill_center: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   row_center: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   row_between: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   row_wrap: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   rounded: {borderRadius: 9999},
//   abs: {
//     position: 'absolute',
//   },
//   abs_fo: StyleSheet.absoluteFillObject,
//   overflow_hidden: {
//     overflow: 'hidden',
//   },
//   center: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   align_center: {
//     alignItems: 'center',
//   },
//   align_end: {
//     alignItems: 'flex-end',
//   },
//   justify_center: {
//     justifyContent: 'center',
//   },
//   justify_around: {
//     justifyContent: 'space-around',
//   },
//   justify_between: {
//     justifyContent: 'space-between',
//   },
//   justify_end: {
//     justifyContent: 'flex-end',
//   },
//   self_center: {
//     alignSelf: 'center',
//   },
//   self_start: {
//     alignSelf: 'flex-start',
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   row_reverse: {
//     flexDirection: 'row-reverse',
//   },
//   col: {
//     flexDirection: 'column',
//   },
//   flex_1: {
//     flex: 1,
//   },
//   flex_2: {flex: 2},
//   flex_3: {flex: 3},
//   flex_4: {flex: 4},
//   flex_5: {flex: 5},
//   flex_6: {flex: 6},
//   flex_7: {flex: 7},
//   flex_8: {flex: 8},
//   flex_9: {flex: 9},
//   flex_10: {flex: 10},
//   opacity_05: {opacity: 0.05},
//   opacity_1: {opacity: 0.1},
//   opacity_2: {opacity: 0.2},
//   opacity_3: {opacity: 0.3},
//   opacity_4: {opacity: 0.4},
//   opacity_5: {opacity: 0.5},
//   opacity_6: {opacity: 0.6},
//   opacity_7: {opacity: 0.7},
//   opacity_8: {opacity: 0.8},
//   opacity_9: {opacity: 0.9},
//   opacity_10: {opacity: 1},
//   square: {aspectRatio: 1},
//   bg_transparent: {backgroundColor: palette.transparent},
//   ...(mapStyleWithColor('bg_color', 'backgroundColor') as Record<
//     `bg_color_${KPalette}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('round', 'borderRadius') as Record<
//     `round_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('w', 'width') as Record<`w_${KSpacing}`, ViewStyle>),
//   ...(mapStyleWithSpacing('h', 'height') as Record<`h_${KSpacing}`, ViewStyle>),
//   ...(mapStyleWithColor('tint', 'tintColor') as Record<
//     `tint_${KPalette}`,
//     ImageStyle
//   >),
//   //   Text style
//   tx_shadow: {
//     textShadowColor: 'black',
//     textShadowRadius: 2,
//     textShadowOffset: {width: 0.5, height: 0.5},
//   },
//   tx_center: {textAlign: 'center'},
//   tx_right: {textAlign: 'right'},
//   tx_subtitle: {
//     fontSize: 14,
//     textTransform: 'uppercase',
//     fontFamily: typography.semiBold,
//   },
//   tx_headerTitle: {
//     fontSize: scaleFontSize(16),
//     textTransform: 'uppercase',
//     fontFamily: typography.medium,
//   },
//   tx_sub_header: {
//     fontSize: scaleFontSize(16),
//     fontFamily: typography.medium,
//   },
//   tx_underline: {textDecorationLine: 'underline'},
//   tx_uppercase: {textTransform: 'uppercase'},
//   ...(mapStyleWithColor('tx_color', 'color') as Record<
//     `tx_color_${KPalette}`,
//     TextStyle
//   >),
//   ...(mapStyleWithSpacing('tx_size', 'fontSize') as Record<
//     `tx_size_${KSpacing}`,
//     TextStyle
//   >),
//   ...(mapStyleWithTypo() as Record<`tx_font_${KTypography}`, TextStyle>),
//   //   Magin styles
//   ...(mapStyleWithSpacing('m', 'margin') as Record<`m_${KSpacing}`, ViewStyle>),
//   ...(mapStyleWithSpacing('ml', 'marginLeft') as Record<
//     `ml_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('mr', 'marginRight') as Record<
//     `mr_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('mb', 'marginBottom') as Record<
//     `mb_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('mt', 'marginTop') as Record<
//     `mt_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('mx', 'marginHorizontal') as Record<
//     `mx_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('my', 'marginVertical') as Record<
//     `my_${KSpacing}`,
//     ViewStyle
//   >),
//   // Padding styles
//   ...(mapStyleWithSpacing('p', 'padding') as Record<
//     `p_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('pl', 'paddingLeft') as Record<
//     `pl_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('pr', 'paddingRight') as Record<
//     `pr_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('pb', 'paddingBottom') as Record<
//     `pb_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('pt', 'paddingTop') as Record<
//     `pt_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('px', 'paddingHorizontal') as Record<
//     `px_${KSpacing}`,
//     ViewStyle
//   >),
//   ...(mapStyleWithSpacing('py', 'paddingVertical') as Record<
//     `py_${KSpacing}`,
//     ViewStyle
//   >),
//   // Border styles
//   ...(mapStyleWithColor('border_color', 'borderColor') as Record<
//     `border_color_${KPalette}`,
//     ViewStyle
//   >),
//   // Theme
// });

// /** presets style */
// export const pStyle = {
//     section: [],
//     sectionLabel: [],
// }
import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {KSpacing, scaleFontSize, spacing} from './Spacing';
import {KPalette, palette} from './Palette';
import {KTypography, typography} from './Typography';

const mapStyleWithSpacing = (
  prefix: string,
  styleName: keyof ViewStyle | keyof TextStyle | keyof ImageStyle,
): unknown =>
  Object.fromEntries(
    Object.entries(spacing).map(key => [
      `${prefix}_${key[0]}`,
      {[styleName as string]: key[1]},
    ]),
  );

const mapStyleWithColor = (
  prefix: string,
  styleName: keyof ViewStyle | keyof TextStyle | keyof ImageStyle,
): unknown =>
  Object.fromEntries(
    Object.entries(palette).map(key => [
      `${prefix}_${key[0]}`,
      {[styleName as string]: key[1]},
    ]),
  );

const mapStyleWithTypo = (): unknown =>
  Object.fromEntries(
    Object.entries(typography).map(key => [
      `tx_font_${key[0]}`,
      {fontFamily: key[1]},
    ]),
  );

export const style = StyleSheet.create({
  // View styles
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  fill_center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  row_center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row_wrap: {flexDirection: 'row', flexWrap: 'wrap'},
  rounded: {borderRadius: 9999},
  abs: {position: 'absolute'},
  abs_fo: StyleSheet.absoluteFillObject,
  overflow_hidden: {overflow: 'hidden'},
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  align_center: {
    alignItems: 'center',
  },
  align_end: {
    alignItems: 'flex-end',
  },
  justify_center: {
    justifyContent: 'center',
  },
  justify_around: {
    justifyContent: 'space-around',
  },
  justify_between: {
    justifyContent: 'space-between',
  },
  justify_end: {
    justifyContent: 'flex-end',
  },
  self_center: {
    alignSelf: 'center',
  },
  self_start: {
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  row_reverse: {
    flexDirection: 'row-reverse',
  },
  col: {flexDirection: 'column'},
  flex_1: {flex: 1},
  flex_2: {flex: 2},
  flex_3: {flex: 3},
  flex_4: {flex: 4},
  flex_5: {flex: 5},
  flex_6: {flex: 6},
  flex_7: {flex: 7},
  flex_8: {flex: 8},
  flex_9: {flex: 9},
  flex_10: {flex: 10},
  opacity_05: {opacity: 0.05},
  opacity_1: {opacity: 0.1},
  opacity_2: {opacity: 0.2},
  opacity_3: {opacity: 0.3},
  opacity_4: {opacity: 0.4},
  opacity_5: {opacity: 0.5},
  opacity_6: {opacity: 0.6},
  opacity_7: {opacity: 0.7},
  opacity_8: {opacity: 0.8},
  opacity_9: {opacity: 0.9},
  opacity_10: {opacity: 1},
  square: {aspectRatio: 1},
  bg_transparent: {backgroundColor: palette.transparent},
  ...(mapStyleWithColor('bg_color', 'backgroundColor') as Record<
    `bg_color_${KPalette}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('round', 'borderRadius') as Record<
    `round_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('w', 'width') as Record<`w_${KSpacing}`, ViewStyle>),
  ...(mapStyleWithSpacing('h', 'height') as Record<`h_${KSpacing}`, ViewStyle>),
  ...(mapStyleWithColor('tint', 'tintColor') as Record<
    `tint_${KPalette}`,
    ImageStyle
  >),
  // Text styles
  tx_shadow: {
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: {width: 0.5, height: 0.5},
  },
  tx_center: {textAlign: 'center'},
  tx_right: {textAlign: 'right'},
  tx_subtitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: typography.semiBold,
  },
  tx_headerTitle: {
    fontSize: scaleFontSize(16),
    textTransform: 'uppercase',
    fontFamily: typography.medium,
  },
  tx_sub_header: {
    fontSize: scaleFontSize(16),
    fontFamily: typography.medium,
  },
  tx_underline: {textDecorationLine: 'underline'},
  tx_uppercase: {textTransform: 'uppercase'},
  ...(mapStyleWithColor('tx_color', 'color') as Record<
    `tx_color_${KPalette}`,
    TextStyle
  >),
  ...(mapStyleWithSpacing('tx_size', 'fontSize') as Record<
    `tx_size_${KSpacing}`,
    TextStyle
  >),
  ...(mapStyleWithTypo() as Record<`tx_font_${KTypography}`, TextStyle>),
  // Margin styles
  ...(mapStyleWithSpacing('m', 'margin') as Record<`m_${KSpacing}`, ViewStyle>),
  ...(mapStyleWithSpacing('ml', 'marginLeft') as Record<
    `ml_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('mr', 'marginRight') as Record<
    `mr_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('mb', 'marginBottom') as Record<
    `mb_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('mt', 'marginTop') as Record<
    `mt_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('mx', 'marginHorizontal') as Record<
    `mx_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('my', 'marginVertical') as Record<
    `my_${KSpacing}`,
    ViewStyle
  >),
  // Padding styles
  ...(mapStyleWithSpacing('p', 'padding') as Record<
    `p_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('pl', 'paddingLeft') as Record<
    `pl_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('pr', 'paddingRight') as Record<
    `pr_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('pb', 'paddingBottom') as Record<
    `pb_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('pt', 'paddingTop') as Record<
    `pt_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('px', 'paddingHorizontal') as Record<
    `px_${KSpacing}`,
    ViewStyle
  >),
  ...(mapStyleWithSpacing('py', 'paddingVertical') as Record<
    `py_${KSpacing}`,
    ViewStyle
  >),
  // Border styles
  ...(mapStyleWithColor('border_color', 'borderColor') as Record<
    `border_color_${KPalette}`,
    ViewStyle
  >),
  // Theme
});

/** presets style */
export const pStyle = {
  section: [style.round_md, style.p_md, style.bg_color_gray2],
  sectionLabel: [style.tx_size_sm, style.tx_color_gray9],
};
