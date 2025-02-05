import React, {useLayoutEffect, useRef, useState} from 'react';
import {Layout} from '../../../components/Layout/Layout';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../navigators';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Image,
  Pressable,
  TextProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {SImageStyle, STextStyle, SViewStyle} from '../../../models';
import {palette, scaleFontSize, style} from '../../../theme';
import {Button, Text} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {AppImage} from '../../../components/AppImage';
import {images} from '../../../../assets';
import {useAppSelector} from '../../../hooks';
import {EUserType, selectUserInfo, selectUserType} from '../../../store';
import {TxKeyPath} from '../../../i18n';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {loginApi} from '../../../api/loginApi';
import {TUploadProfileType} from '../ConfirmSaveAvatarScreen';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {AddPaymentMethodBottomSheet} from './BottomSheet';
import {TPaymentMethods} from '../../../api/api.types';

export const RestaurantProfileEditScreen: React.FC<
  NativeStackScreenProps<AppStackParamList, 'RestaurantProfileEditScreen'>
> = props => {
  const {t} = useTranslation();
  const userInfo = useAppSelector(selectUserInfo);
  const userType = useAppSelector(selectUserType);
  const [pickImage, setPickImage] = useState<Asset | undefined>();

  const addPaymentBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleAddPaymentMethod = () => {
    addPaymentBottomSheetModalRef.current?.present();
  };

  const handleSelectPaymentOnBottomSheet = (method: TPaymentMethods) => {
    addPaymentBottomSheetModalRef.current?.close();
    props.navigation.navigate('AddPaymentMethodScreen', {method: method});
  };

  const handleOpenLibary = async (updateType: TUploadProfileType) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 1000,
        maxHeight: 1000,
        assetRepresentationMode: 'current',
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          console.log(response.errorCode);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0]; // Lấy đường dẫn của ảnh được chọn
          setPickImage(selectedImage); // Lưu ảnh đã chọn vào state
          // console.log('sdsd', selectedImage);
          props.navigation.navigate('ConfirmSaveAvatarScreen', {
            image: selectedImage,
            uploadType: updateType,
          });
        }
      },
    );
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => <Text>Edit restaurant</Text>,
      headerLeft: () => (
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AppImage source={images.angle_left}></AppImage>
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
    });
  }, [props.navigation]);

  type ItemProps = {
    leftLabel: TxKeyPath;
    leftValue?: string;
    valueLeftProps?: TextProps;
    valueRightProps?: TextProps;
  };

  const Item: React.FC<ItemProps> = props => {
    const {t} = useTranslation();
    const {leftLabel, leftValue, valueLeftProps, valueRightProps} = props;

    return (
      <View style={[style.row_between, style.mx_sm, style.mt_sm]}>
        <Text style={$textLabel}>{t(leftLabel)}</Text>
        <Text>{leftValue}</Text>
      </View>
    );
  };

  return (
    <Layout>
      <ScrollView>
        <View style={$innercontainner}>
          <View style={style.row_between}>
            <Text style={$sectionText}>{t('common.avatar')}</Text>
            <Button
              type="clear"
              title={t('common.edit')}
              titleStyle={$editBtn}
              onPress={() => handleOpenLibary('avatar')}></Button>
          </View>
          <TouchableOpacity
            style={style.center}
            onPress={() => handleOpenLibary('avatar')}>
            <Image source={{uri: userInfo?.avatar}} style={$avatarImg}></Image>
          </TouchableOpacity>
          <View style={$sectionLine}></View>
          {/*  */}
          <View style={style.row_between}>
            <Text style={$sectionText}>{t('common.coverImage')}</Text>
            <Button
              type="clear"
              title={t('common.edit')}
              titleStyle={$editBtn}
              onPress={() => handleOpenLibary('cover image')}></Button>
          </View>
          <TouchableOpacity
            style={style.center}
            onPress={() => handleOpenLibary('cover image')}>
            <Image
              source={{uri: userInfo?.coverImage}}
              style={$coverAvatarImg}></Image>
          </TouchableOpacity>
          <View style={$sectionLine}></View>
          {/*  */}
          <View style={style.row_between}>
            <Text style={$sectionText}>{t('detail')}</Text>
            <Button
              type="clear"
              title={t('common.edit')}
              titleStyle={$editBtn}></Button>
          </View>
          <Item
            leftLabel={
              userType !== EUserType.user
                ? 'input.restaurantName.label'
                : 'input.fullName.label'
            }
            leftValue={userInfo?.userName}></Item>
          <Item
            leftLabel="input.address.label"
            leftValue={userInfo?.address}></Item>
          <Item
            leftLabel="input.email.label"
            leftValue={userInfo?.email}></Item>
          <Item
            leftLabel="input.phoneNumber.label"
            leftValue={userInfo?.phoneNumber}></Item>
          <View style={$sectionLine}></View>
          {/* payment */}
          {userType === EUserType.restaurant && (
            <View style={style.row_between}>
              <Text style={$sectionText}>{t('common.paymentmethod')}</Text>
              <Button
                type="clear"
                title={t('common.addPayment')}
                titleStyle={$editBtn}
                onPress={handleAddPaymentMethod}
              />
            </View>
            // Fake payment methods
          )}
          {userType === EUserType.restaurant &&
            userInfo?.paymentMethods &&
            userInfo.paymentMethods.map(item => (
              <View>
                <Text>{item.paymentMethodName}</Text>
              </View>
            ))}
        </View>
      </ScrollView>

      {userType === EUserType.restaurant && (
        <AddPaymentMethodBottomSheet
          bottomSheetModalRef={addPaymentBottomSheetModalRef}
          handleSelectedMethod={handleSelectPaymentOnBottomSheet}
        />
      )}
    </Layout>
  );
};

const $innercontainner: SViewStyle = [style.flex_1, style.mx_sm];
const $sectionText: STextStyle = [
  style.tx_font_bold,
  {fontSize: scaleFontSize(20)},
];
const $avatarImg: SImageStyle = [
  {
    width: scaleFontSize(100),
    height: scaleFontSize(100),
    borderRadius: 999,
    marginTop: scaleFontSize(12),
  },
];
const $sectionLine: SViewStyle = [
  {backgroundColor: palette.gray5, height: 1},
  style.my_md,
];
const $editBtn: STextStyle = [{color: palette.blue8}, style.tx_font_bold];
const $coverAvatarImg: SImageStyle = [
  {width: '100%', height: scaleFontSize(150), marginTop: scaleFontSize(12)},
];
const $textLabel: STextStyle = [
  style.tx_font_medium,
  {fontSize: scaleFontSize(14)},
];
