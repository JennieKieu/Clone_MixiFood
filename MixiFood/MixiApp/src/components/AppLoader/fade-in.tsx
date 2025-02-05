import {Component, PropsWithChildren} from 'react';
import {AnimatableNumericValue, Animated, ViewProps} from 'react-native';

type TFadeInProps = {
  maxOpacity: AnimatableNumericValue;
} & PropsWithChildren &
  ViewProps;

export class FadeIn extends Component<TFadeInProps, {opacity: Animated.Value}> {
  constructor(props: TFadeInProps) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0), // Initial value for opacity: 0
    };
  }

  componentDidMount(): void {
    Animated.spring(this.state.opacity, {
      toValue: this.props.maxOpacity as number,
      useNativeDriver: true,
    }).start();
  }

  unmount(): void {
    Animated.spring(this.state.opacity, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  render(): React.ReactNode {
    return (
      <Animated.View style={[this.props.style, {opacity: this.state.opacity}]}>
        {this.props.children}
      </Animated.View>
    );
  }
}
