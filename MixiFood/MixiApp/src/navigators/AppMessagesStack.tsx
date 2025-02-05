import {CompositeScreenProps} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AppStackParamList} from './AppStack';
import {useTranslation} from 'react-i18next';
import {MessageHomeScreen} from '../screen/AppMessagesScreen/HomeScreen/MessageHomeScreen';

export type AppMessagesStackParamsList = {
  AppMessagesScreen: undefined;
};

export type AppMessagesScreenProps<
  RouteName extends keyof AppMessagesStackParamsList,
> = CompositeScreenProps<
  NativeStackScreenProps<AppMessagesStackParamsList, RouteName>,
  NativeStackScreenProps<AppStackParamList, 'AppBottomTabbar'>
>;

const Stack = createNativeStackNavigator<AppMessagesStackParamsList>();

export const AppMessagesStack = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        component={MessageHomeScreen}
        name="AppMessagesScreen"
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
