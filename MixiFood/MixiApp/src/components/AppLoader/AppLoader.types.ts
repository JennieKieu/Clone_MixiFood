import {ActivityIndicatorProps, ViewStyle} from 'react-native';

export enum ELoaderType {
  'default',
  'animation1',
  'foodLoader1',
  'orderLoader1',
  'invoiceLoader',
  'locationloader',
}

export type TLoaderContentProps = {
  visible: boolean;
  useAnimated?: boolean;
  loaderColor?: ActivityIndicatorProps['color'];
  renderLoader?: (props: TLoaderContentProps) => React.ReactNode;
  backdropColor?: ViewStyle['backgroundColor'];
  backdropOpacity?: ViewStyle['opacity'];
  activityLoaderProps?: ActivityIndicatorProps;
  loaderBackdropColor?: ViewStyle['backgroundColor'];
  loaderBackdropOpacity?: ViewStyle['opacity'];
  loaderType?: ELoaderType;
};
