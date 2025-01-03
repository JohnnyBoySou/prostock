import { Image as ExpoImage } from 'expo-image';
export default function Image({ src = '', w = 0, h = 0, r = 0, align = 'center', style}) {
    return (
        <ExpoImage  source={src} width={w} height={h} style={{ borderRadius: r, width: w, height: h, alignSelf: align, style }}  />
    );
}