import React from 'react';
import { Column, Loader, colors } from '@/ui';

export default function ProfileLoading() {
    const theme = colors();
    return (
        <Column style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Loader size={32} color={theme.color.primary} />
        </Column>
    );
}
