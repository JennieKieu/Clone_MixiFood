import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {AppRestaurantDrawerStackParamList} from '../../../navigators/AppRestaurantDrawerStack';
import {HomeScreen} from '../Home';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {CustomDrawerContent} from '../CustomDrawerContent';
import {PaymentHistoriesScreen} from './PaymentHistoriesScreen';
import {Alert, Dimensions} from 'react-native';
import {FilterContentDrawer} from './FilterContentDrawer';
import {useEffect, useMemo, useState} from 'react';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {TFilterDefault} from '../../../api/api.types';
import {useLoader} from '../../../contexts/loader-provider';
import {ELoaderType} from '../../../components/AppLoader';
import {delay} from '../../../utils';
import {restaurantApi} from '../../../api/restaurantApi';
import {TInvoiceForStore} from '../../../models/invoice';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {
  resetInvoices,
  resetInvoicesByFillter,
  selectInvoices,
  setIsInvoiceFilter,
  setTotalRevenue,
} from '../../../store';
import {useTranslation} from 'react-i18next';

export type TFilterDrawerParamlist = {
  PaymentHistoriesScreen: {
    selectedDate: Date;
  };
};

export type TPaymentHistoryProps = {
  test: string;
} & CompositeScreenProps<
  DrawerScreenProps<TFilterDrawerParamlist, 'PaymentHistoriesScreen'>,
  NativeStackScreenProps<AppStackParamList>
>;

const Drawer = createDrawerNavigator<TFilterDrawerParamlist>();

function renderPaymentHistories(props: any) {
  return <PaymentHistoriesScreen {...props}></PaymentHistoriesScreen>;
}

export const FilterDrawer = () => {
  const {t} = useTranslation();
  const {colorScheme} = useThemeContext();
  const [filter, setFilter] = useState<TFilterDefault>('DAY');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {show, hide} = useLoader();
  const Dispatch = useAppDispatch();

  const fetchInvoiceByFilter = async (
    filter: TFilterDefault,
    selectedDateInput?: Date,
  ) => {
    try {
      const response = await restaurantApi.getInvoices(
        filter,
        undefined,
        undefined,
        selectedDateInput,
      );
      if (response.data.success) {
        Dispatch(setIsInvoiceFilter(true));
        const totalRevenue: string = response.data.totalRevenue;
        Dispatch(setTotalRevenue(totalRevenue || '0'));

        Dispatch(
          resetInvoicesByFillter(response.data.invoicesWithEmployeeName),
        );
      }
      hide();
    } catch (error) {
      Alert.alert(t('common.fail'));
    } finally {
      hide();
    }
  };

  const handleApplyFilter = async (
    input: TFilterDefault,
    selectedDateInput?: Date,
  ) => {
    show(ELoaderType.invoiceLoader);
    selectedDateInput && setSelectedDate(prev => selectedDateInput);

    setFilter(input);
    fetchInvoiceByFilter(input, selectedDateInput);
  };
  const handleResetFilter = () => {};

  useEffect(() => {
    (async () => {
      try {
        const response = await restaurantApi.getInvoices(
          'DAY',
          undefined,
          undefined,
        );
        if (response.data.success) {
          Dispatch(setIsInvoiceFilter(true));
          const totalRevenue: string = response.data.totalRevenue;
          Dispatch(setTotalRevenue(totalRevenue || '0'));

          Dispatch(
            resetInvoicesByFillter(response.data.invoicesWithEmployeeName),
          );
        }
        hide();
      } catch (error) {
        console.log(error);
        hide();
      }
    })();

    return () => {
      Dispatch(setIsInvoiceFilter(false));
      Dispatch(resetInvoicesByFillter([]));
    };
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={props => (
        <FilterContentDrawer
          {...props}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleApplyFilter={handleApplyFilter}
          filter={filter}
          setFilter={setFilter}
          navigation={props.navigation}
        />
      )}
      // drawerContent={FilterContentDrawer}

      screenOptions={{
        drawerType: 'front',
        // drawerHideStatusBarOnOpen: true,
        headerShadowVisible: false,
        headerShown: true,
        headerStyle: {backgroundColor: colorScheme.background},
        drawerPosition: 'right',
        drawerStyle: {width: Dimensions.get('screen').width - 60},
      }}>
      <Drawer.Screen
        name="PaymentHistoriesScreen"
        component={PaymentHistoriesScreen}
        // component={(props: TPaymentHistoryProps) => (
        //   <PaymentHistoriesScreen
        //     navigation={props.navigation}
        //     route={props.route}
        //     test={'áds'}
        //   />
        // )}
        initialParams={{
          selectedDate: selectedDate,
        }}
      />
    </Drawer.Navigator>
  );
};
