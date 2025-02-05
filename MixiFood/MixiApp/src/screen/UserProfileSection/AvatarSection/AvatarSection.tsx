import React, {useEffect, useRef} from 'react';
import {Dimensions, ImageBackground, Pressable, View} from 'react-native';
import {scale, scaleFontSize, style} from '../../../theme';
import {images} from '../../../../assets';
import {AppImage} from '../../../components/AppImage';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {SImageStyle, SViewStyle} from '../../../models';
import {AvatarActionPanel} from '../AvatarActionPanel';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

export type AvatarSectionProps = {
  coverImage: string;
  avatar: string;
};

const {width, height} = Dimensions.get('screen');
export const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatar,
  coverImage,
}) => {
  const {colorScheme} = useThemeContext();
  const AvatarActionBottomSheetRef = useRef<BottomSheetModal>(null);
  const CoverAvatarBottomSheetRef = useRef<BottomSheetModal>(null);

  const handleAvatarPress = () => {
    AvatarActionBottomSheetRef.current?.present();
  };

  const handleCoverAvatarPress = () => {
    CoverAvatarBottomSheetRef.current?.present();
  };

  return (
    <View style={style.flex_1}>
      <Pressable onPress={handleCoverAvatarPress}>
        <ImageBackground source={{uri: coverImage}} style={$coverImage}>
          <Pressable
            style={[
              $cameraIconContainerOnCoverAvatar,
              {backgroundColor: colorScheme.dot},
            ]}
            onPress={handleCoverAvatarPress}>
            <AppImage
              lightImg={images.camera}
              darkImg={images.camera_white}
              style={$cameraImg}></AppImage>
          </Pressable>
          <Pressable style={$AvatarContainer} onPress={handleAvatarPress}>
            <View>
              <ImageBackground
                style={$avatarImg}
                source={{uri: avatar}}></ImageBackground>
              <Pressable
                style={[
                  $cameraIconContainerOnAvatar,
                  {backgroundColor: colorScheme.dot},
                ]}
                onPress={handleAvatarPress}>
                <AppImage
                  lightImg={images.camera}
                  darkImg={images.camera_white}
                  style={$cameraImg}></AppImage>
              </Pressable>
            </View>
          </Pressable>
        </ImageBackground>
      </Pressable>
      <View style={{height: scale.y(60, 60 * 1.5)}}></View>
      <AvatarActionPanel
        renderAction={['viewAvatar', 'editAvatar']}
        bottomSheetModalRef={AvatarActionBottomSheetRef}
        onpress={() => {}}></AvatarActionPanel>
      <AvatarActionPanel
        renderAction={['viewCoverImage', 'editCoverImage']}
        bottomSheetModalRef={CoverAvatarBottomSheetRef}
        onpress={() => {}}></AvatarActionPanel>
    </View>
  );
};

const $coverImage: SImageStyle = [{width: '100%', height: height / 4}];
const $avatarImg: SImageStyle = [
  //   style.abs,
  {
    width: scale.x(150, 150 * 1.5),
    height: scale.y(150, 150 * 1.5),
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: 'rgba(0, 0, 0, 0.8)',
    left: 12,
    resizeMode: 'contain',
  },
  {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  style.overflow_hidden,
];
const $cameraImg: SImageStyle = [
  {width: scale.x(20, 20 * 1.5), height: scale.y(20, 20 * 1.5)},
];
const $cameraIconContainerOnCoverAvatar: SImageStyle = [
  style.abs,
  {
    right: 10,
    bottom: 10,
    padding: scaleFontSize(10),
    borderRadius: 999,
  },
];
const $cameraIconContainerOnAvatar: SViewStyle = [
  style.abs,
  {
    right: -12,
    bottom: 0,
    padding: scaleFontSize(10),
    borderRadius: 999,
    zIndex: 999,
  },
];
const $AvatarContainer: SViewStyle = [{position: 'absolute', bottom: -50}];
