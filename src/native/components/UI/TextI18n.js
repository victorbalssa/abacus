import React from 'react';
import { Text } from 'native-base';
import i18n from '../../../translations/i18n';

export default (props) => {
    return (
        <Text onPress={props.onPress}
              style={{ color: '#fff', textAlign: 'left', fontFamily: 'Montserrat', ...props.style }}>
            {i18n.t(props.children)}
        </Text>
    );
};
