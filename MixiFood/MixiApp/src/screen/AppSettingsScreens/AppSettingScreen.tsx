import {View} from 'react-native';
import {Layout} from '../../components/Layout/Layout';
import {SViewStyle} from '../../models/Style';
import {style} from '../../theme';
import {Button, Divider, ListItem, Text, useTheme} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {AppSettingScreenProps} from '../../navigators';
import AppDropdown from '../../components/AppDropDown/AppDropdown';
import {SupportedLngs} from '../../i18n/i18n.types';
import {TLangague} from '../../models/Language';

export const AppSettingsScreen: React.FC<
  AppSettingScreenProps<'AppSettingsScreen'>
> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme} = useTheme();

  const languages = [
    {code: SupportedLngs.en, name: 'English'},
    {code: SupportedLngs.vi, name: 'Vietnamese'},
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Layout style={$root} safeAreaOnTop safeAreaOnBottom>
      <View style={$innerContainer}>
        <Button
          type="solid"
          title={t('appSettings.theme.title')}
          buttonStyle={$btn}
          onPress={() => navigation.navigate('ThemeSettingScreen')}></Button>
        <Button
          type="solid"
          title={t('appSettings.language.title')}
          buttonStyle={$btn}></Button>

        <Divider style={style.my_md} color={theme.colors.background} />
        <AppDropdown<TLangague>
          data={languages}
          onValueChange={item => handleLanguageChange(item.code)}
          renderItem={item => (
            <ListItem disabled containerStyle={style.p_sm}>
              <ListItem.Content>
                <ListItem.Title> {item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}>
          {/* <Button type="solid" buttonStyle={$btn}>
            <Text>{t('appSettings.language.title')}</Text>
          </Button> */}
          <View style={$btn}>
            <Text>{t('appSettings.language.title')}</Text>
          </View>
        </AppDropdown>
      </View>
    </Layout>
  );
};

const $root: SViewStyle = [style.flex_1];
const $innerContainer: SViewStyle = [style.mx_sm, style.mt_md];
const $btn: SViewStyle = [style.mb_sm];
