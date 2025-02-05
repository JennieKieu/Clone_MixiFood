import {SViewStyle} from '../../models';
import {spacing, style} from '../../theme';
import {appInputHeight} from '../AppInput';

export type TAppButtonTypes = 'solid' | 'clear' | 'outline';

export const appButtonStyles: Record<TAppButtonTypes, SViewStyle> = {
  clear: [],
  outline: [],
  solid: [{height: appInputHeight, borderRadius: spacing.xs}, style.center, style.px_sm],
};
