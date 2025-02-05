import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppImage} from '../components/AppImage';
import {HomeScreen} from '../screen/UserBottom/HomeScreen';
import {NearYouScreen} from '../screen/UserBottom/NearYouScreen';
import {MessagesScreen} from '../screen/UserBottom/MessagesScreen';
import {PostsScreen} from '../screen/UserBottom/PostScreen';
import {MenuScreen} from '../screen/UserBottom/MenuScreen';
import {images} from '../../assets';
import {StyleProp} from 'react-native';
import {palette, spacing, style} from '../theme';
import {useThemeMode} from '@rneui/themed';
import {useThemeContext} from '../contexts/ThemeContext';
import {useAppSelector} from '../hooks';
import {selectUserInfo} from '../store';
import {ProfileBottomTabScreen} from '../screen/RestaurantBottomTabs/ProfileBottomTab';

export type AppUserBottomTabbarParamList = {
  Home: undefined;
  NearYou: undefined;
  Messages: undefined;
  Posts: undefined;
  // Menu: undefined;
  ProfileBottomTabScreen: undefined;
};

const BottomTabbar = createBottomTabNavigator<AppUserBottomTabbarParamList>();

export const AppUserBottomTabbar = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {mode} = useThemeMode();
  const {colorScheme} = useThemeContext();
  const user = useAppSelector(selectUserInfo);

  const renderImage = (props: {
    focused: boolean;
    color: string;
    size: number;
    screen: keyof AppUserBottomTabbarParamList;
  }) => {
    const icons = {
      Home: props.focused ? images.home_active : images.home,
      NearYou: props.focused ? images.near_you_active : images.near_you,
      Messages: props.focused
        ? images.messages_active
        : images.facebook_message,
      Posts: props.focused ? images.post_active : images.post,
      ProfileBottomTabScreen: props.focused ? images.menu_active : images.menu,
    };

    return (
      <AppImage
        style={{width: props.size, height: props.size, resizeMode: 'contain'}}
        source={icons[props.screen]}
      />
    );
  };

  return (
    <BottomTabbar.Navigator
      screenOptions={{
        // tabBarActiveTintColor: palette.primary5,
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: mode === 'light' ? palette.white : palette.black,
          // paddingBottom: insets.bottom || spacing.xs,
          borderTopWidth: 1,
          borderBlockColor: palette.gray5,
        },
        headerStyle: {
          backgroundColor: colorScheme.background,
        },
        tabBarActiveTintColor: colorScheme.text,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: [style.mt_xs],
        headerTintColor: mode === 'light' ? palette.black : palette.white,
        headerShadowVisible: false,
      }}>
      <BottomTabbar.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('appBottomTabbar.user.Home'),
          tabBarIcon: props => renderImage({...props, screen: 'Home'}),
          headerShown: false,
        }}
      />
      <BottomTabbar.Screen
        name="NearYou"
        component={NearYouScreen}
        options={{
          tabBarLabel: t('appBottomTabbar.user.NearYou'),
          tabBarIcon: props => renderImage({...props, screen: 'NearYou'}),
          headerShown: false,
          tabBarHideOnKeyboard: false,
        }}
      />
      <BottomTabbar.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: t('appBottomTabbar.user.Messages'),
          tabBarIcon: props => renderImage({...props, screen: 'Messages'}),
        }}
      />
      <BottomTabbar.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarLabel: t('appBottomTabbar.user.Posts'),
          tabBarIcon: props => renderImage({...props, screen: 'Posts'}),
        }}
      />
      <BottomTabbar.Screen
        name="ProfileBottomTabScreen"
        component={ProfileBottomTabScreen}
        options={{
          tabBarLabel: t('appBottomTabbar.user.Menu'),
          tabBarIcon: props =>
            renderImage({...props, screen: 'ProfileBottomTabScreen'}),
        }}
      />
    </BottomTabbar.Navigator>
  );
};
