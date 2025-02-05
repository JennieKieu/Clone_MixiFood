import {Text} from '@rneui/themed';
import {Layout} from '../../../components/Layout/Layout';
import {AppMessagesScreenProps} from '../../../navigators/AppMessagesStack';
import {useLayoutEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';

export const MessageHomeScreen: React.FC<
  AppMessagesScreenProps<'AppMessagesScreen'>
> = props => {
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerTitle: 'Message',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity>
          <AppImage source={images.list_solid} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity>
          <AppImage source={images.pen} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <Layout>
      <Text>FACEBOOK MESSAGE 1:1</Text>
    </Layout>
  );
};
