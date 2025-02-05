import React, {
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Layout} from '../../../components/Layout/Layout';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {AppRestaurantBottomTabbarParamList} from '../../../navigators';
import {ScrollView} from 'react-native-gesture-handler';
import {Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import {STextStyle, SViewStyle} from '../../../models';
import {scale, scaleFontSize, spacing, style} from '../../../theme';
import {Text} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../assets/lottieAnimation';
import {Button} from '@rneui/base';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {AddSeatBottomSheet} from './BottomSheets/AddSeatBottomSheet';
import {useFetchSeating} from '../../../hooks/Seating';
import {useAppSelector} from '../../../hooks';
import {selectSeatings} from '../../../store';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {AppInput} from '../../../components/AppInput';
import {useThemeContext} from '../../../contexts/ThemeContext';

export enum EAddSeatBottomSheetAction {
  'DEFAULT',
  'ADDMULTI',
  'ADDONE',
}

export const SeatingScreen: React.FC<
  BottomTabScreenProps<AppRestaurantBottomTabbarParamList, 'Seating'>
> = props => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const AddSeatBottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [Platform.OS === 'android' ? '50%' : '50%'],
    [],
  );
  const [search, setSearch] = useState<string>('');
  const [isAddBottomSheetAction, setIsAddBottomSheetAction] =
    useState<EAddSeatBottomSheetAction>(EAddSeatBottomSheetAction.DEFAULT);
  const seatings = useAppSelector(selectSeatings);
  useFetchSeating([]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: t('appBottomTabbar.restaurant.seating.title'),
      headerRight: () => (
        <Button
          type="clear"
          onPress={() => AddSeatBottomSheetRef.current?.present()}>
          <LottieView
            source={lottieAnmiations.add3}
            autoPlay
            style={$addAnimated}></LottieView>
        </Button>
      ),
    });
  }, [props.navigation]);

  const handleAddMultiOnBottomSheet = () => {
    setIsAddBottomSheetAction(EAddSeatBottomSheetAction.ADDMULTI);
  };

  const handleAddOneOnBottomSheet = () => {
    setIsAddBottomSheetAction(EAddSeatBottomSheetAction.ADDONE);
  };

  const handleAddBottomShetDismiss = () => {
    setIsAddBottomSheetAction(EAddSeatBottomSheetAction.DEFAULT);
  };

  const filterSeat = useMemo(() => {
    return search.length !== 0
      ? seatings.filter(x =>
          x.seatName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : seatings;
  }, [seatings, search]);

  return (
    <Layout>
      <View style={[style.mx_sm, style.mb_sm]}>
        <AppInput
          lefttIconImageSource={images.search}
          value={search}
          placeholder={t('input.seatName.placeholder')}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView>
        <View style={$innerContainer}>
          <View style={[style.row_between, style.row_wrap]}>
            {filterSeat.map(seat => (
              <TouchableOpacity
                style={[$seatBtn, {borderColor: colorScheme.text}]}
                key={seat._id}>
                <Text style={$seatNameText}>{seat.seatName}</Text>
                <View style={style.row_center}>
                  <Text style={style.mx_xs}>{seat.maxOfPeople}</Text>
                  <AppImage source={images.users}></AppImage>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <AddSeatBottomSheet
        handleAddMulti={handleAddMultiOnBottomSheet}
        handleDismiss={handleAddBottomShetDismiss}
        handleAddOne={handleAddOneOnBottomSheet}
        isAddBottomSheetAction={isAddBottomSheetAction}
        bottomSheetModalRef={AddSeatBottomSheetRef}
        snapPoints={snapPoints}
      />
    </Layout>
  );
};

const $innerContainer: SViewStyle = [style.mx_sm];
const $seatBtn: SViewStyle = [
  {
    // width: '30%',
    width: scale.x(spacing.screenWidth * 0.25, spacing.screenWidth / 6),
    borderWidth: 1,
    borderRadius: 12,
  },
  style.p_sm,
  style.mb_sm,
  style.center,
];
const $seatNameText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(14)},
  style.tx_center,
  style.pb_sm,
];
const $addAnimated: SViewStyle = [
  {width: scaleFontSize(40), height: scaleFontSize(40)},
];
