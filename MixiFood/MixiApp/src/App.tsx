import 'i18next';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {LogBox, PermissionsAndroid, SafeAreaView, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppStack} from './navigators';
import {AppThemeProvider, useThemeContext} from './contexts/ThemeContext';
import {ThemeProvider, useThemeMode} from '@rneui/themed';
import {appNavTheme, appTheme} from './theme/Theme';
import messaging from '@react-native-firebase/messaging';
import {NotificationListener} from './utils/pushnotification_helper';
import {style} from './theme';
import {Provider} from 'react-redux';
import {store} from './store';
import {LoaderProvider} from './contexts/loader-provider';
import {setupCalendarLocale} from './config';
import GalleryExample from './experiment/Stack1';
import BootSplash from "react-native-bootsplash";


LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Warning: componentWillReceiveProps has been renamed, and is not recommended for use.',
]);

function AppContent() {
  const {mode, setMode} = useThemeMode();
  const {isDarkMode} = useThemeContext();
  setupCalendarLocale();

  useEffect(() => {
    setMode(isDarkMode ? 'dark' : 'light');
  }, [mode, isDarkMode]);

  return (
    <NavigationContainer theme={appNavTheme} onReady={() => BootSplash.hide()}>
      <AppStack />
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  useEffect(() => {
    const requestUserPermission = async () => {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        // console.log('Authorization status: ', authStatus);
        const token = await messaging().getToken();
        console.log('FCM token: ', token);
      }
    };
    requestUserPermission();
    NotificationListener();
  }, []);

  return (
    <GestureHandlerRootView style={style.flex_1}>
      <AppThemeProvider>
        <ThemeProvider theme={appTheme}>
          <LoaderProvider>
            <Provider store={store}>
              <AppContent></AppContent>
            </Provider>
          </LoaderProvider>
          {/* <NavigationContainer theme={appNavTheme}>
            <AppStack />
          </NavigationContainer> */}
        </ThemeProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
  // return (
  //   <GestureHandlerRootView style={style.flex_1}>
  //     <NavigationContainer>
  //       <GalleryExample></GalleryExample>
  //     </NavigationContainer>
  //   </GestureHandlerRootView>
  // );
}
