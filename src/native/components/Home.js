import React from 'react';
import { View } from 'react-native';
import { Container, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Spacer from './UI/Spacer';;
import CardH2t from './UI/CardH2t';
import { StatusBar } from 'expo-status-bar';
import commonColor from '../../constants/colors';
import TextI18n from './UI/TextI18n';

const Home = ({ member }) => {

    return (
        <Container style={{ backgroundColor: commonColor.backgroundColor }}>
            <StatusBar style="light"/>
            <Content padder>
                <Spacer size={10}/>
                <TextI18n style={{ color: '#ffffff', textAlign: 'center', fontSize: 35, margin: 16 }}>
                    homepage.title
                </TextI18n>

                <CardH2t
                    source={require('../../images/Events/blueBackgroung.png')}
                    onPress={() => Actions.jump('events')}
                    text1="homepage.card1Text1"
                    text2="homepage.card1Text2"
                />

                <Spacer size={20}/>

                {(member && member.email) ? (
                    <View>
                        <CardH2t
                            onPress={() => {
                                Actions.jump('tickets');
                            }}
                            text1="homepage.card2Text1"
                            text2="homepage.card2Text2"
                        />
                        <Spacer size={40}/>
                    </View>
                ) : (
                    <CardH2t
                        source={require('../../images/Events/account.jpg')}
                        onPress={Actions.login}
                        text1="homepage.cardSignInText1"
                        text2="homepage.cardSignInText2"
                    />
                )}

                <Spacer size={80}/>

            </Content>
        </Container>
    );
};

export default Home;
