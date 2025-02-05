import React, {useLayoutEffect} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {Layout} from '../../../components/Layout/Layout';
import {palette, spacing, style} from '../../../theme';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  AppStackParamList,
  AppUserBottomTabbarParamList,
} from '../../../navigators';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {Text} from '@rneui/themed';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import Animated from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import {SViewStyle} from '../../../models';

export const HomeScreen: React.FC<
  CompositeScreenProps<
    BottomTabScreenProps<AppUserBottomTabbarParamList, 'Home'>,
    NativeStackScreenProps<AppStackParamList>
  >
> = props => {
  const {colorScheme} = useThemeContext();

  const gotoNext = (tag: string) => {
    // props.navigation.navigate('')
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: colorScheme.grayBackgroundColor,
      },
      headerShown: true,
      headerRight: () => (
        <Pressable style={style.mr_sm}>
          <Animated.View
            sharedTransitionTag="searchside"
            style={[{marginTop: 0, borderRadius: 10}]}>
            <AppImage source={images.search}></AppImage>
          </Animated.View>
        </Pressable>
      ),
    });
  }, []);

  return (
    <Layout backgroundColor={colorScheme.grayBackgroundColor}>
      <ScrollView>
        <View style={style.mx_sm}>
          <TouchableOpacity
            style={[$adsRestaurant, {backgroundColor: colorScheme.background}]}>
            <Text>Restaurant name</Text>
            <Text style={style.my_sm}>Descriptions</Text>
            <View style={style.row_between}>
              <View style={style.row_center}>
                <View style={[{width: 90}, style.row]}>
                  <View
                    style={[
                      {
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        backgroundColor: 'red',
                      },
                      style.abs,
                    ]}></View>
                  <View
                    style={[
                      {
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        backgroundColor: 'red',
                      },
                    ]}></View>
                  <View
                    style={[
                      {
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        backgroundColor: 'red',
                      },
                    ]}></View>
                </View>

                <View
                  style={[
                    style.p_xxs,
                    style.ml_sm,
                    {
                      backgroundColor: palette.primary4,
                      borderRadius: spacing.xs,
                    },
                  ]}>
                  <Text>150.000 VND</Text>
                </View>
              </View>
              <View>
                <Text>add icon</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};

const $adsRestaurant: SViewStyle = [style.p_md, {borderRadius: spacing.md}];
