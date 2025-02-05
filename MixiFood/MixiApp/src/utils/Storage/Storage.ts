import {MMKV} from 'react-native-mmkv';
import {Keychain} from '../../services';

export const storage = new MMKV({
  id: 'MIXIFOOD',
});

export const secureStorage = new Keychain();
