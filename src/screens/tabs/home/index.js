import React, { useContext } from 'react';
import { Dimensions, } from 'react-native';
import { Main, Scroll, Column, Row, Title } from '@theme/global';
import { ThemeContext } from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, }) {
    const { color, font, margin, } = useContext(ThemeContext);

    return (
        <Main style={{  }}>
            <Scroll>
               
               <Title align="center">Home</Title>
            </Scroll>
        </Main>
    )
}
