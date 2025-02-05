import React, {useEffect, useMemo, useState} from 'react';
import {Layout} from '../../components/Layout/Layout';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {Alert, SafeAreaView, useWindowDimensions} from 'react-native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../navigators';
import {OrderFoodScreen} from '../EmployeeBottomTabs/OrderFood';
import {useThemeContext} from '../../contexts/ThemeContext';
import {OrderedScreen} from '../EmployeeBottomTabs/OrderedScreen.tsx';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../hooks/RTK.ts';
import {useLoader} from '../../contexts/loader-provider.tsx';
import {TSeatingForStore} from '../../models/Seating.ts';
import {employeeApi} from '../../api/employeeApi.ts';
import {
  selectOrdersPendingByEmp,
  selectSeatings,
  selectSeatingsByEmployee,
  updateSeatOrder,
} from '../../store/index.ts';
import socketClient from '../../socket/socketClient.ts';

export const OrderTabsScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'OrderTabsScreen'>
> = props => {
  const {colorScheme} = useThemeContext();
  const {show, hide} = useLoader();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {seatId} = props.route.params;
  const seat = useAppSelector(selectSeatingsByEmployee).find(
    item => item._id === props.route.params.seatId,
  );
  const order = useAppSelector(selectOrdersPendingByEmp);

  const isDisableOrderTab = useMemo(() => {
    if (seat?.currentOrderId) {
      const status = order.find(
        item => item._id === seat.currentOrderId,
      )?.status;

      return status === 'payment';
    }
    return false;
  }, [order, seat]);

  useEffect(() => {
    (async () => {
      show();
      try {
        const response = await employeeApi.getSeat(props.route.params.seatId);
        if (response.data) {
          const seat: TSeatingForStore = response.data;
          dispatch(updateSeatOrder(seat));
        }
        hide();
      } catch (error) {
        console.log('errr', error);
        Alert.alert(t('commin.fail', t('errorMessage.internet')));
        props.navigation.goBack();
        hide();
      }
    })();

    console.log('seatingData: ', seat);

    if (seat && seat?.currentOrderId) {
      socketClient.joinWaitingPayment({orderId: seat.currentOrderId});
      socketClient
        .getSocket()
        ?.on(
          'onPaymentNotification',
          (data: {msg: string; content: string}) => {
            // console.log('recad', data);
            Alert.alert(data.content);
          },
        );
    }

    return () => {
      if (seat && seat?.currentOrderId) {
        socketClient.leaveWaitingPayment({orderId: seat.currentOrderId});
      }
    };
  }, []);

  const handlePayPress = () => {
    props.navigation.navigate('InvoicePrieViewScreen', {seatId: seatId});
  };

  const FirstRoute = () => (
    <OrderFoodScreen
      navigation={
        props.navigation as NativeStackNavigationProp<
          AppStackParamList,
          'OrderFoodScreen'
        >
      }
      route={props.route}
    />
  );

  const SecondRoute = () => (
    <OrderedScreen
      seatId={props.route.params.seatId}
      handlePayPress={handlePayPress}
      paymentding={isDisableOrderTab}
    />
  );

  const routes = useMemo(() => {
    const baseRoutes = [
      {key: 'second', title: 'Ordered'}, // Luôn hiển thị tab "Ordered"
    ];

    if (!isDisableOrderTab) {
      baseRoutes.unshift({key: 'first', title: 'Order'}); // Thêm tab "Order" nếu không bị vô hiệu hóa
    }

    return baseRoutes;
  }, [isDisableOrderTab]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderTabBar = (props: any) => {
    return (
      <SafeAreaView>
        <TabBar
          {...props}
          inactiveColor={colorScheme.text}
          activeColor={colorScheme.text}
          style={{backgroundColor: colorScheme.background}}
          indicatorStyle={{backgroundColor: colorScheme.text}}
        />
      </SafeAreaView>
    );
  };

  return (
    <Layout>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
      />
    </Layout>
  );
};
