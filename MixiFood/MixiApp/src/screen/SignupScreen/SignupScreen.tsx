import {
  Image,
  StyleProp,
  View,
  ViewStyle,
  TextStyle,
  Pressable,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import {Layout} from '../../components/Layout/Layout';
import {palette, scale, style} from '../../theme';
import {images} from '../../../assets';
import {AppInput} from '../../components/AppInput/AppInput';
import {appTheme} from '../../theme/Theme';
import {Text, useThemeMode, Button} from '@rneui/themed';
import {TextInput} from 'react-native-gesture-handler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../navigators';
import {STextStyle, SViewStyle} from '../../models/Style';
import {useTranslation} from 'react-i18next';
import {act, useMemo, useRef, useState} from 'react';
import {TUserTabProps, UserTab} from './UserTab';
import {ESignupTabs} from './SignupScreen.types';
import {
  RestaurantTab,
  TRestaurantTabProps,
} from './RestaurantTab/RestaurantTab';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {Validators} from '../../utils/Validate';
import {delay} from '../../utils';
import {TRegisterUser} from '../../api/api.types';
import {useAppDispatch} from '../../hooks';
import {EUserType, login, setUserType} from '../../store';

const {width} = Dimensions.get('window');
export const SignUpScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'SigUpScreen'>
> = props => {
  const {t} = useTranslation();
  const flatlistRef = useRef<FlatList>(null);
  const {mode} = useThemeMode();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<ESignupTabs>(ESignupTabs.user);
  const onDismisKeyboard = useMemo(() => {
    return Keyboard.isVisible() && Keyboard.dismiss();
  }, [activeTab]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [formikValid, setFormikValid] = useState<boolean>(false);

  // const formik = useFormik<TRegisterUser>({
  //   initialValues: {
  //     fullName: __DEV__ ? 'nhennhenNoWayHome' : '',
  //     phoneNumber: __DEV__ ? '12345678' : '',
  //     email: __DEV__ ? '' : '',
  //     password: __DEV__ ? '12345678' : '',
  //     confirmPassword: __DEV__ ? '12345678' : '',
  //   },
  //   validationSchema: yup.object().shape({
  //     email: Validators.email(t),
  //   }),
  //   onSubmit: async ({email}, helpers) => {
  //     try {
  //       await delay(350);
  //     } catch (error) {
  //       console.log(error);
  //       // helpers.setFieldError('input ?', errorMsg.incorrect("input."));
  //     }
  //   },
  //   validateOnMount: true,
  // });

  const handleNextPress = async (phoneNumber: string) => {
    console.log('nex');
    dispatch(
      setUserType(
        activeTab === ESignupTabs.user ? EUserType.user : EUserType.restaurant,
      ),
    );
    props.navigation.navigate('SmsVerifyScreen', {
      phoneNumber: phoneNumber,
      userType:
        activeTab === ESignupTabs.user ? EUserType.user : EUserType.restaurant,
    });
  };

  // const tabData = [
  //   {
  //     key: ESignupTabs.user,
  //     title: t('common.user'),
  //     component: (props: TUserTabProps) => (
  //       <UserTab handleNextPress={handleNextPress} />
  //     ),
  //   },
  //   {
  //     key: ESignupTabs.restaurant,
  //     title: t('common.restaurant'),
  //     component: RestaurantTab,
  //   },
  // ];

  const tabData = useMemo(
    () => [
      {
        key: ESignupTabs.user,
        title: t('common.user'),
        component: (props: TUserTabProps) => (
          <UserTab
            handleNextPress={(phoneNumber: string) =>
              handleNextPress(phoneNumber)
            }
          />
        ),
      },
      {
        key: ESignupTabs.restaurant,
        title: t('common.restaurant'),
        component: (props: TRestaurantTabProps) => (
          <RestaurantTab
            handleNextPress={(phoneNumber: string) =>
              handleNextPress(phoneNumber)
            }
          />
        ),
      },
    ],
    [activeTab],
  );

  const onTabPress = (tab: ESignupTabs) => {
    Keyboard.dismiss();
    if (tab !== activeTab) {
      setActiveTab(tab);
      flatlistRef.current?.scrollToIndex({index: tab});
    }
  };

  const tabIndicatorPosition = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [17, 110],
    extrapolate: 'clamp',
  });

  const tabIndicatorWidth = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: ['16%', '35%'],
    extrapolate: 'clamp',
  });

  const renderItem = ({item}: any) => (
    <View style={$tabContainer}>
      <item.component setFormikValid={setFormikValid}></item.component>
    </View>
  );

  console.log(formikValid);

  return (
    <Layout style={$root} safeAreaOnBottom safeAreaOnTop>
      <View style={$tabHeader}>
        <Button type="clear" onPress={() => onTabPress(ESignupTabs.user)}>
          <Text
            h4
            h4Style={[activeTab !== ESignupTabs.user && $buttonTextBlur]}>
            {t('common.user')}
          </Text>
        </Button>
        <Button type="clear" onPress={() => onTabPress(ESignupTabs.restaurant)}>
          <Text
            h4
            h4Style={[activeTab !== ESignupTabs.restaurant && $buttonTextBlur]}>
            {t('common.restaurant')}
          </Text>
        </Button>
        <Animated.View
          style={[
            $tabIndicator,
            {
              width: tabIndicatorWidth,
              transform: [{translateX: tabIndicatorPosition}],
              backgroundColor: mode === 'light' ? palette.black : palette.white,
            },
          ]}></Animated.View>
      </View>
      <FlatList
        ref={flatlistRef}
        scrollEnabled={Keyboard.isVisible() ? false : true}
        data={tabData}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          const selectedTab = tabData[index]?.key;
          setActiveTab(selectedTab);
        }}></FlatList>
      {/* <View style={$footerItem}>
        <Button
          type="solid"
          buttonStyle={$button}
          title={t('common.next')}
          titleStyle={$buttonText}
          disabled={formikValid}
          onPress={() => props.navigation.navigate('SmsVerifyScreen')}></Button>
      </View> */}
    </Layout>
  );
};

const $root: StyleProp<ViewStyle> = [
  style.flex_1,
  style.align_center,
  style.justify_between,
];

const $innerContainer: StyleProp<ViewStyle> = [style.align_center];

const $tabHeader: SViewStyle = [style.row, style.align_center];
const $tabContainer: SViewStyle = [];
const $footerItem: StyleProp<ViewStyle> = [style.w_screenWidth, style.px_lg];
const $button: SViewStyle = [
  {height: scale.y(45, 90), borderRadius: scale.x(10, 20)},
];
const $buttonText: StyleProp<TextStyle> = [
  style.tx_font_bold,
  style.tx_size_lg,
];
const $buttonTextBlur: SViewStyle = [{opacity: 0.6}];
const $tabIndicator: SViewStyle = [
  {height: 2, bottom: -4, left: 0},
  style.abs,
  {width: '22%'},
  // style.w_screenHeight
];
