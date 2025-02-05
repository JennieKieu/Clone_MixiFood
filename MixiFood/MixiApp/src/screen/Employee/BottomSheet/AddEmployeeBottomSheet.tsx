import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {Alert, Keyboard, View} from 'react-native';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models/Style';
import {scaleFontSize, spacing, style} from '../../../theme';
import {Button, Text} from '@rneui/themed';
import {AppInput, appInputHeight} from '../../../components/AppInput';
import SelectDropdown from 'react-native-select-dropdown';
import {EEmployeeRole, TEmployeeSelection} from '../EmployeeScreen.types';
import {JSX, useCallback, useEffect, useMemo, useState} from 'react';
import {BottomSheetDefaultFooterProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import {images} from '../../../../assets';
import {AppImage} from '../../../components/AppImage';
import {AppSelect} from '../../../components/AppSelect/AppSelect';
import {useFormik} from 'formik';
import {ERestaurantRole, TCreateEmployee} from '../../../api/api.types';
import * as yup from 'yup';
import {Validators} from '../../../utils/Validate';
import {useLoader} from '../../../contexts/loader-provider';
import {ELoaderType} from '../../../components/AppLoader';
import {delay} from '../../../utils';
import {restaurantApi} from '../../../api/restaurantApi';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {createOrEditEmployee, selectUserId} from '../../../store';
import {AxiosError} from 'axios';
import {useFetchEmployee} from '../../../hooks/Employee';
import {TEmployee} from '../../../models';
import {useThemeContext} from '../../../contexts/ThemeContext';

type AddEmployeeBottomSheet = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
} & Omit<BottomSheetModalProps, 'children'>;

export const AddEmployeeBottomSheet: React.FC<AddEmployeeBottomSheet> = ({
  bottomSheetModalRef,
  snapPoints,
  ...rest
}) => {
  const {t} = useTranslation();
  const {isVisible, show, hide} = useLoader();
  const {colorScheme} = useThemeContext();
  const selectUserIdd = useAppSelector(selectUserId);
  const dispatch = useAppDispatch();

  const [selectRole, setSelecRole] = useState<EEmployeeRole>(
    EEmployeeRole.serve,
  );

  const EmployeeRoleSelect: TEmployeeSelection[] = [
    {
      roleName: t('EmployeeRole.manage'),
      icon: images.email,
      role: EEmployeeRole.manage,
    },
    {
      roleName: t('EmployeeRole.security'),
      icon: images.email,
      role: EEmployeeRole.security,
    },
    {
      roleName: t('EmployeeRole.serve'),
      icon: images.email,
      role: EEmployeeRole.serve,
    },
    {
      roleName: t('EmployeeRole.chef'),
      icon: images.eye,
      role: EEmployeeRole.chef,
    },
  ];

  const formik = useFormik<TCreateEmployee>({
    initialValues: {
      fullName: 'nhen nhen no way home',
      phoneNumber: '0339122327',
      password: '12345678',
      restaurantRole: selectRole,
    },
    validationSchema: yup.object().shape({
      fullName: Validators.fullName(t),
      phoneNumber: Validators.phoneNumber(t),
      password: Validators.password(t),
    }),
    onSubmit: async (values, {setErrors}) => {
      show(ELoaderType.animation1);

      const data: TCreateEmployee = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        password: values.password,
        restaurantRole: selectRole,
      };

      try {
        const response = await restaurantApi.createEmployee(
          selectUserIdd,
          data,
        );
        console.log(response.data);
        if (response.data.success) {
          const employee: TEmployee = response.data.employee;
          console.log('employee111', employee);
          Alert.alert(
            t('success'),
            t(
              'EmployeeScreen.AddEmployeeBottomSheet.addSuccess',
              t('common.ok'),
            ),
          );
          bottomSheetModalRef.current?.close();
          dispatch(createOrEditEmployee([employee]));
        }

        hide();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 409) {
            setErrors({
              phoneNumber: t('errorMessage.input.phoneNumberUsed'),
            });
          } else {
            Alert.alert('error');
          }
        }
        hide();
      }
    },
    validateOnMount: true,
  });

  const renderFooter = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={24} style={style.mx_sm}>
        <Button
          type="solid"
          title={t('EmployeeScreen.EmployeeOptionsBottomSheet.add')}
          disabled={!formik.isValid}
          onPress={formik.submitForm}
        />
      </BottomSheetFooter>
    ),
    [formik.isValid],
  );

  const handleAddEmployee = async () => {
    show(ELoaderType.default);
    delay(10000);
    hide();
  };

  useMemo(() => {
    bottomSheetModalRef.current?.snapToIndex(0);
  }, [Keyboard.isVisible()]);

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
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      backgroundStyle={{backgroundColor: colorScheme.background}}
      // enableDynamicSizing
      footerComponent={renderFooter}
      // keyboardBehavior="interactive"
      handleIndicatorStyle={{backgroundColor: colorScheme.text}}>
      <BottomSheetScrollView>
        <View style={$modalContent}>
          <View style={$header}>
            <Text style={$headerText}>
              {t('EmployeeScreen.AddEmployeeBottomSheet.title')}
            </Text>
          </View>
          <View style={$innerContainer}>
            <AppInput
              isBottomSheetTextInput={true}
              placeholder={t('input.fullName.placeholder')}
              label={t('input.fullName.label')}
              value={formik.values.fullName}
              onChangeText={formik.handleChange('fullName')}
              onBlur={formik.handleBlur('fullName')}
              errorMessage={
                formik.touched.fullName && formik.errors.fullName
                  ? formik.errors.fullName
                  : undefined
              }
            />
            <View style={style.mt_sm}></View>
            <AppInput
              isBottomSheetTextInput={true}
              placeholder={t('input.phoneNumber.placeholder')}
              label={t('input.phoneNumber.label')}
              value={formik.values.phoneNumber}
              keyboardType="numeric"
              onChangeText={formik.handleChange('phoneNumber')}
              onBlur={formik.handleBlur('phoneNumber')}
              errorMessage={
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? formik.errors.phoneNumber
                  : undefined
              }
            />
            <View style={style.mt_sm}></View>
            <AppInput
              isBottomSheetTextInput={true}
              placeholder={t('input.password.placeholder')}
              label={t('input.password.label')}
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              errorMessage={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
            />
            <View style={style.mt_sm}></View>
            {/* <SelectDropdown
              dropdownStyle={{borderRadius: 10}}
              data={EmployeeRoleSelect}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem.role, index);
                setSelecRole(selectedItem.roleName);
              }}
              renderButton={(selectedItem, isOpened) => {
                const selectItem = EmployeeRoleSelect.find(
                  item => item.role === selectRole,
                );

                return (
                  <View style={$selectionContainer}>
                    {selectRole ? (
                      <Text>{selectItem?.roleName || selectRole}</Text>
                    ) : (
                      <Text>select</Text>
                    )}
                    <AppImage
                      style={{width: 20, height: 20, resizeMode: 'contain'}}
                      source={
                        isOpened ? images.chevron_left : images.chevron_down
                      }></AppImage>
                  </View>
                );
              }}
              renderItem={item => {
                return (
                  <View style={[{borderBottomWidth: 1}, style.p_sm, style.row]}>
                    <AppImage
                      source={images.email}
                      style={$selectItemIcon}></AppImage>
                    <Text style={[style.mx_sm]}>{item.roleName}</Text>
                  </View>
                );
              }}
            /> */}

            <AppSelect
              label={t('common.selectRole')}
              data={EmployeeRoleSelect}
              selectValue={selectRole}
              setSelectValue={setSelecRole}
              rightIconImageSource={images.chevron_left}
              openIconSource={images.chevron_down}
              renderItemFieldName={'roleName'}
              selectItemFieldName={'role'}
            />
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
const $header: SViewStyle = [style.center, style.mb_xxs];
const $innerContainer: SViewStyle = [style.mx_sm];

const $selectionContainer: SViewStyle = [
  {borderWidth: 1, width: '100%', height: appInputHeight, borderRadius: 12},
  style.justify_center,
  style.px_sm,
  style.row_between,
];
const $selectItemIcon: SImageStyle = [{width: 20, height: 20}];
const $headerText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(16)},
];
