import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {StyleProp, Text, ViewStyle} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {AppStackParamList} from '../../navigators';
import {style} from '../../theme';

export const SplashScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'SplashScreen'>
> = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('IntroScreen');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation]);
  const videoRef = useRef<VideoRef>(null);
  const background = require('../../../assets/SplashVideo.mp4');

  return (
    <Video
      source={background}
      ref={videoRef}
      style={{flex: 1}}
      volume={0}
      resizeMode="cover"></Video>
  );
};

const $root: StyleProp<ViewStyle> = [{paddingBottom: '20%'}, style.justify_end];
