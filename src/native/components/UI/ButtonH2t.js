import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import colors from '../../../constants/colors';
import Loading from './Loading';
import TextI18n from './TextI18n';

const ButtonH2t = ({ text, style, onPress, loading, disabled = false, icon = null }) => (
    <TouchableOpacity style={{
        flex: 1,
        height: 50,
        borderRadius: 10,
        backgroundColor: disabled ? colors.brandLight : colors.brandStyle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        opacity: disabled ? 0.6 : 1,
        ...style,
    }} onPress={onPress} disabled={loading || disabled}>
        {icon && !loading &&
        <Icon type="FontAwesome" name="ticket" style={{ color: '#fff', fontSize: 20, paddingRight: 5 }}/>}
        {!loading && <TextI18n style={{
            flex: icon ? 0 : 1,
            color: '#fff',
            fontFamily: 'Montserrat',
            fontWeight: 'normal',
            fontSize: 17,
            textAlign: icon ? 'left' : 'center',
        }}>{text}</TextI18n>}
        {loading && <Loading/>}
    </TouchableOpacity>
);

ButtonH2t.propTypes = {
    onPress: PropTypes.func,
};

ButtonH2t.defaultProps = {};

export default ButtonH2t;
