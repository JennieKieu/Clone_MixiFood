import React, {useEffect, useState} from 'react';
import {ELoaderType, TLoaderContentProps} from './AppLoader.types';
import {ScaleUp} from './ScaleUp';
import {FadeIn} from './fade-in';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {loaderAnimations} from '../../../assets/lottieAnimation';
import {scale, style} from '../../theme';

export const LoaderContent: React.FC<TLoaderContentProps> = props => {
  const {
    useAnimated = true,
    loaderColor,
    renderLoader,
    backdropColor,
    backdropOpacity = 0.2,
    loaderBackdropColor,
    activityLoaderProps,
    loaderBackdropOpacity = 0.8,
    loaderType = ELoaderType.default,
  } = props;

  const [isVisible, setIsVisible] = useState<boolean>(props.visible);

  const scaleUpRef = React.createRef<ScaleUp>();
  const fadeInRef = React.createRef<FadeIn>();

  useEffect(() => {
    if (!useAnimated) return;
    if (props.visible) {
      setIsVisible(true);
    } else {
      scaleUpRef.current?.unmount();
      fadeInRef.current?.unmount();
      setTimeout(() => setIsVisible(false), 150);
    }
  }, [props.visible, useAnimated, scaleUpRef, fadeInRef]);

  const $backdropOverried: StyleProp<ViewStyle> = StyleSheet.flatten([
    $backdrop,
    {
      backgroundColor: backdropColor ?? 'black',
      opacity: backdropOpacity ?? 0.2,
    },
  ]);

  const $loaderWrapperBackdropOverried: StyleProp<ViewStyle> =
    StyleSheet.flatten([
      $loaderWrapperBackdrop,
      {
        backgroundColor: loaderBackdropColor ?? 'black',
        opacity: loaderBackdropOpacity ?? 0.8,
      },
    ]);

  const AnimatedWrapper = {
    ScaleUp: useAnimated ? ScaleUp : View,
    FadeIn: useAnimated ? FadeIn : View,
  };

  const _isVisible = useAnimated ? isVisible : props.visible;

  const renderLoaderOnType = (loaderType: ELoaderType) => {
    switch (loaderType) {
      case (loaderType = ELoaderType.animation1):
        return (
          <LottieView
            source={loaderAnimations.loader1}
            autoPlay={isVisible}
            speed={2}
            style={$loader}
          />
        );
      case (loaderType = ELoaderType.foodLoader1):
        return (
          <LottieView
            source={loaderAnimations.foodLoader1}
            autoPlay={isVisible}
            speed={1}
            style={$loader}
          />
        );
      case (loaderType = ELoaderType.orderLoader1):
        return (
          <LottieView
            source={loaderAnimations.orderLoader1}
            autoPlay={isVisible}
            speed={1}
            style={$loader}
          />
        );
      case (loaderType = ELoaderType.invoiceLoader):
        return (
          <LottieView
            source={loaderAnimations.invoiceLoader}
            autoPlay={isVisible}
            speed={1}
            style={$loader}
          />
        );
      case (loaderType = ELoaderType.locationloader):
        return (
          <LottieView
            source={loaderAnimations.locationLoader}
            autoPlay={isVisible}
            speed={1}
            style={$loader}
          />
        );
    }
  };

  return (
    _isVisible && (
      <View style={$root}>
        <AnimatedWrapper.FadeIn
          ref={fadeInRef}
          style={$backdropOverried}
          maxOpacity={backdropOpacity}
        />
        {renderLoader ? (
          renderLoader(props)
        ) : (
          <AnimatedWrapper.ScaleUp ref={scaleUpRef}>
            <View style={$loaderWrapper}>
              {props.loaderType === ELoaderType.default ? (
                <>
                  <View style={$loaderWrapperBackdropOverried} />
                  <ActivityIndicator
                    {...activityLoaderProps}
                    color={loaderColor ?? 'white'}
                  />
                </>
              ) : (
                renderLoaderOnType(loaderType)
              )}
            </View>
          </AnimatedWrapper.ScaleUp>
        )}
      </View>
    )
  );
};

const $root: StyleProp<ViewStyle> = [
  StyleSheet.absoluteFillObject,
  {
    alignItems: 'center',
    justifyContent: 'center',
  },
];

const $backdrop: StyleProp<ViewStyle> = [
  StyleSheet.absoluteFillObject,
  Platform.OS === 'ios' ? {zIndex: -1} : {zIndex: 1},
];

const $loaderWrapper: StyleProp<ViewStyle> = {
  aspectRatio: 1,
  padding: 20,
  borderRadius: 12,
  overflow: 'hidden',
};

const $loaderWrapperBackdrop: StyleProp<ViewStyle> = [
  StyleSheet.absoluteFillObject,
  {zIndex: -1},
];

const $loader: StyleProp<ViewStyle> = [
  {width: scale.x(300, 300), height: scale.y(300, 300 * 1.5)},
];
