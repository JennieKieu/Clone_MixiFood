import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useLayoutEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {Alert, Keyboard, TouchableOpacity, View} from 'react-native';
import {
  STextStyle,
  SViewStyle,
  TSeating,
  TSeatingForStore,
} from '../../../../models';
import {scale, scaleFontSize, spacing, style} from '../../../../theme';
import LottieView from 'lottie-react-native';
import {Button, Text} from '@rneui/themed';
import {lottieAnmiations} from '../../../../../assets/lottieAnimation';
import {EAddSeatBottomSheetAction} from '../SeatingScreen';
import {BottomSheetDefaultFooterProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import {AppInput} from '../../../../components/AppInput';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {Validators} from '../../../../utils/Validate';
import {useLoader} from '../../../../contexts/loader-provider';
import {ELoaderType} from '../../../../components/AppLoader';
import {restaurantApi} from '../../../../api/restaurantApi';
import {useAppDispatch} from '../../../../hooks';
import {createOrEditSeating} from '../../../../store';

type AddSeatBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
  isAddBottomSheetAction: EAddSeatBottomSheetAction;
  handleAddOne: () => void;
  handleAddMulti: () => void;
  handleDismiss: () => void;
} & Omit<BottomSheetModalProps, 'children'>;

export const AddSeatBottomSheet: React.FC<AddSeatBottomSheetProps> = ({
  bottomSheetModalRef,
  snapPoints,
  isAddBottomSheetAction,
  handleAddOne,
  handleAddMulti,
  handleDismiss,
  ...rest
}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const {show, hide} = useLoader();
  const dispatch = useAppDispatch();

  const addOneFormik = useFormik<TSeating>({
    initialValues: {
      seatName: '',
      maxOfPeople: 2,
    },
    validationSchema: yup.object().shape({
      seatName: Validators.seatName(t),
      maxOfPeople: Validators.maxOfPeople(t),
    }),
    onSubmit: async (values, {setErrors}) => {
      bottomSheetModalRef.current?.dismiss();
      show(ELoaderType.foodLoader1);
      const data: TSeating = {
        maxOfPeople: Number(values.maxOfPeople),
        seatName: values.seatName,
      };
      console.log('data', data);

      try {
        const response = await restaurantApi.createOneSeat(data);
        console.log(response.data);
        if (response.data.seat) {
          const seat: TSeatingForStore = response.data.seat;
          dispatch(createOrEditSeating([seat]));
          Alert.alert(t('common.success'));
          hide();
        }
      } catch (error) {
        console.log(error);
        Alert.alert(t('common.fail'), t('errorMessage.internet'));

        hide();
      }
    },
    validateOnMount: true,
  });

  const addMultiFormik = useFormik({
    initialValues: {
      numberSeat: 0,
    },
    validationSchema: yup.object().shape({
      numberSeat: Validators.numberSeatGenerater(t),
    }),
    onSubmit: async (values, {setErrors}) => {
      Keyboard.dismiss();
      bottomSheetModalRef.current?.dismiss();
      show(ELoaderType.foodLoader1);

      try {
        const response = await restaurantApi.createMultiSeats(
          values.numberSeat,
        );
        // console.log(response.data.seats);
        if (response.data.seats) {
          const data: TSeatingForStore[] = response.data.seats;
          dispatch(createOrEditSeating(data));
          Alert.alert(t('common.success'));
          hide();
        }
        hide();
      } catch (error) {
        console.log(error);
        hide();
        Alert.alert(t('common.fail'), t('errorMessage.internet'));
      }
    },
    validateOnMount: true,
  });

  const renderFooter = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={24} style={style.mx_sm}>
        <Button
          type="solid"
          title={t('common.confirm')}
          disabled={
            isAddBottomSheetAction === EAddSeatBottomSheetAction.ADDONE
              ? !addOneFormik.isValid
              : isAddBottomSheetAction === EAddSeatBottomSheetAction.ADDMULTI &&
                !addMultiFormik.isValid
          }
          onPress={
            isAddBottomSheetAction === EAddSeatBottomSheetAction.ADDONE
              ? addOneFormik.submitForm
              : addMultiFormik.submitForm
          }
        />
      </BottomSheetFooter>
    ),
    [addOneFormik.isValid, isAddBottomSheetAction, addMultiFormik.isValid],
  );

  const renderContent = (input: EAddSeatBottomSheetAction) => {
    switch (input) {
      case EAddSeatBottomSheetAction.DEFAULT:
        return (
          <View style={$content}>
            <TouchableOpacity style={$optionBtn} onPress={handleAddMulti}>
              <LottieView
                source={lottieAnmiations.add3}
                autoPlay
                style={$icon}></LottieView>
              <View style={$section}>
                <Text style={$optionBtnText}>
                  {t('seatingScreen.addSeatBottomSheet.addMulti')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={$optionBtn} onPress={handleAddOne}>
              <LottieView
                source={lottieAnmiations.addOne}
                autoPlay
                style={$icon}></LottieView>
              <View style={$section}>
                <Text style={$optionBtnText}>
                  {t('seatingScreen.addSeatBottomSheet.addOne')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      case EAddSeatBottomSheetAction.ADDONE:
        return (
          <View style={$content}>
            <AppInput
              isBottomSheetTextInput
              label={t('input.seatName.label')}
              placeholder={t('input.seatName.placeholder')}
              value={addOneFormik.values.seatName}
              onChangeText={addOneFormik.handleChange('seatName')}
              onBlur={addOneFormik.handleBlur('seatName')}
              errorMessage={
                addOneFormik.touched.seatName && addOneFormik.errors.seatName
                  ? addOneFormik.errors.seatName
                  : undefined
              }
            />
            <View style={style.my_sm}></View>
            <AppInput
              keyboardType="numeric"
              isBottomSheetTextInput
              label={t('input.maxPeople.label')}
              placeholder={t('input.maxPeople.placeholder')}
              value={addOneFormik.values.maxOfPeople.toString()}
              onChangeText={addOneFormik.handleChange('maxOfPeople')}
              onBlur={addOneFormik.handleBlur('maxOfPeople')}
              errorMessage={
                addOneFormik.touched.maxOfPeople &&
                addOneFormik.errors.maxOfPeople
                  ? addOneFormik.errors.maxOfPeople
                  : undefined
              }
            />
            <View style={style.my_sm}></View>
          </View>
        );
      case EAddSeatBottomSheetAction.ADDMULTI:
        return (
          <View style={$content}>
            <AppInput
              isBottomSheetTextInput
              label={t('input.createMultiSeat.label')}
              placeholder={t('input.createMultiSeat.placeholder')}
              keyboardType="numeric"
              value={addMultiFormik.values.numberSeat.toString()}
              onChangeText={addMultiFormik.handleChange('numberSeat')}
              onBlur={addMultiFormik.handleBlur('numberSeat')}
              errorMessage={
                addMultiFormik.touched.numberSeat &&
                addMultiFormik.errors.numberSeat
                  ? addMultiFormik.errors.numberSeat
                  : undefined
              }
            />
          </View>
        );
    }
  };

  return (
    <BottomSheetModal
      {...rest}
      ref={bottomSheetModalRef}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      snapPoints={
        isAddBottomSheetAction !== EAddSeatBottomSheetAction.DEFAULT
          ? snapPoints
          : undefined
      }
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing={
        isAddBottomSheetAction === EAddSeatBottomSheetAction.DEFAULT
          ? true
          : false
      }
      backgroundStyle={{backgroundColor: colorScheme.background}}
      handleIndicatorStyle={{
        backgroundColor: colorScheme.text,
      }}
      onDismiss={handleDismiss}
      footerComponent={
        isAddBottomSheetAction !== EAddSeatBottomSheetAction.DEFAULT
          ? renderFooter
          : undefined
      }>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          {renderContent(isAddBottomSheetAction)}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
];
const $content: SViewStyle = [style.pb_md, style.mx_md];
const $icon: SViewStyle = [
  {width: scale.x(40, 40 * 1.5), height: scale.x(40, 40 * 1.5)},
];
const $optionBtnText: STextStyle = [
  {fontSize: scaleFontSize(18, 18 * 1.5), paddingBottom: 4},
  style.tx_font_bold,
];
const $optionBtn: SViewStyle = [
  style.row_between,
  style.align_center,
  style.mb_md,
];
const $section: SViewStyle = [
  {width: '85%', borderBottomWidth: 1.5, borderColor: '#ccc'},
];
