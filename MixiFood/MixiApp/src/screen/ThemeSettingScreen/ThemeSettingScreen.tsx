import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Layout} from '../../components/Layout/Layout';
import {scale, style} from '../../theme';
import {useThemeContext} from '../../contexts/ThemeContext';
import {SViewStyle} from '../../models/Style';
import {Button, Text} from '@rneui/themed';
import {EThemeOption, useAppDispatch, useAppSelector} from '../../hooks';
import {selectThemeSetting, setTheme} from '../../store';
import {useTranslation} from 'react-i18next';
import {AppSettingScreenProps} from '../../navigators';
import {useLayoutEffect} from 'react';
import {AppImage} from '../../components/AppImage';
import {images} from '../../../assets';

export const ThemeSettingScreen: React.FC<
  AppSettingScreenProps<'ThemeSettingScreen'>
> = props => {
  const {t} = useTranslation();
  const {colorScheme, toggle, isDarkMode} = useThemeContext();
  const dispatch = useAppDispatch();
  const themeSetting = useAppSelector(selectThemeSetting);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity>
          <AppImage source={images.angle_left}></AppImage>
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleChangeTheme = (input: EThemeOption) => {
    dispatch(setTheme(input));
    toggle(input);
    const ind = setInterval(() => {
      props.navigation.navigate('AppBottomTabbar');
      return clearInterval(ind);
    }, 500);
  };

  return (
    <Layout style={$root} safeAreaOnTop>
      <View style={$innerContainer}>
        <ScrollView>
          <Button
            type={themeSetting === EThemeOption.DEVICE ? 'solid' : 'outline'}
            buttonStyle={$btn}
            onPress={() => handleChangeTheme(EThemeOption.DEVICE)}
            title={
              'Use device setting \nUpon activation. Day or Night mode will be followed by device setting'
            }
            titleStyle={{textAlign: 'left'}}>
            {/* <Text style={{width: '100%'}}>Use device setting</Text>
            <Text>
              Upon activation. Day or Night mode will be followed by device
              setting
            </Text> */}
          </Button>
          <Button
            type={themeSetting === EThemeOption.LIGHT ? 'solid' : 'outline'}
            onPress={() => handleChangeTheme(EThemeOption.LIGHT)}
            buttonStyle={$btn}
            title={'Light'}
            titleStyle={{textAlign: 'left'}}></Button>
          <Button
            type={themeSetting === EThemeOption.DARK ? 'solid' : 'outline'}
            buttonStyle={$btn}
            onPress={() => handleChangeTheme(EThemeOption.DARK)}
            title={'Dark'}>
            {/* <Text>Dark</Text> */}
          </Button>
        </ScrollView>
      </View>
    </Layout>
  );
};

const $root: SViewStyle = [style.flex_1];
const $innerContainer: SViewStyle = [style.mx_sm, style.mt_sm];
const $btn: SViewStyle = [
  {flexDirection: 'column', height: scale.y(60, 60 * 1.5), borderWidth: 2},
  style.mb_md,
];
