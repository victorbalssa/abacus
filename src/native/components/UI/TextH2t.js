import React from 'react';
import { Text } from 'native-base';

const TextH2t = (props) => {
    return (
        <Text onPress={props.onPress}
              style={{ color: '#fff', textAlign: 'left', fontFamily: 'Montserrat', ...props.style }}>
            {props.children}
        </Text>
    );
};

export default TextH2t;
