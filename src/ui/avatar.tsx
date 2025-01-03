import React, { useState } from 'react';
import { Image, Text, View, StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';

interface AvatarProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  url?: string;
  fallbackText?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  imageStyle?: ImageStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  width = 40,
  height = 40,
  backgroundColor = '#d3d3d3',
  url,
  fallbackText = '',
  style,
  textStyle,
  imageStyle,
}) => {
  const [hasError, setHasError] = useState(false);

  const containerStyle: ViewStyle = {
    width,
    height,
    borderRadius: Math.min(width, height) / 2,
    overflow: 'hidden',
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const fallbackTextStyle: TextStyle = {
    fontSize: width / 2.5,
    color: '#555',
    ...textStyle,
  };

  const avatarImageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    ...imageStyle,
  };

  return (
    <View style={[containerStyle, style]}>
      {!hasError && url ? (
        <Image
          source={{ uri: url }}
          style={avatarImageStyle}
          onError={() => setHasError(true)}
        />
      ) : (
        <Text style={fallbackTextStyle}>{fallbackText}</Text>
      )}
    </View>
  );
};

export default Avatar;
