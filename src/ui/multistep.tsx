import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import colors from './colors_2';

interface MultistepProps {
    steps: number;
    currentStep: number;
    color?: string;
    backgroundColor?: string;
    height?: number;
    animationDuration?: number;
}

const HEIGHT = 12;

export const MultiStep: React.FC<MultistepProps> = ({
    steps,
    currentStep,
    color = colors.color.primary,
    backgroundColor = '#E0E0E0',
    height = HEIGHT,
    animationDuration = 300,
}) => {
    const animatedValues = useRef(
        Array.from({ length: steps }, (_, index) =>
            new Animated.Value(index < currentStep ? 1 : 0)
        )
    ).current;

    useEffect(() => {
        animatedValues.forEach((animatedValue, index) => {
            const targetValue = index < currentStep ? 1 : 0;

            Animated.timing(animatedValue, {
                toValue: targetValue,
                duration: animationDuration,
                useNativeDriver: false,
            }).start();
        });
    }, [currentStep, steps, animationDuration]);

    return (
        <View style={{ width: '100%', height: 12, }}>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 12,
                }}
            >
                {Array.from({ length: steps }, (_, index) => {
                    const isActive = index === currentStep || index === currentStep - 1 || index < currentStep;
                    return (
                        <View
                            key={index}
                            style={{
                                flexGrow: 1,
                                height: height,

                            }}
                        >
                            <Animated.View
                                style={{
                                    borderRadius: 100,
                                    height: height,
                                    backgroundColor: isActive ? color : backgroundColor,
                                }}
                            />
                        </View>
                    )
                })}
            </View>
        </View>
    );
};
