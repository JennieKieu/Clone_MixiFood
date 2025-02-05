import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {AppImage} from '../components/AppImage';
import {images} from '../../assets';
import {SeatingScreen} from '../screen/RestaurantBottomTabs/Seating';
import {STextStyle} from '../models';
import {palette, style} from '../theme';
import {ProfileBottomTabScreen} from '../screen/RestaurantBottomTabs/ProfileBottomTab';
import {ERestaurantRole} from '../api/api.types';
import {useAppSelector} from '../hooks';
import {selectRestaurantRole, selectUserInfo} from '../store';
import {useThemeContext} from '../contexts/ThemeContext';
import {useTheme, useThemeMode} from '@rneui/themed';
import {HomeScreen} from '../screen/EmployeeBottomTabs/Home';
import {useFetchSeating} from '../hooks/Seating';
import {KitchenScreen} from '../screen/EmployeeBottomTabs/KitchenScreen';
import {ServingScreen} from '../screen/EmployeeBottomTabs/ServingScreen';
import {useFetchFoods} from '../hooks/Food';
import {useFetchOrder} from '../hooks/Ordes';

export type AppEmployeeBottomTabbarParamList = {
  Home: undefined;
  KitchenScreen: undefined;
  ServingScreen: undefined;
  ProfileBottomTabScreen: undefined;
};

const BottomTabbar =
  createBottomTabNavigator<AppEmployeeBottomTabbarParamList>();

export const AppEmployeeBottomTabbar = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const {colorScheme} = useThemeContext();
  const employeeRole = useAppSelector(selectRestaurantRole);

  useFetchFoods([], true);
  useFetchSeating([], true);
  useFetchOrder([], true);
  // useFetchSeating([], true);

  const renderImage = (props: {
    focused: boolean;
    color: string;
    size: number;
    screen: keyof AppEmployeeBottomTabbarParamList;
  }) => {
    const icons: Record<keyof AppEmployeeBottomTabbarParamList, any> = {
      Home: props.focused ? images.order_home_active : images.order_home,
      KitchenScreen: props.focused ? images.kitchen_active : images.kitchen,
      ProfileBottomTabScreen: props.focused ? images.mixiLogo : images.mixiLogo,
      ServingScreen: props.focused ? images.serving_active : images.serving,
    };

    return (
      <AppImage
        source={icons[props.screen]}
        style={{
          width: props.size,
          height: props.size,
          resizeMode: 'contain',
        }}
      />
    );
  };

  return (
    <BottomTabbar.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: colorScheme.background,
          borderTopWidth: 1,
          borderBlockColor: palette.gray5,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colorScheme.text,
        headerStyle: {
          backgroundColor: colorScheme.background,
        },
        headerTintColor: mode === 'light' ? palette.black : palette.white,
        headerShadowVisible: false,
      }}>
      {employeeRole === ERestaurantRole.serve ? (
        <BottomTabbar.Group>
          <BottomTabbar.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarIcon: props => renderImage({...props, screen: 'Home'}),
            }}
          />
          <BottomTabbar.Screen
            name="ServingScreen"
            component={ServingScreen}
            options={{
              headerShown: false,
              tabBarIcon: props =>
                renderImage({...props, screen: 'ServingScreen'}),
            }}
          />
        </BottomTabbar.Group>
      ) : (
        <BottomTabbar.Group>
          <BottomTabbar.Screen
            name="KitchenScreen"
            component={KitchenScreen}
            options={{
              headerShown: false,
              tabBarIcon: props =>
                renderImage({...props, screen: 'KitchenScreen'}),
            }}
          />
        </BottomTabbar.Group>
      )}
      <BottomTabbar.Screen
        name="ProfileBottomTabScreen"
        component={ProfileBottomTabScreen}
        options={{
          tabBarIcon: props =>
            renderImage({...props, screen: 'ProfileBottomTabScreen', size: 20}),
          headerTitleStyle: $titleStyle,
          tabBarLabel: t('appBottomTabbar.restaurant.profile'),
        }}
      />
    </BottomTabbar.Navigator>
  );
};

const $titleStyle: STextStyle = [style.tx_font_medium];
