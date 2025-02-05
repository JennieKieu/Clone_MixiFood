import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetSectionList,
} from '@gorhom/bottom-sheet';
import {Text, ThemeConsumer, ThemeOptions} from '@rneui/themed';
import React, {PropsWithChildren} from 'react';
import {
  Modal,
  Pressable,
  SectionListProps,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import isEqual from 'lodash.isequal';
import {scaleFontSize, style} from '../../theme';
import {AppInput} from '../AppInput';
import {Layout} from '../Layout/Layout';

type BaseProps<T extends object> = {
  value?: T;
  renderItem?: (item: T, index: number) => JSX.Element;
  onValueChange: (item: T) => void;
  supportSearch?: boolean;
  title?: string;
  filterProps?: (keyof T)[];
  itemStyle?: StyleProp<ViewStyle>;
  renderListHeader?: () => JSX.Element;
  renderBottom?: () => JSX.Element; // Added prop for custom bottom view
  disabled?: boolean;
} & PropsWithChildren;

export type AppDropdownProps<T extends object> = BaseProps<T> &
  (
    | {
        sectionList?: false;
        data?: T[];
      }
    | {
        sectionList: true;
        data?: {title: string; data: T[]}[];
        renderSectionHeader?: SectionListProps<
          T,
          {title: string; data: T[]}
        >['renderSectionHeader'];
      }
  );

type AppDropdownState = {
  isVisible: boolean;
  keyword: string;
  inputFocused: boolean;
};

export default class AppDropdown<T extends object> extends React.Component<
  AppDropdownProps<T>,
  AppDropdownState
> {
  bottomSheetRef;

  constructor(props: AppDropdownProps<T>) {
    super(props);
    this.state = {
      isVisible: false,
      keyword: '',
      inputFocused: false,
    };
    this.bottomSheetRef = React.createRef<BottomSheet>();
  }

  open() {
    this.setState({isVisible: true});
  }

  close() {
    this.setState({isVisible: false});
  }

  handleKeywordChanged(keyword: string) {
    this.setState({keyword});
  }

  handleInputFocus = () => {
    this.setState({inputFocused: true});
  };

  handleInputBlur = () => {
    this.setState({inputFocused: false});
  };

  get filter(): T[] {
    if (this.props.sectionList) {
      return [];
    } else {
      if (this.state.keyword) {
        return (this.props.data || []).filter(item =>
          this.props.filterProps
            ?.map(x => item?.[x]?.toString().trim())
            ?.join('')
            ?.toLowerCase()
            ?.includes((this.state.keyword || '').trim().toLowerCase()),
        );
      } else {
        return this.props.data || [];
      }
    }
  }

  get filterSection(): {title: string; data: T[]}[] {
    if (this.props.sectionList) {
      if (this.state.keyword) {
        return (this.props.data || []).map(x => ({
          ...x,
          data: x.data.filter(y =>
            this.props.filterProps
              ?.map(z => y?.[z]?.toString().trim())
              ?.join('')
              ?.toLowerCase()
              ?.includes((this.state.keyword || '').trim().toLowerCase()),
          ),
        }));
      } else {
        return this.props.data || [];
      }
    } else {
      return [];
    }
  }

  _renderItem(item: T, index: number, theme: ThemeOptions) {
    const isActive =
      this.props.value !== undefined && isEqual(item, this.props.value);
    return (
      <Pressable
        onPress={() => {
          this.bottomSheetRef.current?.close();
          this.props.onValueChange(item);
        }}
        key={index}>
        <View style={this.props.itemStyle}>
          {isActive ? (
            <View
              style={[$checkRoot, {backgroundColor: theme.colors.background}]}>
              {/* <Image source={images.check} /> */}
            </View>
          ) : undefined}
          {this.props.renderItem?.(item, index)}
          <View style={$itemMask(isActive)} />
        </View>
      </Pressable>
    );
  }

  _renderSearch() {
    return this.props.supportSearch ? (
      <View style={[style.w_screenWidth, style.px_lg]}>
        <AppInput
          placeholder="Search here"
          value={this.state.keyword}
          onChangeText={keyword => this.handleKeywordChanged(keyword)}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
        />
      </View>
    ) : undefined;
  }

  _renderBottom() {
    if (this.props.renderBottom) {
      return <View>{this.props.renderBottom()}</View>;
    }
    return null;
  }

  _renderTitle(theme: ThemeOptions) {
    return this.props.title ? (
      <View style={[$header, {backgroundColor: theme.colors.white}]}>
        <Text style={$tittle}>{this.props.title}</Text>
      </View>
    ) : undefined;
  }

  render(): React.ReactNode {
    const {supportSearch} = this.props;
    const {inputFocused} = this.state;

    // let snapPoints = ["25%", "50%", "90%"];
    let snapPoints = ['90%'];

    return (
      <ThemeConsumer>
        {({theme}) => (
          <>
            <Pressable
              onPress={() => this.open()}
              disabled={this.props.disabled}>
              <>{this.props.children}</>
            </Pressable>
            {this.state.isVisible && (
              <Modal
                transparent
                statusBarTranslucent
                visible
                onRequestClose={() => this.close()}>
                <GestureHandlerRootView>
                  <BottomSheet
                    ref={this.bottomSheetRef}
                    index={0}
                    enablePanDownToClose
                    snapPoints={snapPoints}
                    backdropComponent={props => (
                      <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1}
                        appearsOnIndex={0}
                      />
                    )}
                    onClose={() => this.close()}
                    backgroundStyle={{
                      backgroundColor: theme.colors.background,
                    }}
                    handleIndicatorStyle={{
                      backgroundColor: theme.colors.grey5,
                    }}>
                    {this.props.sectionList ? (
                      <BottomSheetSectionList
                        sections={this.filterSection}
                        keyExtractor={(_, index) => `${index}`}
                        renderItem={({item, index}) =>
                          this._renderItem(item, index, theme)
                        }
                        renderSectionHeader={
                          this.props.renderSectionHeader ||
                          (({section: {title}}) => (
                            <Layout nonFill style={$section}>
                              <Text>{title}</Text>
                            </Layout>
                          ))
                        }
                        ItemSeparatorComponent={() => (
                          <View style={style.mb_md} />
                        )}
                        ListHeaderComponent={() => this._renderSearch()}
                        ListFooterComponent={() => this._renderBottom()}
                      />
                    ) : (
                      <ScrollView
                        style={{flexGrow: 0}}
                        stickyHeaderIndices={supportSearch ? [0] : undefined}
                        stickyHeaderHiddenOnScroll>
                        {this._renderTitle(theme)}
                        {this._renderSearch()}
                        {this.props.renderListHeader?.()}
                        {this.filter.map((item, index) =>
                          this._renderItem(item, index, theme),
                        )}
                        {this._renderBottom()}
                      </ScrollView>
                    )}
                    <View style={style.mb_lg} />
                  </BottomSheet>
                </GestureHandlerRootView>
              </Modal>
            )}
          </>
        )}
      </ThemeConsumer>
    );
  }
}

const $header: StyleProp<ViewStyle> = [style.align_center];
const $itemMask = (isActive: boolean): StyleProp<ViewStyle> => {
  let based: StyleProp<ViewStyle> = [style.abs_fo, {zIndex: 1}];

  if (isActive) {
    // based.push({ borderWidth: 1 });
    // based.push(style.border_color_pr);
    based.push(style.round_md);
  }

  return based;
};
const $checkRoot: StyleProp<ViewStyle> = [
  style.abs,
  style.rounded,
  {
    zIndex: 1,
    right: -10,
    top: -10,
  },
];
const $section: StyleProp<ViewStyle> = [style.px_xl, style.py_xs];
const $tittle: StyleProp<TextStyle> = [
  style.tx_font_medium,
  style.mb_xs,
  style.tx_center,
  {fontSize: scaleFontSize(16)},
];
