import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content } from 'native-base';
import TextH2t from './TextH2t';

const Error = ({ content }) => (
    <Container>
        <Content>
            <TextH2t>
                {content}
            </TextH2t>
        </Content>
    </Container>
);

Error.propTypes = {
    content: PropTypes.string,
};

export default Error;
