import i18n, {LanguageDetectorAsyncModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {storage, StorageKeys} from '../utils/Storage';
import {SupportedLngs} from './i18n.types';
import {vi} from './VI';
import {en} from './EN';

type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const result = storage.getString(StorageKeys.lng) ?? SupportedLngs.en;
    callback(result);
    return result;
  },
  cacheUserLanguage: lng => {
    storage.set(StorageKeys.lng, lng);
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: SupportedLngs.en,
      compatibilityJSON: 'v3',
      resources: {
        [SupportedLngs.vi]: vi,
        [SupportedLngs.en]: en,
      },

      // have a common namespace used around the full app
      ns: ['common'],
      defaultNS: 'common',
      debug: true,
      cache: {enabled: true},
      nsSeparator: '.',
      keySeparator: false,
    });
  // moment.updateLocale("en", {
  //   relativeTime: {
  //     future: "in %s",
  //     past: "%s ago",
  //     s: "1s",
  //     ss: "%ss",
  //     m: "1m",
  //     mm: "%dm",
  //     h: "1h",
  //     hh: "%dh",
  //     d: "1d",
  //     dd: "%dd",
  //     M: "1M",
  //     MM: "%dM",
  //     y: "1Y",
  //     yy: "%dY",
  //   },
  // });
}

export type TxKeyPath = RecursiveKeyOf<typeof en>;
export default i18n;
