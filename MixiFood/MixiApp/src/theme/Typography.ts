import {Platform} from 'react-native';

const getTypography = () => ({
  bold: 'IBMPlexMono-Bold',
  boldItalic: 'IBMPlexMono-BoldItalic',
  extraLight: 'IBMPlexMono-ExtraLight',
  extraLightItalic: 'IBMPlexMono-ExtraLightItalic',
  italic: 'IBMPlexMono-Italic',
  light: 'IBMPlexMono-Light',
  medium: 'IBMPlexMono-Medium',
  mediumItalic: 'IBMPlexMono-MediumItalic',
  regular: 'IBMPlexMono-Regular',
  semiBold: 'IBMPlexMono-SemiBold',
  thin: 'IBMPlexMono-Thin',
  thinItalic: 'IBMPlexMono-ThinItalic',
});

export const typography = getTypography();
export type KTypography = keyof typeof typography;
