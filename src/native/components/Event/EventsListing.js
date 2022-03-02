import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image, View, Dimensions } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Spacer from '../UI/Spacer';
import TextH2t from '../UI/TextH2t';
import { StatusBar } from 'expo-status-bar';
import commonColor from '../../../constants/colors';
import TextI18n from '../UI/TextI18n';
import i18n from '../../../translations/i18n';

const deviceWidth = Dimensions.get('window').width;

const EventsListing = ({ loading, events, reFetch }) => {

    const onPress = index => Actions.eventView({ match: { params: { id: String(index) } } });

    return (
        <Container style={{ backgroundColor: commonColor.backgroundColor }}>
            <StatusBar style="light"/>
            <TextI18n style={{ color: '#ffffff', fontSize: 30, margin: 50, marginBottom: 10, marginLeft: 10 }}>
                events.title
            </TextI18n>
            <Content padder refreshControl={(
                <RefreshControl
                    refreshing={loading}
                    onRefresh={reFetch}
                    title="Pull to refresh"
                    tintColor="#fff"
                    titleColor="#fff"
                    colors={['#000', '#fff', '#000']}
                />
            )}>
                <FlatList
                    data={events}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => onPress(index)} style={{ flex: 1 }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}>
                                <View style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.39,
                                    shadowRadius: 8.30,
                                    elevation: 13,
                                    borderRadius: 5,
                                    position: 'absolute',
                                    backgroundColor: commonColor.brandStyle,
                                    width: 100,
                                    height: 34,
                                    top: 150 + ((deviceWidth > 400) ? 40 : 20),
                                    right: 40,
                                    zIndex: 1000,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <TextH2t style={{ color: '#ffffff', fontSize: 18 }}>
                                        {item.price ? item.price + ' $' : 'Free'}
                                    </TextH2t>
                                </View>
                                <View style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.29,
                                    shadowRadius: 4.65,
                                    elevation: 8,
                                    borderRadius: 5,
                                    flex: 1,
                                }}>
                                    <Image
                                        source={{ uri: item.image ? item.image : '' }}
                                        style={{
                                            width: '100%',
                                            aspectRatio: 1.85,
                                            resizeMode: 'stretch',
                                            borderRadius: (Platform.OS === 'ios') ? 5 : 10,
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1, padding: 10 }}>
                                    <TextH2t style={{ color: '#ffffff', fontSize: 16 }}>
                                        {item.date}
                                    </TextH2t>
                                    <TextH2t style={{ color: '#ffffff', fontSize: 23, fontFamily: 'Montserrat_Bold' }}>
                                        {item.title}
                                    </TextH2t>
                                    <TextH2t style={{ color: '#b3b5bb', fontSize: 13 }}>
                                        {item.hour}
                                    </TextH2t>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextH2t style={{ color: '#b3b5bb', fontSize: 13 }}># Techno</TextH2t>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <Icon type="FontAwesome" name="ticket"
                                                  style={{ fontSize: 17, color: '#b3b5bb', paddingRight: 5 }}/>
                                            <TextH2t style={{
                                                color: '#b3b5bb',
                                                fontSize: 13,
                                            }}>{item.tickets > 0 ? `${item.tickets} ${i18n.t('events.available')}` : i18n.t('events.full')}</TextH2t>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => (`list-item-${index}`)}
                />
                <Spacer size={20}/>
            </Content>
        </Container>
    );
};

EventsListing.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    reFetch: PropTypes.func,
};

EventsListing.defaultProps = {
    error: null,
    reFetch: null,
};

export default EventsListing;
