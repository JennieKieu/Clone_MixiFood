import {useTranslation} from 'react-i18next';
import {Modal, ModalProps, TouchableWithoutFeedback, View} from 'react-native';
import {STextStyle, SViewStyle} from '../../models';
import {palette, scale, scaleFontSize, style} from '../../theme';
import {Button, Text, useTheme} from '@rneui/themed';
import {Dispatch, SetStateAction} from 'react';

export type VerifyModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  handleCancel: () => void;
  handleActive: () => void;
} & ModalProps;

export const VerifyModal: React.FC<VerifyModalProps> = ({
  modalVisible,
  handleCancel,
  handleActive,
  setModalVisible,
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
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
                <Text style={$activeText}>{t('verifySmsModal.title.1')}</Text>
                <Text style={$activeText}>{t('verifySmsModal.title.2')}</Text>
                <View style={style.pb_md}></View>
              </View>
              <View style={$footerItem}>
                <View></View>
                <View style={style.row}>
                  <Button
                    type="clear"
                    title={t('common.cancel')}
                    titleStyle={[$activeText]}
                    onPress={handleCancel}></Button>
                  <Button
                    type="clear"
                    title={t('common.active')}
                    titleStyle={[{color: palette.primary5}, $activeText]}
                    onPress={handleActive}></Button>
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
  {fontSize: scaleFontSize(14, 16 * 1.5)},
  style.tx_font_bold,
];
const $footerItem: SViewStyle = [style.row_between, style.mx_md, style.mt_sm];
