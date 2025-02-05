import React, {Dispatch, SetStateAction} from 'react';
import {
  ImageSourcePropType,
  Pressable,
  TextInputProps,
  View,
} from 'react-native';
import SelectDropdown, {
  SelectDropdownProps,
} from 'react-native-select-dropdown';
import {palette, scale, scaleFontSize, style} from '../../theme';
import {Text, ThemeConsumer} from '@rneui/themed';
import {SImageStyle, STextStyle, SViewStyle} from '../../models';
import {AppImage} from '../AppImage';

type AppSelectProps = {
  label?: string;
  data: any;
  selectValue: any;
  setSelectValue: Dispatch<SetStateAction<any>>;
  rightIconImageSource?: ImageSourcePropType;
  openIconSource?: ImageSourcePropType;
  renderItemFieldName: string;
  selectItemFieldName: string;
} & Partial<SelectDropdownProps>;

export const appSelectHeight = scale.y(38, 64);

export class AppSelect extends React.Component<AppSelectProps> {
  private selectRef: React.RefObject<SelectDropdown>;

  constructor(props: AppSelectProps) {
    super(props);
    this.state = {};
    this.selectRef = React.createRef<SelectDropdown>();
  }

  focus() {
    this.selectRef.current?.openDropdown();
  }

  render(): React.ReactNode {
    const height = appSelectHeight;

    return (
      <ThemeConsumer>
        {({theme}) => {
          return (
            <>
              <Text style={$label}>{this.props.label}</Text>
              <Pressable
                style={[
                  $root,
                  {
                    borderWidth: 1,
                    height,
                  },
                ]}
                onPress={() => this.focus()}>
                <SelectDropdown
                  {...this.props}
                  dropdownStyle={{borderRadius: 12}}
                  ref={this.selectRef}
                  data={this.props.data}
                  onSelect={(selectedItem, index) => {
                    this.props.setSelectValue(
                      selectedItem[`${this.props.selectItemFieldName}`],
                    );
                  }}
                  renderButton={(selectedItem, isOpen) => {
                    return (
                      <View style={[$selectButtonContainer, {height}]}>
                        <Text>{this.props.selectValue}</Text>
                        {this.props.rightIconImageSource && isOpen ? (
                          <AppImage
                            style={$rightIcon}
                            source={this.props.rightIconImageSource}></AppImage>
                        ) : (
                          <AppImage
                            source={this.props.openIconSource}
                            style={$rightIcon}></AppImage>
                        )}
                      </View>
                    );
                  }}
                  renderItem={item => {
                    return (
                      <View style={$itemContainer}>
                        <Text>{item[`${this.props.renderItemFieldName}`]}</Text>
                      </View>
                    );
                  }}
                />
              </Pressable>
            </>
          );
        }}
      </ThemeConsumer>
    );
  }
}
const $root: SViewStyle = [{borderRadius: 12}];
const $label: STextStyle = [
  {fontSize: scaleFontSize(10, 10 * 1.5), color: palette.gray12},
  style.mb_xxxs,
];
const $selectButtonContainer: SViewStyle = [
  {width: '100%'},
  style.justify_center,
  style.px_sm,
  style.row_between,
];
const $rightIcon: SImageStyle = [
  {width: 20, height: 20, resizeMode: 'contain'},
];
const $itemContainer: SViewStyle = [
  {borderBottomWidth: 1},
  style.p_sm,
  style.row,
];
