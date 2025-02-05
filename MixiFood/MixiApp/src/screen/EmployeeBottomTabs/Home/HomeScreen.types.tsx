import {TxKeyPath} from '../../../i18n';

export enum ESeatingStatus {
  'serving' = 'serving',
  'booking' = 'booking',
  'paying' = 'paying',
  'ready' = 'ready',
}

export type TSeatingStautsFilter = {
  label: ESeatingStatus;
  value: TxKeyPath;
};
