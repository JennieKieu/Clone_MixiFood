import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {Image, TouchableOpacity, View} from 'react-native';
import {SImageStyle, STextStyle, SViewStyle} from '../../../../models';
import {palette, scaleFontSize, spacing, style} from '../../../../theme';
import {AppInput} from '../../../../components/AppInput';
import {Button, Text} from '@rneui/themed';
import {BottomSheetDefaultFooterProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../../assets/lottieAnimation';
import {useFormik} from 'formik';
import {TCreateFood} from '../../../../api/api.types';

type AddFoodBottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
  formik: ReturnType<typeof useFormik<TCreateFood>>;
  foodImage?: Asset;
  setFoodImage: React.Dispatch<React.SetStateAction<Asset | undefined>>;
} & Omit<BottomSheetModalProps, 'children'>;

export const AddFoodBottomSheet: React.FC<AddFoodBottomSheetProps> = ({
  bottomSheetModalRef,
  snapPoints,
  formik,
  foodImage,
  setFoodImage,
  ...rest
}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  //   const [foodImage, setFoodImage] = useState<Asset>();

  const renderFooter = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={14} style={style.mx_sm}>
        <Button
          type="solid"
          title={t('MenuScreen.addFoodBottomSheet.add')}
          disabled={!formik.isValid || !foodImage}
          onPress={formik.submitForm}
        />
      </BottomSheetFooter>
    ),
    [formik.isValid, foodImage],
  );

  const handleOpenLibary = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 1,
        assetRepresentationMode: 'current',
      },
      response => {
        if (response.didCancel) {
          setFoodImage(undefined);
        } else if (response.errorCode) {
          console.log(response.errorCode);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0]; // Lấy đường dẫn của ảnh được chọn
          setFoodImage(selectedImage); // Lưu ảnh đã chọn vào state
          //   console.log('sdsd', selectedImage);
        }
      },
    );
  };

  const handleIsRemoveBg = () => {
    const currentValue = formik.values.isRemoveBg;
    formik.setFieldValue(
      'isRemoveBg',
      currentValue === undefined ? true : undefined,
    );
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
      enablePanDownToClose
      enableDismissOnClose
      //   enableDynamicSizing
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: colorScheme.text}}
      backgroundStyle={{
        backgroundColor: colorScheme.background,
      }}
      footerComponent={renderFooter}>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          <View style={$innerContainer}>
            <AppInput
              isBottomSheetTextInput
              label={t('input.foodName.label')}
              placeholder={t('input.foodName.placeholder')}
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              errorMessage={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : undefined
              }
            />
            <View style={style.mb_sm} />
            <AppInput
              isBottomSheetTextInput
              label={t('input.foodUnit.label')}
              placeholder={t('input.foodUnit.placeholder')}
              value={formik.values.unit}
              onChangeText={formik.handleChange('unit')}
              onBlur={formik.handleBlur('unit')}
              errorMessage={
                formik.touched.unit && formik.errors.unit
                  ? formik.errors.unit
                  : undefined
              }
            />
            <View style={style.mb_sm} />
            <AppInput
              keyboardType="numeric"
              isBottomSheetTextInput
              label={t('input.foodPrice.label')}
              placeholder={t('input.foodPrice.placeholder')}
              value={formik.values.price}
              onChangeText={formik.handleChange('price')}
              onBlur={formik.handleBlur('price')}
              errorMessage={
                formik.touched.price && formik.errors.price
                  ? formik.errors.price
                  : undefined
              }
            />
            <View style={style.mb_sm} />
            <Text style={$textLabel}>selected food image</Text>
            <TouchableOpacity
              onPress={handleOpenLibary}
              style={[
                {
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  height: 150,
                  borderRadius: 8,
                },
                style.center,
              ]}>
              {foodImage ? (
                <Image source={{uri: foodImage?.uri}} style={$foodImg}></Image>
              ) : (
                <Text>Select Image</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.row, style.align_center]}
              onPress={handleIsRemoveBg}>
              {/* <CheckBox checked checkedColor="red"></CheckBox> */}
              <TouchableOpacity style={$checkboxBtn} onPress={handleIsRemoveBg}>
                {formik.values.isRemoveBg && (
                  <LottieView
                    source={lottieAnmiations.checkBox}
                    autoPlay
                    style={{width: '140%', height: '140%'}}
                    resizeMode="contain"
                    loop={false}
                    speed={1.5}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={[{fontSize: scaleFontSize(12), color: palette.gray12}]}>
                Use automatic photo background removal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
];
const $innerContainer: SViewStyle = [style.mx_sm];
const $checkboxBtn: SViewStyle = [
  {
    width: scaleFontSize(25),
    height: scaleFontSize(25),
    borderWidth: 0.5,
    borderRadius: 25,
  },
  style.center,
  style.my_sm,
  style.mr_sm,
];
const $foodImg: SImageStyle = [
  {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
];
const $textLabel: STextStyle = [
  {fontSize: scaleFontSize(10), color: palette.gray12},
  style.mb_xxxs,
];
