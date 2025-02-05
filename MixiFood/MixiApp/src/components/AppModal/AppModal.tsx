import {Button, Text, useTheme} from '@rneui/themed';
import React, {Dispatch, SetStateAction} from 'react';
import {Modal, ModalProps, TouchableWithoutFeedback, View} from 'react-native';
import {palette, scale, scaleFontSize, spacing, style} from '../../theme';
import {useTranslation} from 'react-i18next';
import {STextStyle, SViewStyle} from '../../models';

export type AppModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  content: string;
  handleCancel?: () => void;
  btn1Title?: string;
  handleOk?: () => void;
  btn2Title?: string;
} & ModalProps;

export const AppModal: React.FC<AppModalProps> = ({
  modalVisible,
  setModalVisible,
  content,
  title,
  handleCancel,
  btn1Title,
  handleOk,
  btn2Title,
  ...rest
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <Modal {...rest} visible={modalVisible} transparent>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={$innerContainer}>
          <TouchableWithoutFeedback>
            <View
              style={[
                $modalContentContainer,
                {
                  backgroundColor:
                    theme.mode === 'light' ? palette.white : palette.black,
                },
              ]}>
              <View style={$center}>
                <Text style={$activeText}>{title}</Text>
                <Text style={$contentText}>{content}</Text>
                <View style={style.pb_md}></View>
              </View>
              <View style={$footerItem}>
                <View></View>
                <View style={style.row}>
                  {handleCancel && (
                    <Button
                      type="clear"
                      title={btn1Title || t('common.cancel')}
                      titleStyle={[$activeText]}
                      onPress={handleCancel}></Button>
                  )}
                  {handleOk && (
                    <Button
                      type="clear"
                      title={btn2Title || t('common.active')}
                      titleStyle={[{color: palette.primary5}, $activeText]}
                      onPress={handleOk}></Button>
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const $innerContainer: SViewStyle = [
  style.flex_1,
  style.center,
  {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
];
const $modalContentContainer: SViewStyle = [
  {width: '80%', borderRadius: scale.x(12, 12 * 1.5)},
  style.justify_between,
  style.pt_lg,
  style.pb_sm,
  style.shadow,
];
const $center: SViewStyle = [
  {borderBottomWidth: 1, borderColor: palette.gray10},
  style.px_md,
];
const $activeText: STextStyle = [
  {fontSize: scaleFontSize(18, 18 * 1.8)},
  style.tx_font_bold, style.mb_sm
];
const $footerItem: SViewStyle = [style.row_between, style.mx_md, style.mt_sm];
const $contentText: STextStyle = [{fontSize: scaleFontSize(16)}];
