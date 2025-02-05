import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer';
import {HomeScreen} from '../screen/RestaurantBottomTabs/Home';
import {AppRestaurantBottomTabbar} from './RestaurantBottomTab';
import {useThemeContext} from '../contexts/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomDrawerContent} from '../screen/RestaurantBottomTabs/CustomDrawerContent';
import {style} from '../theme';
import {useTranslation} from 'react-i18next';
import {PaymentHistoriesScreen} from '../screen/RestaurantBottomTabs/PaymentHistoriesScreen';

export type AppRestaurantDrawerStackParamList = {
  Home: undefined;
  CustomDrawerContent: undefined;
};

const Drawer = createDrawerNavigator<AppRestaurantDrawerStackParamList>();

export const AppRestaurantDrawerStack = () => {
  const {colorScheme} = useThemeContext();
  const {t} = useTranslation();
  const {bottom, top} = useSafeAreaInsets();

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        // drawerHideStatusBarOnOpen: true,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: colorScheme.background},
        // drawerInactiveBackgroundColor: 'red',
        drawerLabelStyle: {},
        // headerShown: false,
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};
