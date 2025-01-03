import React, { forwardRef } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const Modal = forwardRef(({ children, bg = '#fbfbfb', snapPoints = [0.1, 300], onClose, ...props }, ref) => {
    return (
        <BottomSheet
            {...props}
            ref={ref}
            snapPoints={snapPoints}
            onClose={onClose}
            backgroundStyle={{ backgroundColor: bg, }}
            handleIndicatorStyle={{ backgroundColor: '#30303030', width: 70, height: 8, }}
        >
            <BottomSheetScrollView>
                {children}
            </BottomSheetScrollView>
        </BottomSheet>
    );
});

export default Modal;
