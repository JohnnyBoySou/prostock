import React from 'react';
import { Image as ExpoImage, ImageSource } from 'expo-image';

interface ImageProps {
    src?: string | ImageSource;
    w?: number | string;
    h?: number | string;
    r?: number | string;
    align?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
    style?: any;
}

export default function Image({ 
    src = '', 
    w = 0, 
    h = 0, 
    r = 0, 
    align = 'center', 
    style 
}: ImageProps) {
    return (
        <ExpoImage 
            source={src} 
            style={{ width: w, height: h, alignSelf: align, borderRadius: r, ...style }} 
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
        />
    );
}