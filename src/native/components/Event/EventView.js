import React, { useState } from 'react';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { Image, KeyboardAvoidingView, Linking, ScrollView } from 'react-native';
import { Container, Content, Card, CardItem, Body, Icon, View, } from 'native-base';
import Error from '../UI/Error';
import Spacer from '../UI/Spacer';
import ButtonH2t from '../UI/ButtonH2t';
import TextH2t from '../UI/TextH2t';
import commonColor from '../../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import { LiteCreditCardInput } from 'react-native-credit-card-input';
import i18n from '../../../translations/i18n';

const EventView = ({ events, eventId, loading, buyTicket, onCardChange, buyDisabled, member }) => {
    let event = null;
    if (eventId && events) {
        event = events[eventId];
    }

    if (!event) return <Error content={'errors.events404'}/>;

    const [isModalVisibleCard, setModalVisibleCard] = useState(false);

    return (
        <KeyboardAvoidingView
            style={{ backgroundColor: commonColor.backgroundColor, flex: 1 }}
            behavior={(Platform.OS === 'ios') ? 'padding' : null}
            enabled
            keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}>
            <Container style={{ backgroundColor: commonColor.backgroundColor }}>
                <StatusBar style="light"/>
                <Content padder>
                    <Spacer size={15}/>
                    <Card style={{ borderRadius: 10, backgroundColor: commonColor.backgroundColorLighter }}>
                        <Image
                            source={{ uri: event.image ? event.image : '' }}
                            style={{
                                height: 200,
                                width: '100%',
                                resizeMode: 'stretch',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            }}/>
                        <CardItem style={{
                            borderBottomRightRadius: 10,
                            borderBottomLeftRadius: 10,
                            backgroundColor: commonColor.backgroundColorLighter,
                        }}>
                            <Body>
                                <TextH2t style={{
                                    fontSize: 30,
                                    fontFamily: 'Montserrat_Bold',
                                    alignSelf: 'center',
                                }}>{event.title}</TextH2t>
                                <TextH2t style={{
                                    fontSize: 20,
                                    fontFamily: 'Montserrat',
                                    alignSelf: 'center',
                                }}>{event.date}</TextH2t>
                                <TextH2t style={{
                                    fontSize: 20,
                                    fontFamily: 'Montserrat',
                                    alignSelf: 'center',
                                }}>{event.hour}</TextH2t>
                            </Body>
                        </CardItem>
                    </Card>
                    <Spacer size={15}/>
                    {event.tickets !== undefined && event.tickets > 0 && member.email &&
                        <ButtonH2t
                            onPress={() => setModalVisibleCard(true)}
                            icon
                            loading={loading}
                            text="events.buyTicket"
                        />
                    }
                    <Spacer size={15}/>
                    <Card style={{ backgroundColor: commonColor.backgroundColorLighter, borderRadius: 10 }}>
                        <CardItem style={{
                            backgroundColor: commonColor.backgroundColorLighter,
                            borderRadius: 10,
                            flexDirection: 'row',
                        }}>
                            <Icon type="FontAwesome" name="ticket"
                                  style={{ fontSize: 17, color: '#b3b5bb', paddingRight: 5 }}/>
                            <TextH2t style={{ color: '#b3b5bb' }}>
                                {event.tickets > 0 ? `${event.tickets} ${i18n.t('events.available')}` : i18n.t('events.full')}
                            </TextH2t>
                        </CardItem>
                        <CardItem style={{ backgroundColor: commonColor.backgroundColorLighter, borderRadius: 10 }}>
                            <TextH2t>{event.description}</TextH2t>
                        </CardItem>
                    </Card>
                    <Spacer size={15}/>

                    <Card>
                        {event.locations && <CardItem style={{ backgroundColor: commonColor.backgroundColorLighter }}>
                            <Icon type="MaterialCommunityIcons" name="google-maps"
                                  style={{ color: 'white', fontSize: 26 }}/>
                            <TextH2t style={{ textDecorationLine: 'underline' }}
                                     onPress={() => Linking.openURL('https://www.google.com/maps/place/' + event.locations)}>Link</TextH2t>
                        </CardItem>}
                    </Card>

                    <Spacer size={20}/>
                </Content>

                <Modal
                    isVisible={isModalVisibleCard}
                    backdropOpacity={0.7}
                    onBackdropPress={() => setModalVisibleCard(false)}
                    onSwipeComplete={() => setModalVisibleCard(false)}
                    swipeDirection={['down']}
                    style={{ margin: 0 }}
                    propagateSwipe
                >
                    <Spacer size={10}/>
                    <View style={{
                        width: 50,
                        height: 5,
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        alignSelf: 'center',
                        margin: 10,
                    }}/>
                    <ScrollView contentContainerStyle={{
                        backgroundColor: commonColor.backgroundColorLighter,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderWidth: 10,
                        borderColor: commonColor.backgroundColorLighter,
                        flexGrow: 2,
                    }}>
                        <Card style={{ backgroundColor: commonColor.backgroundColorLighter }}>
                            <CardItem style={{
                                backgroundColor: commonColor.backgroundColorLighter,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 20,
                            }}>
                                <TextH2t style={{ fontSize: 18 }}>{event.title} X 1</TextH2t>
                                <TextH2t style={{ fontSize: 18 }}>{event.price} $</TextH2t>
                            </CardItem>
                            <LiteCreditCardInput
                                inputStyle={{ fontFamily: 'Montserrat', color: 'white', fontSize: 20 }}
                                labelStyle={{ fontFamily: 'Montserrat_Bold', color: 'white', fontSize: 15 }}
                                validColor={'#fff'}
                                onChange={(form) => onCardChange(form)}
                                requiresCVC={true}
                            />
                            <CardItem style={{
                                backgroundColor: commonColor.backgroundColorLighter,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 30,
                            }}>
                                <TextH2t style={{ fontSize: 11 }}>
                                    By confirming your order you accept H2T Terms of Use.
                                </TextH2t>
                            </CardItem>
                            {event.tickets !== undefined && event.tickets > 0 && member.email &&
                                <ButtonH2t
                                    onPress={async () => {
                                        await buyTicket(event.id);
                                        setModalVisibleCard(false);
                                    }}
                                    disabled={buyDisabled}
                                    loading={loading} text="events.pay"
                                    style={{ flex: 0 }}
                                />
                            }
                            <Spacer size={20}/>
                        </Card>
                    </ScrollView>
                </Modal>
            </Container>
        </KeyboardAvoidingView>
    );
};

EventView.propTypes = {
    error: PropTypes.string,
    eventId: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

EventView.defaultProps = {
    error: null,
};

export default EventView;
