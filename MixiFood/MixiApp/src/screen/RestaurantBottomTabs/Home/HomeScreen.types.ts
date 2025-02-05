import {images} from '../../../../assets';
import {ImageSource} from 'react-native-vector-icons/Icon';

export enum EHomeControlleTabs {
  'pendingPayment' = 'pendingPayment',
  'booking' = 'booking',
  'paymentHistory' = 'paymentHistory',
}

export const HomcontrollerTabs: Record<EHomeControlleTabs, ImageSource> = {
  pendingPayment: images.noun_order,
  booking: images.noun_order,
  paymentHistory: images.noun_order,
};
