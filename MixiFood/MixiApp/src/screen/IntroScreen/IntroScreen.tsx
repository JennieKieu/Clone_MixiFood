import '../../i18n/i18n';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Text, useThemeMode, Button} from '@rneui/themed';
import {useThemeContext} from '../../contexts/ThemeContext';
import {AppStackParamList} from '../../navigators';
import {Layout} from '../../components/Layout/Layout';
import {EThemeOption} from '../../hooks/useTheme';
import {palette, scale, spacing, style} from '../../theme';
import {images} from '../../../assets';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {TIntroCarousel} from './IntroScreen.types';
import {appNavTheme} from '../../theme/Theme';
import {AppInput} from '../../components/AppInput/AppInput';
import {STextStyle} from '../../models/Style';
import {useTranslation} from 'react-i18next';
import {loginApi} from '../../api/loginApi';
import {TAccount} from '../../api/api.types';
import {AxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');
export const IntroScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'IntroScreen'>
> = props => {
  const {toggle, colorScheme, isDarkMode} = useThemeContext();
  const {t} = useTranslation();

  // useEffect(() => {
  //   const test = async () => {
  //     const account: TAccount = {
  //       phoneNumber: '0339122321',
  //       password: '12345678',
  //       userType: EUserType.user,
  //     };
  //     try {
  //       const login = await loginApi.me();
  //       // console.log('data', login);
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         if (error.response) console.log(error.response.data.message);
  //       }
  //     }
  //   };
  //   test();
  // }, []);

  const pageData: TIntroCarousel[] = [
    {
      id: '1',
      title: t('intro.welcome'),
      content: t('intro.message'),
      image: images.IntroCarousel[1],
    },
    {
      id: '2',
      title: t('intro.title1'),
      content: t('intro.message1'),
      image: images.IntroCarousel[2],
    },
    {
      id: '3',
      title: t('intro.title2'),
      content: t('intro.message2'),
      image: images.IntroCarousel[3],
    },
    {
      id: '4',
      title: t('intro.title3'),
      content: t('intro.message3'),
      image: images.IntroCarousel[1],
    },
  ];

  const renderPage = ({item}: any) => {
    return (
      <View
        style={[
          style.w_screenWidth,
          style.py_sm,
          {
            alignItems: 'center',
          },
        ]}>
        <View
          style={[
            // style.w_screenWidth,
            {
              // width: width + 10,
              // width: width + 5,
              // justifyContent: 'center',
              // alignItems: 'center',
            },
          ]}>
          <Text h4 h4Style={$titleText}>
            {item.title}
          </Text>
          <View style={{width: '95%'}}>
            <Text style={$contentText}>{item.content}</Text>
          </View>
        </View>
        <View style={{}}>
          <Image source={item.image} resizeMode="contain"></Image>
        </View>
      </View>
    );
  };

  return (
    <Layout safeAreaOnTop safeAreaOnBottom style={$root}>
      <View style={{height: '60%'}}>
        <Image source={images.introLogo} style={{}}></Image>
        {/* <Text style={[{}]} h4 h4Style={style.tx_font_bold}>
          {t('intro.welcome')}
        </Text> */}
        <View style={{height: '100%'}}>
          <SwiperFlatList
            autoplayDelay={5}
            autoplay
            autoplayLoop
            data={pageData}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            renderItem={renderPage}
            showPagination
            paginationActiveColor={colorScheme.dot}
            paginationDefaultColor="#dfdfdf"
            paginationStyleItem={{width: 10, height: 10}}
          />
        </View>
      </View>
      <View style={$footerItem}>
        <Button
          buttonStyle={$button}
          type="outline"
          size="md"
          title={t('common.login')}
          titleStyle={$buttonText}
          onPress={() => props.navigation.navigate('LoginScreen')}
        />
        <View style={style.my_sm}></View>
        <Button
          type="solid"
          size="md"
          buttonStyle={$button}
          title={t('common.signup')}
          titleStyle={$buttonText}
          // onPress={() =>
          //   toggle(isDarkMode ? EThemeOption.LIGHT : EThemeOption.DARK)
          // }
          onPress={() => props.navigation.navigate('SigUpScreen')}
        />
      </View>
    </Layout>
  );
};

const $root: StyleProp<ViewStyle> = [
  style.flex_1,
  style.align_center,
  style.justify_between,
  // style.px_sm,
];

const $titleText: StyleProp<TextStyle> = [
  style.tx_font_bold,
  style.my_md,
  style.tx_center,
];
const $contentText: StyleProp<TextStyle> = [style.tx_center];
const $buttonText: StyleProp<TextStyle> = [
  style.tx_font_bold,
  // style.tx_size_md,
  {fontSize: scale.x(spacing.lg, spacing.md)},
  // style.tx_center
];
const $footerItem: StyleProp<ViewStyle> = [style.w_screenWidth, style.px_lg];
const $button: StyleProp<ViewStyle> = [
  {
    height: 55,
    borderWidth: 2,
    borderRadius: scale.x(14, 14),
  },
];
