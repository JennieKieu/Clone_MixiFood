import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from '@rneui/themed';
import React, {useCallback, useRef} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppStackParamList} from '../navigators';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Layout} from '../components/Layout/Layout';
import {style} from '../theme';
import {useTranslation} from 'react-i18next';

const Test: React.FC<
  NativeStackScreenProps<AppStackParamList, 'TestScreen'>
> = props => {
  const {t} = useTranslation();

  return (
    <Layout safeAreaOnBottom style={style.flex_1}>
      <Text style={[{color: 'red'}]} h1 h1Style={$text}>
        Header0
      </Text>
      <Text>{t('common.hi')}</Text>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('SplashScreen')}>
        <Text>Click</Text>
      </TouchableOpacity>
    </Layout>
    // <View style={{flex: 1}}>
    //   <Text>hi</Text>
    //   <TouchableOpacity>
    //     <Text>Click</Text>
    //   </TouchableOpacity>
    // </View>
  );
};

const $text: StyleProp<TextStyle> = [
  style.mb_xs,
  style.tx_color_primary5,
  style.tx_font_bold,
];

export default Test;
