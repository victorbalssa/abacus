import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Form, Item, Label, Input, View, Card, } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from '../UI/Messages';
import Spacer from '../UI/Spacer';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import commonColor from '../../../constants/colors';
import ButtonH2t from '../UI/ButtonH2t';
import { StatusBar } from 'expo-status-bar';
import i18n from '../../../translations/i18n';

class ForgotPassword extends React.Component {
    static propTypes = {
        member: PropTypes.shape({
            email: PropTypes.string,
        }),
        error: PropTypes.string,
        success: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        onFormSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        success: null,
        error: null,
        member: {},
    };

    constructor (props) {
        super(props);
        this.state = {
            email: (props.member && props.member.email) ? props.member.email : '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (name, val) => this.setState({ [name]: val });

    handleSubmit = () => {
        const { onFormSubmit } = this.props;

        return onFormSubmit(this.state)
            .then(() => setTimeout(() => {
                Actions.pop();
                Actions.login();
            }, 1000))
            .catch(() => {});
    };

    render () {
        const { loading, error, success } = this.props;
        const { email } = this.state;

        return (
            <KeyboardAvoidingView
                style={{ backgroundColor: commonColor.backgroundColor, flex: 1 }}
                behavior={(Platform.OS === 'ios') ? 'padding' : null}
                enabled
                keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}>
                <ScrollView contentContainerStyle={{ height: 400 }}>
                    <StatusBar style="light"/>
                    <Container style={{ backgroundColor: commonColor.backgroundColor }}>
                        <Content padder>
                            <Card style={{ backgroundColor: commonColor.backgroundColor }}>
                                {error && <View style={{ margin: 10 }}><Messages message={error}/></View>}
                                {success &&
                                <View style={{ margin: 10 }}><Messages type="success" message={success}/></View>}
                                <Form>
                                    <Item floatingLabel style={{ margin: 15 }}>
                                        <Label style={{ color: '#fff', fontFamily: 'Montserrat' }}>
                                            {i18n.t('login.forgotLabel')}
                                        </Label>
                                        <Input
                                            style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                            autoCapitalize="none"
                                            value={email}
                                            keyboardType="email-address"
                                            disabled={loading}
                                            onChangeText={v => this.handleChange('email', v)}
                                        />
                                    </Item>

                                    <Spacer size={20}/>

                                    <ButtonH2t text={'login.forgotBtn'} loading={loading} onPress={this.handleSubmit}/>
                                </Form>
                            </Card>
                        </Content>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

export default ForgotPassword;
