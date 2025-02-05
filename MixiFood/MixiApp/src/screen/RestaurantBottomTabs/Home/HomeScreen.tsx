import {CompositeScreenProps} from '@react-navigation/native';
import {Layout} from '../../../components/Layout/Layout';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {AppStackParamList} from '../../../navigators';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppRestaurantDrawerStackParamList} from '../../../navigators/AppRestaurantDrawerStack';
import {useEffect, useLayoutEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {Text} from '@rneui/themed';
import {palette, scale, scaleFontSize, spacing, style} from '../../../theme';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {STextStyle, SViewStyle} from '../../../models';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {usePendingInvoices} from '../../../hooks/PendingInvoices';
import {useAppSelector} from '../../../hooks';
import {
  selectNumberOfInvoicesToday,
  selectPendingInvoices,
  selectUserInfo,
  TProfile,
} from '../../../store';
import {useInvoicesHistory} from '../../../hooks/InvoicesHistory';
import {AppModal} from '../../../components/AppModal';
import {EHomeControlleTabs, HomcontrollerTabs} from './HomeScreen.types';

const {width, height} = Dimensions.get('screen');
export const HomeScreen: React.FC<
  CompositeScreenProps<
    DrawerScreenProps<AppRestaurantDrawerStackParamList, 'Home'>,
    NativeStackScreenProps<AppStackParamList>
  >
> = props => {
  const {colorScheme} = useThemeContext();
  const {t} = useTranslation();
  const pendingInvoices = useAppSelector(selectPendingInvoices);
  const numberOfInvoicesToday = useAppSelector(selectNumberOfInvoicesToday);
  const profile: TProfile | undefined = useAppSelector(selectUserInfo);
  const [confirmAddLocationModalVisible, setConfirmAddLocationModalVisible] =
    useState<boolean>(false);

  // useFetchFoods([isSignedIn]);
  usePendingInvoices([]);
  useInvoicesHistory([]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      // headerShown: false,
      headerLeft: () => (
        <View style={style.ml_md}>
          {/* <Text>ád</Text> */}
          <TouchableOpacity onPress={props.navigation.openDrawer}>
            <AppImage source={images.list_solid} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={style.mr_md}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AppMessagesStack')}>
            <View style={[$messageSpan, {backgroundColor: palette.primary5}]}>
              <Text style={$messageNumberText}>5</Text>
            </View>
            <View>
              <AppImage source={images.facebook_message} resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </View>
      ),
      headerTitle: () => <View></View>,
    });
  }, []);

  const barData = [
    {value: 250, label: 'M'},
    {value: 500, label: 'T', frontColor: '#177AD5'},
    {value: 745, label: 'W', frontColor: '#177AD5'},
    {value: 320, label: 'T'},
    {value: 600, label: 'F', frontColor: '#177AD5'},
    {value: 256, label: 'S'},
    {value: 300, label: 'S'},
  ];

  const handleTabsPress = (tabs: EHomeControlleTabs) => {
    switch (tabs) {
      case EHomeControlleTabs.pendingPayment:
        props.navigation.navigate('PendingPaymentScreen');
        break;
      case EHomeControlleTabs.booking:
        props.navigation.navigate('SeatingBookingRequestScreen');
        break;
      case EHomeControlleTabs.paymentHistory:
        props.navigation.navigate('FilterDrawer');
        break;
    }
  };

  useEffect(() => {
    (async () => {
      if (profile && !profile.locationId) {
        setConfirmAddLocationModalVisible(true);
      }
    })();
  }, []);

  const handleUpdateLocation = () => {
    setConfirmAddLocationModalVisible(false);
    props.navigation.navigate('ConfirmLocationMapScreen');
  };

  return (
    <Layout>
      <ScrollView>
        <View style={style.mx_md}>
          <View style={[style.my_sm, style.row_between, style.row_wrap]}>
            {Object.entries(HomcontrollerTabs).map(([tabKey, imgSource]) => (
              <TouchableOpacity
                onPress={() => handleTabsPress(tabKey as EHomeControlleTabs)}
                style={[$controlBtn, {backgroundColor: colorScheme.default}]}>
                <View style={[$iconContainer]}>
                  <AppImage source={imgSource} />
                </View>
                <View style={[style.ml_sm, {width: '70%'}]}>
                  <Text numberOfLines={2}>{t(`common.${tabKey}`)}</Text>
                  <Text style={style.mt_xxs}>{pendingInvoices.length}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/*  */}
          {/* <TouchableOpacity
            style={{}}
            onPress={() => props.navigation.navigate('StatisticalScreen')}>
            <View style={{}}>
              <View style={style.row_between}>
                <Text style={$titleText}>statistical</Text>
                <LottieView
                  source={lottieAnmiations.statistical}
                  autoPlay
                  style={{width: 22, height: 22}}
                  resizeMode="cover"
                />
              </View>
              <BarChart
                barWidth={20}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                height={100}
                isAnimated
                animationDuration={4000}
                // hideRules
                scrollAnimation
                // showGradient
                // gradientColor={'#fc84ff'}
                renderTooltip={(item: any) => {
                  return (
                    <View
                      style={{
                        bottom: -60,
                      }}>
                      <Text style={[style.tx_font_bold]}>{item.value}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      <AppModal
        modalVisible={confirmAddLocationModalVisible}
        setModalVisible={setConfirmAddLocationModalVisible}
        title={t('requestUpdate.location.title')}
        content={t('requestUpdate.location.message')}
        btn2Title={t('common.confirm')}
        handleCancel={() => setConfirmAddLocationModalVisible(false)}
        handleOk={handleUpdateLocation}
      />
    </Layout>
  );
};

const $messageSpan: SViewStyle = [
  style.abs,
  {
    right: 0,
    top: -8,
    borderRadius: 999,
    width: scaleFontSize(15),
    height: scaleFontSize(15),
    zIndex: 10,
  },
  style.center,
];
const $messageNumberText: STextStyle = [{color: palette.white}];
const $titleText: STextStyle = [
  style.my_lg,
  style.tx_font_bold,
  {fontSize: scaleFontSize(16)},
];
const $controlBtn: SViewStyle = [
  {
    borderRadius: 8,
    width: '48%',
    // width: scale.x(spacing.screenWidth * 0.48, spacing.screenWidth * 0.35),
  },
  style.row,
  style.p_sm,
  style.shadow,
  style.mb_sm,
  style.center,
];
const $iconContainer: SViewStyle = [
  {
    backgroundColor: palette.gray5,
    width: scaleFontSize(40),
    height: scaleFontSize(40),
    borderRadius: scaleFontSize(6),
  },
  style.center,
];
