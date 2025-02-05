import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Layout} from '../../../components/Layout/Layout';
import {AppStackParamList} from '../../../navigators';
import {
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import {selectUserInfo} from '../../../store';
import {useAppSelector} from '../../../hooks';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
import {scale, scaleFontSize, style} from '../../../theme';
import {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Button, Text} from '@rneui/themed';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {AvatarSection} from '../../UserProfileSection/AvatarSection';
import {useFetchProfile} from '../../../hooks/Profile';
import {
  AvatarActionPanel,
  AvatarActionType,
} from '../../UserProfileSection/AvatarActionPanel';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

export const RestaurantProfileScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'RestaurantProfileScreen'>
> = props => {
  const userInfo = useAppSelector(selectUserInfo);
  const {colorScheme} = useThemeContext();
  const AvatarActionBottomSheetRef = useRef<BottomSheetModal>(null);
  const [renderAvatarAction, setRenderAvatarAction] = useState<
    AvatarActionType[]
  >(['editAvatar', 'viewAvatar']);

  const handleCoverAvatarPress = () => {
    setRenderAvatarAction(['viewCoverImage', 'editCoverImage']);
    AvatarActionBottomSheetRef.current?.present();
  };

  const handleAvatarPress = () => {
    setRenderAvatarAction(['viewAvatar', 'editAvatar']);
    AvatarActionBottomSheetRef.current?.present();
  };

  // useFetchProfile([props.navigation]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <Text style={$headerUserName}>{userInfo?.userName}</Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AppImage source={images.angle_left} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('RestaurantProfileEditScreen')
          }>
          <AppImage source={images.pen} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
    });
    // AvatarActionBottomSheetRef.current?.present();
  }, [userInfo]);

  const avatarSection = useMemo(
    () => (
      <AvatarSection
        handleAvatarPress={handleAvatarPress}
        handleCoverAvatarPress={handleCoverAvatarPress}
        avatar={userInfo?.avatar as string}
        coverImage={userInfo?.coverImage as string}
      />
    ),
    [userInfo, props.navigation],
  );

  return (
    <Layout style={$root}>
      <ScrollView>
        <View style={style.flex_1}>{avatarSection}</View>
        <View style={$innercontainer}>
          <Text style={$userName}>{userInfo?.userName}</Text>
        </View>
      </ScrollView>
    </Layout>
  );
};

const $root: SViewStyle = [style.flex_1];
const $innercontainer: SViewStyle = [style.flex_1, style.mx_sm];
const $userName: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(22)},
];
const $headerUserName: STextStyle = [
  {fontSize: scaleFontSize(18)},
  style.tx_font_bold,
];
