import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import { Tile } from '@rneui/base';
import { restaurantApi } from '../api/restaurantApi';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function getFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  if (!fcmtoken) {
    try {
      let fcmToken = await messaging().getToken();
      if (fcmToken) {
        // const response = await restaurantApi.
        AsyncStorage.setItem('fcmtoken', fcmToken);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function onDisplayNotification(title: string, body: string) {
  // Request permissions (required for iOS)
  // const per = await notifee.requestPermission();
  // console.log(per.authorizationStatus);
  

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
      importance: AndroidImportance.HIGH,
      sound: 'default'
    },
  });

}

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused appp to open from background state: ',
      remoteMessage.data,
    );
    // onDisplayNotification(Tile: remoteMessage.title, );

  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      console.log(
        'Notification caused app to open from quit states',
        remoteMessage?.notification,
      );
    });

  messaging().onMessage(async remoteMessage => {
    console.log(
      'notification on froground state ....',
      remoteMessage.notification,
    );
  });
};
