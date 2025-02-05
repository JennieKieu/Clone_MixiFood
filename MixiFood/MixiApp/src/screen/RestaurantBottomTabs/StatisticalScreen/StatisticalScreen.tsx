import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../components/Layout/Layout';
import {AppStackParamList} from '../../../navigators';
import {useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';

export const StatisticalScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'StatisticalScreen'>
> = props => {
  const {t} = useTranslation();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerBackVisible: true,
      headerTitleAlign: 'center',
      headerTitle: t('common.statistical'),
    });
  }, []);

  return <Layout></Layout>;
};
