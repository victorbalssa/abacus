import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { Icon, View } from 'native-base';
import TextI18n from './TextI18n';

const CardH2t = ({ source, text1, text2, onPress, loading }) => (
    <TouchableOpacity style={{
        flex: 1,
        height: 220,
        padding: 10,
    }} onPress={onPress} disabled={loading}>
        <View style={{
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.46,
            shadowRadius: 11.14,
            elevation: 17,
            borderRadius: 10,
        }}>
            <ImageBackground
                source={source}
                imageStyle={{ resizeMode: 'cover', borderRadius: 15 }}
                style={{
                    width: '100%',
                    height: '100%',

                }}>
                <View style={{
                    flex: 1, padding: 15,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}>
                    <TextI18n style={{ fontSize: 23, textAlign: 'center', fontFamily: 'Montserrat_Bold' }}>
                        {text1}
                    </TextI18n>
                    <TextI18n style={{ fontSize: 17, textAlign: 'center' }}>{text2}</TextI18n>

                    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                        <TextI18n style={{ fontSize: 20, textAlign: 'center', fontFamily: 'Montserrat_Bold' }}>
                            global.go
                        </TextI18n>
                        <Icon type="Entypo" name="chevron-right" style={{ color: 'white', fontSize: 26 }}/>
                    </View>
                </View>
            </ImageBackground>
        </View>
    </TouchableOpacity>
);

CardH2t.propTypes = {
    onPress: PropTypes.func,
    source: PropTypes.number,
};

CardH2t.defaultProps = {
    source: require('../../../images/Events/event.png'),
};

export default CardH2t;
