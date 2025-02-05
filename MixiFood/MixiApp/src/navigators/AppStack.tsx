import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Test from '../screen/Test';
import {SplashScreen} from '../screen/SplashScreen';
import {IntroScreen} from '../screen/IntroScreen/IntroScreen';
import {LoginScreen} from '../screen/LoginScreen/LoginScreen';
import {SignUpScreen} from '../screen/SignupScreen';
import {SmsVerifyScreen} from '../screen/SmsVerifyScreen/SmsVerifyScreen';
import {AppBottomTabbar} from './AppBottomTabbar';
import {useEffect, useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  EUserType,
  logOut,
  selectIsLogin,
  selectUserInfo,
  selectUserType,
} from '../store';
import {loginApi} from '../api/loginApi';
import {withModalProvider} from '../services';
import {AppSettingsStack} from './AppSettingsStack';
import {useTheme} from '@rneui/themed';
import {palette} from '../theme';
import {useThemeContext} from '../contexts/ThemeContext';
import {RestaurantProfileScreen} from '../screen/RestaurantBottomTabs/ProfileScreen';
import {RestaurantProfileEditScreen} from '../screen/RestaurantBottomTabs/RestaurantProfileEditScreen';
import {
  ConfirmSaveAvatarScreen,
  TUploadProfileType,
} from '../screen/RestaurantBottomTabs/ConfirmSaveAvatarScreen';
import {Asset} from 'react-native-image-picker';
import {
  OrderFoodScreen,
  TPrieViewFood,
} from '../screen/EmployeeBottomTabs/OrderFood';
import {OrderTabsScreen} from '../screen/OrderTabsScreen';
import {ConfirmOrderScreen} from '../screen/EmployeeBottomTabs/ConfirmOrderScreen';
import {TRestaurantForMap, TSeatingForStore} from '../models';
import {Alert} from 'react-native';
import {useRestaurantSocket} from '../hooks/restaurantSocket';
import {InvoicePrieViewScreen} from '../screen/EmployeeBottomTabs/InvoicePrieViewScreen';
import {PendingPaymentScreen} from '../screen/RestaurantBottomTabs/PendingPaymentScreen';
import {PrinterPaymentInvoiceScreen} from '../screen/RestaurantBottomTabs/PrinterPaymentInvoice';
import {restaurantApi} from '../api/restaurantApi';
import {getFCMToken} from '../utils/pushnotification_helper';
import {PaymentHistoriesScreen} from '../screen/RestaurantBottomTabs/PaymentHistoriesScreen';
import {FilterDrawer} from '../screen/RestaurantBottomTabs/PaymentHistoriesScreen/Drawer';
import {TestRnMapBox} from '../screen/TestRNMapBox/TestMapBoxScreen';
import {ConfirmLocationMapScreen} from '../screen/RestaurantBottomTabs/ConfirmLocationMap';
import {RestaurantPrieviewScreen} from '../screen/UserBottom/RestaurantPreviewScreen';
import {TableBookingScreen} from '../screen/UserBottom/TableBookingScreen';
import {
  SelecSeatingScreen,
  TSelecSeatingScreenProps,
} from '../screen/UserBottom/SelectSeatingScreen';
import {AddPaymentMethodScreen} from '../screen/RestaurantBottomTabs/AddPaymentMethodScreen';
import {TPaymentMethods} from '../api/api.types';
import {appAuthentication} from '../services/Authentication';
import {useLoader} from '../contexts/loader-provider';
import {SeatingBookingRequestScreen} from '../screen/RestaurantBottomTabs/SeatingBookingRequest/SeatingBookingRequestScreen.tsx';
import {AppMessagesStack} from './AppMessagesStack.tsx';
import {StatisticalScreen} from '../screen/RestaurantBottomTabs/StatisticalScreen/StatisticalScreen.tsx';

export type AppStackParamList = {
  TestScreen: undefined;
  SplashScreen: undefined;
  IntroScreen: undefined;
  LoginScreen: undefined;
  SigUpScreen: undefined;
  SmsVerifyScreen: {phoneNumber: string; userType: EUserType};
  AppBottomTabbar: undefined;
  AppSettingsStack: undefined;
  RestaurantProfileScreen: undefined;
  RestaurantProfileEditScreen: undefined;
  ConfirmSaveAvatarScreen: {
    image: Asset;
    uploadType: TUploadProfileType;
    handeSave?: () => void;
  };
  OrderFoodScreen: {seatId: TSeatingForStore['_id']};
  OrderTabsScreen: {seatId: TSeatingForStore['_id']};
  ConfirmOrderScreen: {
    orderedFoods: TPrieViewFood[];
    seatId: TSeatingForStore['_id'];
  };
  InvoicePrieViewScreen: {seatId: TSeatingForStore['_id']};
  PendingPaymentScreen: undefined;
  PrinterPaymentInvoiceScreen: {invoiceId: string};
  FilterDrawer: undefined;
  TestRnMapBox: undefined;
  ConfirmLocationMapScreen: undefined;
  RestaurantPrieviewScreen: {
    restaurantId: string;
    locationData: TRestaurantForMap;
  };
  TableBookingScreen: {restaurantId: string};
  SelecSeatingScreen: {data: TSelecSeatingScreenProps};
  AddPaymentMethodScreen: {method: TPaymentMethods};
  SeatingBookingRequestScreen: undefined;
  AppMessagesStack: undefined;
  StatisticalScreen: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = withModalProvider(() => {
  const isSignedIn = useAppSelector(selectIsLogin);
  const dispatch = useAppDispatch();
  const userType = useAppSelector(selectUserType);
  const loader = useLoader();

  const {colorScheme} = useThemeContext();
  useRestaurantSocket([]);

  useEffect(() => {
    loader.show();
    // dispatch(logOut());
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) appAuthentication.setToken(token);
        const data = await loginApi.checkToken();
      } catch (error) {
        loader.hide();

        Alert.alert('Token expired, please log in again');
        dispatch(logOut());
      }
      // console.log('data', data);
    };
    checkLoginStatus();
    // update FCM token
    const updateFCMToken = async () => {
      await getFCMToken();
      const fcmToken = await AsyncStorage.getItem('fcmtoken');
      if (fcmToken) {
        try {
          const response = await restaurantApi.updateFcmToken(fcmToken);
          console.log('updated token', response.data);
        } catch (error) {
          loader.hide();

          console.log('error update fcm token', error);
        }
      }
    };
    loader.hide();

    userType === EUserType.restaurant && isSignedIn && updateFCMToken();
  }, [isSignedIn]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {backgroundColor: colorScheme.background},
      }}>
      {/* group by restaurant or employee ? */}
      {isSignedIn ? (
        <Stack.Group>
          {/* <Stack.Screen name="TestScreen" component={Test}></Stack.Screen> */}
          <Stack.Screen
            name="AppBottomTabbar"
            component={AppBottomTabbar}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RestaurantProfileScreen"
            component={RestaurantProfileScreen}
            options={{headerBackVisible: false}}
          />
          <Stack.Screen
            name="RestaurantProfileEditScreen"
            component={RestaurantProfileEditScreen}
            options={{headerBackVisible: false}}
          />
          <Stack.Screen
            name="ConfirmSaveAvatarScreen"
            component={ConfirmSaveAvatarScreen}
            options={{headerBackVisible: false}}
          />
          <Stack.Screen
            name="OrderFoodScreen"
            component={OrderFoodScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OrderTabsScreen"
            component={OrderTabsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ConfirmOrderScreen"
            component={ConfirmOrderScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="InvoicePrieViewScreen"
            component={InvoicePrieViewScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PendingPaymentScreen"
            component={PendingPaymentScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PrinterPaymentInvoiceScreen"
            component={PrinterPaymentInvoiceScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FilterDrawer"
            component={FilterDrawer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TestRnMapBox"
            component={TestRnMapBox}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ConfirmLocationMapScreen"
            component={ConfirmLocationMapScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RestaurantPrieviewScreen"
            component={RestaurantPrieviewScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TableBookingScreen"
            component={TableBookingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SelecSeatingScreen"
            component={SelecSeatingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddPaymentMethodScreen"
            component={AddPaymentMethodScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SeatingBookingRequestScreen"
            component={SeatingBookingRequestScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            component={AppMessagesStack}
            name="AppMessagesStack"
            options={{headerShown: false}}
          />
          <Stack.Screen
            component={StatisticalScreen}
            name="StatisticalScreen"
            options={{headerShown: false}}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          {/* <Stack.Screen name="TestScreen" component={Test}></Stack.Screen> */}
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="IntroScreen"
            component={IntroScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
              animation: 'fade_from_bottom',
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SigUpScreen"
            component={SignUpScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SmsVerifyScreen"
            component={SmsVerifyScreen}
            options={{}}
          />
          <Stack.Screen
            name="ConfirmLocationMapScreen"
            component={ConfirmLocationMapScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AppBottomTabbar"
            component={AppBottomTabbar}
            options={{headerShown: false}}
          />
        </Stack.Group>
      )}
      <Stack.Screen
        component={AppSettingsStack}
        name="AppSettingsStack"
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
});
