import React from 'react';
import { Container, Content } from 'native-base';
import commonColor from '../../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import Spacer from './Spacer';
import LottieView from 'lottie-react-native';

const H2TLoading = () => (
    <Container style={{ backgroundColor: commonColor.backgroundColor }}>
        <StatusBar style="light"/>
        <Content padder style={{ flex: 1 }}>
            <Spacer size={40}/>
            <LottieView
                loop={true}
                autoPlay
                speed={5}
                style={{ width: '100%' }}
                source={require('../../../images/home')}
            />
        </Content>
    </Container>
);

export default H2TLoading;
