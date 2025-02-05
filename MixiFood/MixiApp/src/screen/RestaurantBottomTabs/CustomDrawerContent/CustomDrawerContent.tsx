import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {Layout} from '../../../components/Layout/Layout';
import {Text} from '@rneui/themed';
import {CompositeScreenProps, useRoute} from '@react-navigation/native';
import {AppRestaurantDrawerStackParamList} from '../../../navigators/AppRestaurantDrawerStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {Image, SafeAreaView, View} from 'react-native';
import {scaleFontSize, style} from '../../../theme';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {useAppSelector} from '../../../hooks';
import {selectUserInfo} from '../../../store';
import {useTranslation} from 'react-i18next';

export const CustomDrawerContent = (props: any) => {
  const router = useRoute();
  const {t} = useTranslation();
  const restaurantProfile = useAppSelector(selectUserInfo);

  return (
    <View style={style.flex_1}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={$avatar}>
          <Image source={{uri: restaurantProfile?.avatar}} style={$avatarImg} />
          <Text style={$restaurantName}>{restaurantProfile?.userName}</Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          label={t('common.paymentHistory')}
          onPress={() => router.params}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const $avatar: SViewStyle = [style.flex_1, style.center];
const $avatarImg: SImageStyle = [
  {width: scaleFontSize(120), height: scaleFontSize(120), borderRadius: 999},
];
const $restaurantName: STextStyle = [
  style.tx_font_bold,
  style.my_sm,
  {fontSize: scaleFontSize(16)},
];
