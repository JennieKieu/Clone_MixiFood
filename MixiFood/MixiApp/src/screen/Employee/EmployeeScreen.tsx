import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Layout} from '../../components/Layout/Layout';
import {AppRestaurantBottomTabbarParamList} from '../../navigators/RestaurantBottomTab';
import {SImageStyle, SViewStyle} from '../../models/Style';
import {scale, style} from '../../theme';
import {AppInput, EAppInputBackground} from '../../components/AppInput';
import {Alert, Image, Platform, ScrollView, View} from 'react-native';
import {images} from '../../../assets';
import {Button, Text} from '@rneui/themed';
import {AppImage} from '../../components/AppImage';
import AppDropdown from '../../components/AppDropDown/AppDropdown';
import {EmployeeOptionsBottomSheet} from './BottomSheet/EmployeeOptionsBottomSheet';
import {useTranslation} from 'react-i18next';
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import {lottieAnmiations} from '../../../assets/lottieAnimation';
import {AddEmployeeBottomSheet} from './BottomSheet/AddEmployeeBottomSheet';
import {useFetchEmployee} from '../../hooks/Employee';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {deleteEmployee, selectFullEmployees, selectUserId} from '../../store';
import {AppModal} from '../../components/AppModal';
import {TEmployee} from '../../models';
import {useLoader} from '../../contexts/loader-provider';
import {restaurantApi} from '../../api/restaurantApi';
import {ELoaderType} from '../../components/AppLoader';
import {TEditEmployee} from '../../api/api.types';

// export type TExampleEmployee = {
//   fullName: string;
//   role: string;
// };

export const EmployeeScreen: React.FC<
  BottomTabScreenProps<AppRestaurantBottomTabbarParamList, 'Employee'>
> = props => {
  const {t} = useTranslation();

  const [search, setSearch] = useState<string>('');
  const EmployeeOptionsBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const AddEmployeeBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [Platform.OS === 'android' ? '100%' : '95%'],
    [],
  );
  const {show, hide} = useLoader();

  const restaurantId = useAppSelector(selectUserId);
  const employees = useAppSelector(selectFullEmployees);
  const dispatch = useAppDispatch();

  const [modalDeleteVisible, setModalDeleteVisible] = useState<boolean>(false);
  const [isEditAction, setIsEditAction] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TEmployee | null>(
    null,
  );

  useFetchEmployee([isEditAction]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: t('appBottomTabbar.restaurant.Employee.title'),
      headerRight: () => (
        <Button
          type="clear"
          onPress={() => AddEmployeeBottomSheetModalRef.current?.present()}>
          <LottieView
            source={lottieAnmiations.addUser1}
            autoPlay
            style={$addEmployeeBtn}></LottieView>
        </Button>
      ),
    });
  }, [props.navigation]);

  const handleCancelPressed = () => {
    EmployeeOptionsBottomSheetModalRef.current?.present();
  };

  const onOptionBottomSheetDismiss = () => {
    setIsEditAction(false);
    // setSelectedEmployee(null);
  };

  const handleDeleteOnBottomSheet = () => {
    if (selectedEmployee) {
      EmployeeOptionsBottomSheetModalRef.current?.dismiss();
      setModalDeleteVisible(true);
    }
  };

  const handleEditOnBottomSheet = () => {
    setIsEditAction(true);
  };

  const handleDeleteEmployee = async () => {
    setModalDeleteVisible(false);
    show(ELoaderType.animation1);

    if (selectedEmployee) {
      try {
        const response = await restaurantApi.deleteEmployee(restaurantId, [
          selectedEmployee?._id,
        ]);
        if (response.data.success) {
          dispatch(deleteEmployee(selectedEmployee._id));
          Alert.alert(
            t('common.success'),
            t('EmployeeScreen.modal.deleteSuccess'),
          );
        }

        hide();
      } catch (error) {
        Alert.alert('Error');
        hide();
      }
    }
  };

  const handleEmployeeOption = (employee: TEmployee) => {
    setSelectedEmployee(employee);
    EmployeeOptionsBottomSheetModalRef.current?.present();
  };

  const filterEmployee = useMemo(() => {
    return search.length !== 0
      ? employees.filter(
          x =>
            x.fullName.toLowerCase().includes(search.toLowerCase()) ||
            x._id.toLowerCase().includes(search.toLowerCase()),
        )
      : employees;
  }, [employees, search]);

  return (
    <Layout style={$root}>
      <View style={$innerContainer}>
        <AppInput
          borderRadius={999}
          backgroundColor={EAppInputBackground.SEARCH}
          lefttIconImageSource={images.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search employee by name, role,..."
        />
        <View style={[style.mt_sm, {height: '100%'}]}>
          <View style={$headerTitle}>
            <View style={$leftBtn}>
              <Text>STT</Text>
              <Text style={style.mx_sm}>FUll name</Text>
            </View>
            <View style={$rightBtn}>
              <Text>Role</Text>
              <Text style={style.mx_md}>Status</Text>
            </View>
          </View>
          <ScrollView style={{}} scrollEnabled>
            {filterEmployee.map((emp, index) => (
              <Button
                key={index}
                type="clear"
                buttonStyle={$btn}
                onPress={() => handleEmployeeOption(emp)}>
                <View style={$leftBtn}>
                  <Text>{index + 1}</Text>
                  <View style={[style.row_center, $leftView]}>
                    <Image
                      source={{uri: emp.coverImage}}
                      style={$avatarImg}></Image>
                    <Text>{emp.fullName}</Text>
                  </View>
                </View>
                <View style={$leftBtn}>
                  <Text>{emp.restaurantRole}</Text>
                  <Text style={style.ml_lg}>active</Text>
                </View>
              </Button>
            ))}
            {/* <Button
              type="clear"
              buttonStyle={$btn}
              onPress={() =>
                EmployeeOptionsBottomSheetModalRef.current?.present()
              }>
              <View style={$leftBtn}>
                <Text>1</Text>
                <View style={style.row_center}>
                  <Image source={images.mixiLogo} style={$avatarImg}></Image>
                  <Text>Thanh Thị Đẹt</Text>
                </View>
              </View>
              <View style={$leftBtn}>
                <Text>Manage</Text>
                <Text style={style.ml_lg}>active</Text>
              </View>
            </Button> */}
          </ScrollView>
        </View>
      </View>
      <View style={$addEmployeeBtnn}>
        <Button
          type="clear"
          onPress={() => AddEmployeeBottomSheetModalRef.current?.present()}>
          <LottieView
            source={lottieAnmiations.addUser1}
            autoPlay
            style={$addEmployeeBtn}></LottieView>
        </Button>
      </View>
      <EmployeeOptionsBottomSheet
        handleEdit={handleEditOnBottomSheet}
        isEditAction={isEditAction}
        snapPoints={snapPoints}
        handleDismiss={onOptionBottomSheetDismiss}
        handleDelete={handleDeleteOnBottomSheet}
        bottomSheetModalRef={EmployeeOptionsBottomSheetModalRef}
        employee={selectedEmployee}
      />
      <AddEmployeeBottomSheet
        snapPoints={snapPoints}
        bottomSheetModalRef={
          AddEmployeeBottomSheetModalRef
        }></AddEmployeeBottomSheet>

      <AppModal
        modalVisible={modalDeleteVisible}
        setModalVisible={setModalDeleteVisible}
        title={t('EmployeeScreen.modal.deleteTitle')}
        content={t('EmployeeScreen.modal.deleteContent')}
        handleCancel={() => {
          setModalDeleteVisible(false);
        }}
        handleOk={handleDeleteEmployee}
        btn2Title={t('common.confirm')}></AppModal>
    </Layout>
  );
};

const $root: SViewStyle = [style.flex_1];
const $innerContainer: SViewStyle = [style.mx_md];
const $btn: SViewStyle = [
  style.row_between,
  {width: '100%', height: scale.x(45, 45 * 1.5)},
  style.my_sm,
];
const $avatarImg: SImageStyle = [
  {
    width: scale.x(35, 60),
    resizeMode: 'cover',
    height: scale.y(35, 60),
    borderRadius: 999,
    overflow: 'hidden',
    marginHorizontal: scale.x(12, 10 * 1.5),
  },
];
const $leftBtn: SViewStyle = [style.row_between, style.align_center];
const $headerTitle: SViewStyle = [style.row_between];
const $rightBtn: SViewStyle = [$leftBtn, style.justify_between, {width: '40%'}];
const $addEmployeeBtn: SViewStyle = [
  {width: scale.x(50, 50 * 1.5), height: scale.y(50, 50 * 1.5)},
  style.mx_sm,
];
const $addEmployeeBtnn: SViewStyle = [
  style.abs,
  {
    width: scale.x(50, 50 * 1.5),
    height: scale.y(50, 50 * 1.5),
    bottom: scale.y(100, 100 * 1.5),
    right: scale.x(15, 15 * 1.5),
  },
  style.mx_md,
];

const $leftView: SViewStyle = [];
