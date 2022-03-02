import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { StatusBar } from 'expo-status-bar';

import TextH2t from '../UI/TextH2t';
import Spacer from '../UI/Spacer';
import commonColor from '../../../constants/colors';
import TextI18n from '../UI/TextI18n';

const TicketsListing = ({ member, loading, reFetch }) => (
    <Container>
        <ImageBackground
            source={require('../../../images/Tickets/no-tickets.png')}
            imageStyle={{
                resizeMode: 'stretch',
                height: 650,
            }}
            style={{
                width: '100%',
                flex: 1,
                backgroundColor: commonColor.backgroundColor,
            }}>
            <StatusBar style="light"/>
            <TextI18n style={{ fontSize: 30, margin: 50, marginBottom: 10, marginLeft: 10 }}>
                tickets.title
            </TextI18n>
            <Content padder refreshControl={(
                <RefreshControl
                    refreshing={loading}
                    onRefresh={reFetch}
                    title="Pull to refresh"
                    tintColor="#fff"
                    titleColor="#fff"
                    colors={["#000", "#fff", "#000"]}
                />
            )}>
                {(member && member.tickets && member.tickets.length)
                    ? (<View>
                        <Spacer size={30}/>
                        <FlatList
                            data={member.tickets}
                            renderItem={({ item, index }) =>
                                (<TouchableOpacity disabled={item.scanned === true}
                                                   onPress={() => Actions.ticketView({ ticket: item })}
                                                   style={{ flex: 1, paddingBottom: 12 }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: commonColor.backgroundColor,
                                        borderRadius: 10,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.29,
                                        shadowRadius: 4.65,
                                        elevation: 7,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        opacity: item.scanned === true ? 0.6 : 1,
                                        zIndex: 1,
                                    }}>
                                        {item.scanned === true && <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'absolute',
                                            zIndex: 10,
                                        }}>
                                            <TextI18n style={{
                                                color: '#fff',
                                                fontSize: 25,
                                                fontFamily: 'Montserrat_Bold',
                                            }}>
                                                tickets.scanned
                                            </TextI18n>
                                        </View>}
                                        <View style={{
                                            borderColor: '#FFE5EC',
                                            borderRadius: 100,
                                            borderWidth: 7,
                                            backgroundColor: '#FFE5EC',
                                            margin: 10,
                                            marginRight: 10,
                                        }}>
                                            <Icon
                                                name="ticket"
                                                type="MaterialCommunityIcons"
                                                style={{ color: commonColor.brandStyle, fontSize: 30 }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, padding: 5, marginRight: 5 }}>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                                <TextH2t style={{ fontSize: 15 }}>
                                                    {item.title ? (item.title.length > 22) ? ((item.title.substring(0, 22 - 3)) + '...') : item.title : ''}
                                                </TextH2t>
                                                <TextH2t style={{ fontSize: 13 }}>
                                                    {item.date ? item.date : ''}
                                                </TextH2t>
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Icon type="FontAwesome5" name="music"
                                                          style={{ fontSize: 16, color: '#b3b5bb', paddingRight: 5 }}/>
                                                    <TextH2t style={{ color: '#b3b5bb', fontSize: 13 }}>Techno</TextH2t>
                                                </View>
                                                <TextH2t style={{ color: '#b3b5bb', fontSize: 13 }}>
                                                    {item.hour ? item.hour : ''}
                                                </TextH2t>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>)}
                            keyExtractor={(index) => {return index.uuid;}}
                        />

                    </View>) : (
                        <View>
                            <Spacer size={100}/>
                            <TextI18n style={{ fontSize: 30, textAlign: 'center', fontFamily: 'Montserrat_Bold' }}>
                               tickets.noTickets
                            </TextI18n>
                            <TextI18n style={{ fontSize: 15, textAlign: 'center' }}>
                                tickets.noTicketsInfo
                            </TextI18n>
                        </View>
                    )}
                <Spacer size={20}/>
            </Content>
        </ImageBackground>
    </Container>
);

TicketsListing.propTypes = {
    member: PropTypes.shape({}),
    logout: PropTypes.func.isRequired,
};

TicketsListing.defaultProps = {
    member: {},
};

export default TicketsListing;
