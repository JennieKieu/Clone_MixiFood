import React, {type PropsWithChildren} from 'react';
import {Animated, ViewProps} from 'react-native';

type TScaleUpProps = {} & PropsWithChildren & ViewProps;

export class ScaleUp extends React.Component<
  TScaleUpProps,
  {scale: Animated.Value}
> {
  constructor(props: TScaleUpProps) {
    super(props);
    this.state = {
      scale: new Animated.Value(0),
    };
  }

  componentDidMount(): void {
    Animated.spring(this.state.scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  unmount(): void {
    Animated.spring(this.state.scale, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  render(): React.ReactNode {
    return (
      <Animated.View
        style={[this.props.style, {transform: [{scale: this.state.scale}]}]}>
        {this.props.children}
      </Animated.View>
    );
  }
}
