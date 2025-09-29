import React from 'react';
import { Column, Skeleton, Main } from '@/ui';

export default function CategoryLoading() {
    return (
        <Main >
            <Column ph={26} pv={12} gv={16}>
                <Skeleton w="100%" h={80} />
                <Skeleton w="100%" h={80} />
                <Skeleton w="100%" h={80} />
                <Skeleton w="100%" h={80} />
                <Skeleton w="100%" h={80} />
                <Skeleton w="100%" h={80} />
                <Skeleton w="100%" h={80} />
            </Column>
        </Main>
    );
}
