import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppBottomTabbarParamList} from './AppBottomTabbar';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppImage} from '../components/AppImage';
import {images} from '../../assets';
import {EmployeeScreen} from '../screen/Employee/EmployeeScreen';
import {palette, scale, style} from '../theme';
import {STextStyle} from '../models/Style';
import {useThemeMode} from '@rneui/themed';
import {ProfileBottomTabScreen} from '../screen/RestaurantBottomTabs/ProfileBottomTab';
import {useThemeContext} from '../contexts/ThemeContext';
import {MenuScreen} from '../screen/RestaurantBottomTabs/Menu';
import {SeatingScreen} from '../screen/RestaurantBottomTabs/Seating';
import {AppRestaurantDrawerStack} from './AppRestaurantDrawerStack';
import { useFetchFoods } from '../hooks/Food';
import { selectIsLogin } from '../store';
import { useAppSelector } from '../hooks';

export type AppRestaurantBottomTabbarParamList = {
  Home: undefined;
  Employee: undefined;
  ProfileBottomTabScreen: undefined;
  Menu: undefined;
  Seating: undefined;
};

const BottomTabbar =
  createBottomTabNavigator<AppRestaurantBottomTabbarParamList>();

export const AppRestaurantBottomTabbar = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {mode} = useThemeMode();
  const {colorScheme} = useThemeContext();
  const isSignedIn = useAppSelector(selectIsLogin);

  useFetchFoods([isSignedIn]);

  const renderImage = (props: {
    focused: boolean;
    color: string;
    size: number;
    screen: keyof AppRestaurantBottomTabbarParamList;
  }) => {
    const icons = {
      HomeScreen: props.focused ? images.home_active : images.home,
      Employee: props.focused ? images.peopleGroup_active : images.peopleGroup,
      Menu: props.focused ? images.foodMenu_active : images.foodMenu,
      Seating: props.focused ? images.table_active : images.table,
    };

    return (
      <AppImage
        source={
          {
            Home: icons.HomeScreen,
            Employee: icons.Employee,
            ProfileBottomTabScreen: images.mixiLogo,
            Menu: icons.Menu,
            Seating: icons.Seating,
          }[props.screen]
        }
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
      <BottomTabbar.Screen
        name="Home"
        component={AppRestaurantDrawerStack}
        options={{
          tabBarIcon: props => renderImage({...props, screen: 'Home'}),
          tabBarLabel: t('appBottomTabbar.restaurant.Home'),
          headerShown: false,
        }}
      />
      <BottomTabbar.Screen
        name="Employee"
        component={EmployeeScreen}
        options={{
          tabBarIcon: props => renderImage({...props, screen: 'Employee'}),
          tabBarLabel: t('appBottomTabbar.restaurant.Employee.label'),
          // headerTitle: t('appBottomTabbar.restaurant.Employee.title'),
          headerTitleStyle: $titleStyle,
        }}
      />
      <BottomTabbar.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: props => renderImage({...props, screen: 'Menu'}),
          tabBarLabel: t('appBottomTabbar.restaurant.Menu.label'),
          // headerTitle: t('appBottomTabbar.restaurant.Employee.title'),
          headerTitleStyle: $titleStyle,
        }}
      />
      <BottomTabbar.Screen
        name="Seating"
        component={SeatingScreen}
        options={{
          tabBarIcon: props => renderImage({...props, screen: 'Seating'}),
          tabBarLabel: t('appBottomTabbar.restaurant.seating.label'),
          // headerTitle: t('appBottomTabbar.restaurant.Employee.title'),
          headerTitleStyle: $titleStyle,
        }}
      />
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
