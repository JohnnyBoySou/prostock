import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleProp, ViewStyle } from 'react-native';

interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof View> {
  w?: number;
  h?: number;
  r?: number;
  c?: string;
}

function Skeleton({
  w = 100,
  h = 100, 
  r = 8,
  c = '#505050', 
  style,
  ...props
}: SkeletonProps) {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

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
    opacity: fadeAnim,
    width: w,
    height: h,
    borderRadius: r,
    backgroundColor: c,
  };

  return (
    <Animated.View
      style={[animatedStyle, style]}
      {...props}
    />
  );
}

export default Skeleton;
