import Animated, {
  AnimatedStyle,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {SViewStyle} from '../../../../models';
import {palette, scaleFontSize, spacing, style} from '../../../../theme';
import {
  Image,
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Dispatch, RefObject, SetStateAction, useEffect, useState} from 'react';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {images} from '../../../../../assets';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {insert} from 'formik';
import {Text} from '@rneui/themed';
import {TSuggestionData} from '../ConfirmLocationMapScreen';

type SearchLocationProps = {
  inputRef: RefObject<TextInput>;
  searchValue: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  handleBackOrFocusSearch: () => void;
  isInputFocused: boolean;
  setIsInputFocused: Dispatch<SetStateAction<boolean>>;
  translateY: SharedValue<number>;
  searchResults: TSuggestionData[];
  handleSearchItem: (mapbox_id: string) => void;
  RightChildren?: React.JSX.Element;
  animatedStyle?: AnimatedStyle<{
    transform: {
      translateY: number;
    }[];
    opacity: number;
  }>;
};

export const SearchLocation: React.FC<SearchLocationProps> = ({
  inputRef,
  setSearchText,
  searchValue,
  handleBackOrFocusSearch,
  isInputFocused,
  setIsInputFocused,
  translateY,
  searchResults,
  handleSearchItem,
  RightChildren,
  animatedStyle,
  ...rest
}) => {
  const insert = useSafeAreaInsets();
  const [searchHeight, setSearchHeight] = useState<number>(0); // Tạo state lưu chiều cao

  const handleLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setSearchHeight(height + insert.top); // Lưu chiều cao khi layout
  };

  useEffect(() => {
    translateY.value = withTiming(isInputFocused ? 0 : -100, {
      duration: 100, // Thời gian hiệu ứng (200ms)
    });
  }, [isInputFocused]);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         translateY: translateY.value, // Điều chỉnh vị trí theo trục Y
  //       },
  //     ],
  //     opacity: withTiming(isInputFocused ? 1 : 0, {duration: 200}),
  //   };
  // });

  return (
    <>
      <Animated.View
        onLayout={handleLayout}
        style={[
          $root,
          {top: Platform.OS === 'ios' ? insert.top : spacing.xs},
          !isInputFocused
            ? style.shadow
            : {
                borderWidth: 1,
                borderColor: palette.gray5,
              },
          animatedStyle && animatedStyle,
        ]}>
        <View style={[style.row_between]}>
          <TouchableOpacity
            onPress={handleBackOrFocusSearch}
            style={style.mx_xs}>
            <Image
              source={!isInputFocused ? images.location : images.angle_left1}
            />
          </TouchableOpacity>
          <View style={style.flex_1}>
            <TextInput
              placeholder="Tìm địa chỉ ở đây"
              value={searchValue}
              ref={inputRef}
              onFocus={() => setIsInputFocused(true)}
              onChangeText={setSearchText}
              style={[style.tx_font_medium, {fontSize: scaleFontSize(14)}]}
            />
          </View>
          {RightChildren}

        </View>
      </Animated.View>

      {isInputFocused && (
        <TouchableWithoutFeedback
          onPress={() => Keyboard.isVisible() && Keyboard.dismiss()}>
          <Animated.View style={[$SearchContainer, animatedStyle]}>
            <View style={[{marginTop: searchHeight}, style.pt_md]}>
              <ScrollView>
                <View style={[style.mx_md]}>
                  {searchResults.map(item => (
                    <TouchableOpacity
                      key={item.mapbox_id}
                      style={$searchResult}
                      onPress={() => handleSearchItem(item.mapbox_id)}>
                      <View>
                        <Image source={images.location} />
                      </View>
                      <View style={$leftViewResult}>
                        <Text>{item.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                          {item.full_address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

const $root: SViewStyle = [
  style.abs,
  {
    zIndex: 100,
    backgroundColor: palette.white,
    borderRadius: 999,
    left: 0,
    right: 0,
  },
  style.p_xs,
  style.mx_sm,
];
const $SearchContainer: SViewStyle = [
  style.abs_fo,
  {zIndex: 99, backgroundColor: palette.white},
];
const $searchResult: SViewStyle = [style.row_between, style.mb_sm];
const $leftViewResult: SViewStyle = [
  style.pb_sm,
  {borderBottomWidth: 1, borderColor: palette.gray5},
  style.flex_1,
  style.mx_sm,
];
