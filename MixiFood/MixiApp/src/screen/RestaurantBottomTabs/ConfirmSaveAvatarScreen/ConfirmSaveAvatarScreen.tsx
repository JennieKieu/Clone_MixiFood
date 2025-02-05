import React, {useLayoutEffect} from 'react';
import {Layout} from '../../../components/Layout/Layout';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {Text} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {Alert, Image, TouchableOpacity} from 'react-native';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {View} from 'react-native';
import {palette, scaleFontSize, style} from '../../../theme';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {loginApi} from '../../../api/loginApi';
import {useLoader} from '../../../contexts/loader-provider';
import {ELoaderType} from '../../../components/AppLoader';
import {Dimensions} from 'react-native';
import {useAppDispatch} from '../../../hooks';
import {setProfile, TProfile} from '../../../store';

export type TUploadProfileType = 'avatar' | 'cover image';

const {width, height} = Dimensions.get('screen');
export const ConfirmSaveAvatarScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'ConfirmSaveAvatarScreen'>
> = props => {
  const {t} = useTranslation();
  const {show, hide} = useLoader();
  const dispatch = useAppDispatch();

  const handleConfirmChangeAvatar = async () => {
    show(ELoaderType.default);

    try {
      const res =
        props.route.params.uploadType === 'avatar'
          ? await loginApi.uploadAvatar(props.route.params.image)
          : await loginApi.uploadCoverImage(props.route.params.image);
      if (res.data.data) {
        Alert.alert('Update success');
        const profile: TProfile = res.data.data;
        dispatch(setProfile(profile));
        props.navigation.goBack();
        hide();
      }
      hide();
    } catch (error) {
      hide();
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <Text style={$HeaderTextTitle}>{t('preview.previewAvatar')}</Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AppImage source={images.angle_left}></AppImage>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleConfirmChangeAvatar}>
          <Text style={$HeaderTextTitle}>{t('common.save')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [props.navigation]);

  return (
    <Layout safeAreaOnTop>
      <View style={style.center}>
        <TouchableOpacity>
          <TouchableOpacity style={$cameraIconContainer}>
            <AppImage
              style={$cameraIcon}
              lightImg={images.camera}
              darkImg={images.camera_white}></AppImage>
          </TouchableOpacity>
          <Image
            source={{uri: props.route.params.image.uri}}
            style={
              props.route.params.uploadType === 'avatar' ? $img : $coverImg
            }></Image>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const $img: SImageStyle = [
  {width: scaleFontSize(200), height: scaleFontSize(200), borderRadius: 999},
];
const $cameraIconContainer: SViewStyle = [
  {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
    borderWidth: 2,
    borderRadius: 999,
    backgroundColor: palette.gray6,
    padding: scaleFontSize(8),
  },
];
const $cameraIcon: SImageStyle = [];
const $HeaderTextTitle: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(16)},
];
const $coverImg: SImageStyle = [
  {width: width / 1.2, height: 200, resizeMode: 'cover'},
];
