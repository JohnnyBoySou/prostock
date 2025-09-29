import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import colors from './colors';

interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof View> {
  w?: DimensionValue;
  h?: DimensionValue;
  r?: DimensionValue;
}

function Skeleton({
  w = 100,
  h = 100, 
  r = 8,
  style,
  ...props
}: SkeletonProps) {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;
  const theme = colors();
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const animatedStyle: StyleProp<ViewStyle> = {
    width: w,
    height: h,
    borderRadius: r,
    backgroundColor: theme.color.skeleton,
    opacity: fadeAnim,
  };

  return (
    <Animated.View
      style={[animatedStyle, style]}
      {...props}
    />
  );
}

export default Skeleton;
