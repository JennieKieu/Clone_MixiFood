import BottomSheet, {
  BottomSheetModal,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React, {PropsWithChildren} from 'react';

type AppOptionDropDownProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
} & BottomSheetProps;

export const AppOptionDropDown: React.FC<AppOptionDropDownProps> = ({
  bottomSheetModalRef,
  ...rest
}) => {
  return (
    <BottomSheetModal {...rest} ref={bottomSheetModalRef}></BottomSheetModal>
  );
};
