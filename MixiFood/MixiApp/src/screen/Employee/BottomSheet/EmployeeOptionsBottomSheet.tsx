import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {Button, Text} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {Alert, Platform, View} from 'react-native';
import {STextStyle, SViewStyle} from '../../../models/Style';
import {scale, scaleFontSize, spacing, style} from '../../../theme';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../../assets/lottieAnimation';
import {AppInput} from '../../../components/AppInput';
import {useCallback, useMemo, useState} from 'react';
import {BottomSheetDefaultFooterProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {AppSelect} from '../../../components/AppSelect/AppSelect';
import {images} from '../../../../assets';
import {EEmployeeRole, TEmployeeSelection} from '../EmployeeScreen.types';
import {useLoader} from '../../../contexts/loader-provider';
import {useFormik} from 'formik';
import {TEditEmployee} from '../../../api/api.types';
import {TEmployee, TEmployeeForStore} from '../../../models';
import * as yup from 'yup';
import {Validators} from '../../../utils/Validate';
import {values} from 'lodash';
import {restaurantApi} from '../../../api/restaurantApi';
import {useAppDispatch} from '../../../hooks';
import {editEmployeeById} from '../../../store';

type EmployeeOptionsBottomSheet = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handleDelete: () => void;
  handleDismiss: () => void;
  snapPoints: string[];
  isEditAction: boolean;
  handleEdit: () => void;
  employee: TEmployee | null;
} & Omit<BottomSheetModalProps, 'children'>;

// animated color: #1cbbff
export const EmployeeOptionsBottomSheet: React.FC<
  EmployeeOptionsBottomSheet
> = ({
  bottomSheetModalRef,
  handleDelete,
  handleDismiss,
  snapPoints,
  isEditAction,
  handleEdit,
  employee = null,
  ...rest
}) => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const loader = useLoader();
  const dispatch = useAppDispatch();

  const [selectRole, setSelecRole] = useState<EEmployeeRole>(
    employee?.restaurantRole || EEmployeeRole.serve,
  );

  const onCancel = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const formik = useFormik<TEditEmployee>({
    initialValues: {
      fullName: employee ? employee.fullName : '',
      password: undefined,
      restaurantRole: selectRole,
      isFullTime: employee?.isFullTime || false,
    },
    validationSchema: yup.object().shape({
      fullName: Validators.fullName(t),
      password: Validators.passwordByEdit(t),
    }),
    onSubmit: async (values, {setErrors}) => {
      loader.show();
      const data: TEditEmployee = {
        fullName: values.fullName,
        restaurantRole: selectRole,
        isFullTime: values.isFullTime,
        password: values.password || undefined,
      };

      try {
        const response = await restaurantApi.editEmployee(
          data,
          employee?._id || '',
        );

        if (response.data.success) {
          const employee: TEmployee = response.data.employee;
          dispatch(
            editEmployeeById({id: employee._id, updatedEmployee: employee}),
          );
          loader.hide();
          Alert.alert(`${t('common.success')}`);
          bottomSheetModalRef.current?.close();
        }
      } catch (error) {
        console.log(error);
        Alert.alert(`${t('common.fail')}`, t('errorMessage.internet'));
        loader.hide();
      }
    },
  });

  const renderFooter = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={24} style={style.mx_sm}>
        <Button
          type="solid"
          title={t('EmployeeScreen.EmployeeOptionsBottomSheet.edit')}
          onPress={formik.submitForm}
          disabled={!formik.isValid}
        />
      </BottomSheetFooter>
    ),
    [formik.isValid],
  );

  const EmployeeRoleSelect: TEmployeeSelection[] = [
    // {
    //   roleName: t('EmployeeRole.manage'),
    //   icon: images.email,
    //   role: EEmployeeRole.manage,
    // },
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
      onDismiss={handleDismiss}
      footerComponent={isEditAction ? renderFooter : undefined}
      backgroundStyle={{backgroundColor: colorScheme.background}}
      handleIndicatorStyle={{backgroundColor: colorScheme.text}}>
      <BottomSheetScrollView>
        {isEditAction ? (
          <View style={$modalContent}>
            <View style={$header}>
              <Text>Edit employee</Text>
            </View>
            <View style={$content}>
              <AppInput
                isBottomSheetTextInput
                label={t('input.fullName.label')}
                // value={formik.values.fullName}
                value={formik.values.fullName || employee?.fullName}
                onChangeText={formik.handleChange('fullName')}
                onBlur={formik.handleBlur('fullName')}
                errorMessage={
                  formik.touched.fullName && formik.errors.fullName
                    ? formik.errors.fullName
                    : undefined
                }
              />
              <View style={style.mb_sm} />
              <AppInput
                isBottomSheetTextInput
                label={t('input.phoneNumber.label')}
                editable={false}
                value={employee?.phoneNumber}
              />
              <View style={style.mb_sm} />
              <AppInput
                isBottomSheetTextInput
                label={t('input.password.label')}
                onBlur={formik.handleBlur('password')}
                errorMessage={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : undefined
                }
                onChangeText={formik.handleChange('password')}
              />
              <View style={style.mb_sm} />
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
        ) : (
          <View style={$modalContent}>
            <View style={$header}>
              <Text>Header</Text>
            </View>
            <View style={$content}>
              <TouchableOpacity style={$optionBtn} onPress={handleEdit}>
                <LottieView
                  source={lottieAnmiations.edit1}
                  autoPlay
                  style={$icon}
                />
                <View style={$section}>
                  <Text style={$optionBtnText}>
                    {t('EmployeeScreen.EmployeeOptionsBottomSheet.edit')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={$optionBtn} onPress={handleDelete}>
                <LottieView
                  source={lottieAnmiations.trashDelete1}
                  autoPlay
                  style={$icon}
                />
                <View style={$section}>
                  <Text style={$optionBtnText}>
                    {t('EmployeeScreen.EmployeeOptionsBottomSheet.delete')}
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
const $header: SViewStyle = [style.center, style.mb_xxs];
const $content: SViewStyle = [style.pb_md, style.mx_md];
const $optionBtn: SViewStyle = [
  style.row_between,
  style.align_center,
  style.mb_md,
];
const $section: SViewStyle = [
  {width: '85%', borderBottomWidth: 1.5, borderColor: '#ccc'},
];
const $optionBtnText: STextStyle = [
  {fontSize: scaleFontSize(18, 18 * 1.5), paddingBottom: 4},
  style.tx_font_bold,
];
const $icon: SViewStyle = [
  {width: scale.x(40, 40 * 1.5), height: scale.x(40, 40 * 1.5)},
];
