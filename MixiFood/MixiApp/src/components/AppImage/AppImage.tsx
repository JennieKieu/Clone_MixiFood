import {ThemeConsumer} from '@rneui/themed';
import React from 'react';
import {Image, ImageProps, ImageSourcePropType} from 'react-native';
import {palette} from '../../theme';
import {images} from '../../../assets';

type AppImageProps = {
  lightImg?: ImageSourcePropType;
  darkImg?: ImageSourcePropType;
} & ImageProps;

export class AppImage extends React.Component<AppImageProps> {
  constructor(props: AppImageProps) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <ThemeConsumer>
        {({theme}) => {
          const sourceImg =
            theme.mode === 'light'
              ? this.props.lightImg
              : this.props.darkImg || this.props.source;

          return (
            <Image
              {...this.props}
              tintColor={
                this.props.lightImg
                  ? undefined
                  : theme.mode === 'light'
                  ? palette.black
                  : palette.white
              }
              source={
                this.props.lightImg ? sourceImg : this.props.source
              }></Image>
          );
        }}
      </ThemeConsumer>
    );
  }
}
