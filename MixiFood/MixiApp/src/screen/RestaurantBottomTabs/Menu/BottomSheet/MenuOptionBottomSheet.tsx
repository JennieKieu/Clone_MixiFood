import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useThemeContext} from '../../../../contexts/ThemeContext';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {SImageStyle, STextStyle, SViewStyle} from '../../../../models';
import {palette, scale, scaleFontSize, spacing, style} from '../../../../theme';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../../assets/lottieAnimation';
import {Button, Text} from '@rneui/themed';
import {BottomSheetDefaultFooterProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import {AppInput} from '../../../../components/AppInput';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {TEditFood} from '../../../../api/api.types';
import {Validators} from '../../../../utils/Validate';
import {TFood} from '../../../../models/food';
import {formatPrice} from '../../../../utils/number';
import {useLoader} from '../../../../contexts/loader-provider';
import {ELoaderType} from '../../../../components/AppLoader';
import {restaurantApi} from '../../../../api/restaurantApi';
import {useAppDispatch} from '../../../../hooks';
import {createOrEditFood} from '../../../../store';

type MenuOptionBottomSheet = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
  handleDelete: () => void;
  handleEdit: () => void;
  isEditAction: boolean;
  handleDismiss: () => void;
  food?: TFood;
} & Omit<BottomSheetModalProps, 'children'>;

export const MenuOptionsBottomSheet: React.FC<MenuOptionBottomSheet> = ({
  bottomSheetModalRef,
  snapPoints,
  handleDelete,
  handleEdit,
  isEditAction,
  handleDismiss,
  food,
  ...rest
}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const [foodImage, setFoodImage] = useState<Asset>();
  const loader = useLoader();

  const dispatch = useAppDispatch();

  const formik = useFormik<TEditFood>({
    initialValues: {
      _id: food?._id || '',
      name: '',
      price: (food && food.price.toString()) || '',
      unit: food?.unit || '',
      isRemoveBg: true,
    },
    validationSchema: yup.object().shape({
      name: Validators.foodName(t),
      price: Validators.foodPrice(t),
    }),
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      loader.show(ELoaderType.foodLoader1);
      const data: TEditFood = {
        _id: values._id,
        name: values.name,
        price: values.price,
        unit: values.unit,
        isRemoveBg: values.isRemoveBg,
      };

      try {
        const response = await restaurantApi.updateFood(data, foodImage);

        if (response.data.success) {
          const food: TFood = response.data.food;
          dispatch(createOrEditFood([food]));
          Alert.alert(t('common.success'), 'Edit food success !');
          bottomSheetModalRef.current?.close();
          loader.hide();
        }
      } catch (error) {
        console.log(error);
        loader.hide();
      }
    },
    enableReinitialize: true,
  });

  const renderFooter = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={24} style={style.mx_sm}>
        <Button
          type="solid"
          title={t('menuFoodScreen.menuOptionsBottomSheet.edit')}
          onPress={formik.submitForm}
          disabled={!formik.isValid}
        />
      </BottomSheetFooter>
    ),
    [formik.isValid],
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
      snapPoints={isEditAction ? snapPoints : undefined}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing={!isEditAction ? true : false}
      backgroundStyle={{backgroundColor: colorScheme.background}}
      handleIndicatorStyle={{backgroundColor: colorScheme.text}}
      footerComponent={isEditAction ? renderFooter : undefined}
      onDismiss={handleDismiss}>
      <BottomSheetScrollView>
        {isEditAction ? (
          <View style={$modalContent}>
            <View style={style.mx_sm}>
              <AppInput
                isBottomSheetTextInput
                label={t('input.foodName.label')}
                value={formik.values.name || food?.name}
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
                value={formik.values.unit.toString() || food?.unit}
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
                  <Image
                    source={{uri: foodImage?.uri}}
                    style={$foodImg}></Image>
                ) : (
                  <Text>Select Image</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.row, style.align_center]}
                onPress={handleIsRemoveBg}>
                {/* <CheckBox checked checkedColor="red"></CheckBox> */}
                <TouchableOpacity
                  style={$checkboxBtn}
                  onPress={handleIsRemoveBg}>
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
                  style={[
                    {fontSize: scaleFontSize(12), color: palette.gray12},
                  ]}>
                  Use automatic photo background removal
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={$modalContent}>
            <View style={$content}>
              <TouchableOpacity style={$optionBtn} onPress={handleEdit}>
                <LottieView
                  source={lottieAnmiations.edit1}
                  autoPlay
                  style={$icon}></LottieView>
                <View style={$section}>
                  <Text style={$optionBtnText}>
                    {t('menuFoodScreen.menuOptionsBottomSheet.edit')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={$optionBtn} onPress={handleDelete}>
                <LottieView
                  source={lottieAnmiations.trashDelete1}
                  autoPlay
                  style={$icon}></LottieView>
                <View style={$section}>
                  <Text style={$optionBtnText}>
                    {t('menuFoodScreen.menuOptionsBottomSheet.delete')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const $modalContent: SViewStyle = [
  {borderTopLeftRadius: spacing.md, borderTopRightRadius: spacing.md},
  style.overflow_hidden,
];
const $content: SViewStyle = [style.pb_md, style.mx_md];
const $optionBtn: SViewStyle = [
  style.row_between,
  style.align_center,
  style.mb_md,
];
const $icon: SViewStyle = [
  {width: scale.x(40, 40 * 1.5), height: scale.x(40, 40 * 1.5)},
];
const $section: SViewStyle = [
  {width: '85%', borderBottomWidth: 1.5, borderColor: '#ccc'},
];
const $optionBtnText: STextStyle = [
  {fontSize: scaleFontSize(18, 18 * 1.5), paddingBottom: 4},
  style.tx_font_bold,
];
const $textLabel: STextStyle = [
  {fontSize: scaleFontSize(10), color: palette.gray12},
  style.mb_xxxs,
];
const $foodImg: SImageStyle = [
  {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
];
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
