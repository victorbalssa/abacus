import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import { Container, Content } from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import { StatusBar } from 'expo-status-bar';

import TextH2t from '../UI/TextH2t';
import commonColor from '../../../constants/colors';
import { Firebase } from '../../../lib/firebase';

const windowWidth = Dimensions.get('window').width;

const TicketView = ({ ticket }) => (
    <Container style={{ backgroundColor: commonColor.backgroundColorLighter }}>
        <StatusBar style="light"/>
        <Content padder>
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <TextH2t style={{ fontSize: 30, paddingTop: 40, paddingBottom: 40, fontFamily: 'Montserrat_Bold' }}>
                    {ticket.title}
                </TextH2t>
                <TextH2t style={{ fontSize: 20, paddingTop: 10, paddingBottom: 10 }}>
                    {ticket.date}
                </TextH2t>
                <TextH2t style={{ fontSize: 20, paddingTop: 10, paddingBottom: 10 }}>
                    {ticket.hour}
                </TextH2t>
                <QRCode
                    value={`${Firebase.auth().currentUser.uid} ${ticket.uuid}`}
                    color={'#111'}
                    backgroundColor={'white'}
                    size={windowWidth - 20}
                />
            </View>
        </Content>
    </Container>
);

TicketView.propTypes = {
    member: PropTypes.shape({}),
    logout: PropTypes.func.isRequired,
};

TicketView.defaultProps = {
    member: {},
};

export default TicketView;
