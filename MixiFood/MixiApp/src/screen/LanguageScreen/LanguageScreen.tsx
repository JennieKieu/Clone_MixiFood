import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {SupportedLngs} from '../../i18n/i18n.types';
import {SViewStyle} from '../../models/Style';
import {scale, style} from '../../theme';
import {Text} from '@rneui/themed';

export const LanguageScreen: React.FC = () => {
  const {i18n} = useTranslation();

  const changeLanguage = (supportedLngs: SupportedLngs) => {
    i18n.changeLanguage(supportedLngs);
  };

  return (
    <View style={$root}>
      <Text>Current: {i18n.language}</Text>

      <TouchableOpacity
        style={$btn}
        onPress={() => changeLanguage(SupportedLngs.vi)}>
        <Text>{SupportedLngs.vi}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={$btn}
        onPress={() => changeLanguage(SupportedLngs.vi)}>
        <Text>{SupportedLngs.vi}</Text>
      </TouchableOpacity>
    </View>
  );
};

const $root: SViewStyle = [style.flex_1];
const $btn: SViewStyle = [
  {height: scale.y(36, 36 * 1.5)},
  style.center,
  style.mt_sm,
];
