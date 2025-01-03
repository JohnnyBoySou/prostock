import React, { useContext } from 'react';
import { Dimensions, } from 'react-native';
import { Main, Scroll, Column, Row, Title } from '@/ui';
import { ThemeContext } from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation, }) {

    return (
        <Main style={{  }}>
            <Scroll>
               
               <Title align="center">Home</Title>
            </Scroll>
        </Main>
    )
}
