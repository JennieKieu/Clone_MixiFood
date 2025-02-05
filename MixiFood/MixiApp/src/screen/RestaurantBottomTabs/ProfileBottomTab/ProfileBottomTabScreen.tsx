import {Button, Text} from '@rneui/themed';
import {Layout} from '../../../components/Layout/Layout';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models/Style';
import {scale, scaleFontSize, style} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {logOut, selectUserInfo} from '../../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CompositeScreenProps} from '@react-navigation/native';
import {AppRestaurantBottomTabbarParamList} from '../../../navigators/RestaurantBottomTab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, AppUserBottomTabbarParamList} from '../../../navigators';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Image, View} from 'react-native';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {useFetchProfile} from '../../../hooks/Profile';

export const ProfileBottomTabScreen: React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<
      AppRestaurantBottomTabbarParamList | AppUserBottomTabbarParamList,
      'ProfileBottomTabScreen'
    >,
    NativeStackScreenProps<AppStackParamList>
  >
> = ({navigation}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);

  const handleLogout = async () => {
    dispatch(logOut());
    await AsyncStorage.removeItem('token');
    console.log('on logout');
    navigation.navigate('IntroScreen');
  };

  return (
    <Layout style={$root}>
      <View style={$innerContainer}>
        <Button
          type="clear"
          buttonStyle={[$profileBtn, {backgroundColor: colorScheme.default}]}
          onPress={() => navigation.navigate('RestaurantProfileScreen')}>
          <View style={style.row_center}>
            <Image source={{uri: userInfo?.avatar}} style={$avatarImg}></Image>
            <Text style={$profileUserName}>{userInfo?.userName}</Text>
          </View>
          <View>
            <View
              style={[
                $profileIconContainer,
                {backgroundColor: colorScheme.dot},
              ]}>
              <AppImage
                source={images.chevron_down}
                style={[$profileIcon]}></AppImage>
            </View>
          </View>
        </Button>
        <Button
          type="solid"
          title={t('common.setting')}
          buttonStyle={$btn}
          onPress={() => navigation.navigate('AppSettingsStack')}></Button>
        <Button
          type="solid"
          title={t('common.logout')}
          onPress={handleLogout}
          buttonStyle={$btn}></Button>
      </View>
    </Layout>
  );
};

const $root: SViewStyle = [style.flex_1];
const $btn: SViewStyle = [style.mb_sm];
const $innerContainer: SViewStyle = [style.mx_sm];
const $profileBtn: SViewStyle = [
  style.row_between,
  {height: scale.y(60, 60 * 1.5)},
  style.mb_sm,
];
const $profileIcon: SImageStyle = [
  {
    width: scale.x(20, 20 * 1.5),
    height: scale.y(20, 20 * 1.5),
    resizeMode: 'contain',
  },
];
const $profileUserName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(16)},
];
const $avatarImg: SImageStyle = [
  {
    resizeMode: 'cover',
    width: scale.x(40, 40 * 1.5),
    height: scale.y(40, 40 * 1.5),
    borderRadius: 999,
    marginRight: scale.y(12, 12 * 1.5),
  },
  style.overflow_hidden,
];
const $profileIconContainer: SViewStyle = [
  {borderRadius: 999, padding: scale.x(4, 4 * 1.5)},
  style.center,
];
