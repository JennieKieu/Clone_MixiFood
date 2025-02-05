import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AppRestaurantBottomTabbarParamList} from './RestaurantBottomTab';
import {AppUserBottomTabbarParamList} from './UserBottomTab';
import {AppStackParamList} from './AppStack';
import {useTranslation} from 'react-i18next';
import {AppBottomTabbarParamList} from './AppBottomTabbar';
import {AppSettingsScreen} from '../screen/AppSettingsScreens';
import {ThemeSettingScreen} from '../screen/ThemeSettingScreen';

export type AppSettingsStackParamsList = {
  AppSettingsScreen: undefined;
  ThemeSettingScreen: undefined;
};

export type AppSettingScreenProps<
  RouteName extends keyof AppSettingsStackParamsList,
> = CompositeScreenProps<
  CompositeScreenProps<
    NativeStackScreenProps<AppSettingsStackParamsList, RouteName>,
    BottomTabScreenProps<AppBottomTabbarParamList>
  >,
  NativeStackScreenProps<AppStackParamList, 'AppBottomTabbar'>
>;

const Stack = createNativeStackNavigator<AppSettingsStackParamsList>();

export const AppSettingsStack = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        component={AppSettingsScreen}
        name="AppSettingsScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={ThemeSettingScreen}
        name="ThemeSettingScreen"
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
