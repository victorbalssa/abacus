import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Colors from '../../../constants/colors';
import TextI18n from './TextI18n';

const Messages = ({ message, type }) => (
    <View style={{
        backgroundColor: (type === 'error') ? Colors.brandDanger : (type === 'success') ? Colors.brandSuccess : Colors.brandInfo,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 7
    }}
    >
        <TextI18n style={{ color: '#fff', textAlign: 'center' }}>
            {message}
        </TextI18n>
    </View>
);

Messages.propTypes = {
    message: PropTypes.string,
    type: PropTypes.oneOf(['error', 'success', 'info']),
};

Messages.defaultProps = {
    message: 'An unexpected error came up',
    type: 'error',
};

export default Messages;
