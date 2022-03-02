import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Form, Item, Label, Input, Card, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from '../UI/Messages';
import Spacer from '../UI/Spacer';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import commonColor from '../../../constants/colors';
import ButtonH2t from '../UI/ButtonH2t';
import { StatusBar } from 'expo-status-bar';
import i18n from '../../../translations/i18n';

class SignUp extends React.Component {
    static propTypes = {
        success: PropTypes.string,
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        onFormSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        error: null,
        success: null,
    };

    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: '',
        code: '',
    };

    constructor (props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (name, val) => this.setState({ [name]: val });

    handleSubmit = () => {
        const { onFormSubmit } = this.props;
        onFormSubmit(this.state)
            .then(() => setTimeout(() => {
                Actions.pop();
                Actions.login();
            }, 1000))
            .catch(() => {});
    };

    render () {
        const { loading, error, success } = this.props;

        return (
            <KeyboardAvoidingView
                style={{ backgroundColor: commonColor.backgroundColor, flex: 1 }}
                behavior={(Platform.OS === 'ios') ? 'padding' : null}
                enabled
                keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}>
                <StatusBar style="light"/>
                <ScrollView>
                    <Container style={{ backgroundColor: commonColor.backgroundColor }}>
                        <Content padder>
                            <Card style={{ marginTop: 10, backgroundColor: commonColor.backgroundColor }}>
                                <View padder>
                                    {error && <View style={{ margin: 10 }}><Messages message={error}/></View>}
                                    {success &&
                                    <View style={{ margin: 10 }}><Messages type="success" message={success}/></View>}
                                    <Form>
                                        <Item floatingLabel style={{ margin: 15 }}>
                                            <Label style={{ color: '#fff', fontFamily: 'Montserrat' }}>
                                                {i18n.t('login.fields.firstName')}
                                            </Label>
                                            <Input
                                                disabled={loading}
                                                style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                                onChangeText={v => this.handleChange('firstName', v)}
                                            />
                                        </Item>
                                        <Item floatingLabel style={{ margin: 15 }}>
                                            <Label style={{ color: '#fff', fontFamily: 'Montserrat' }}>
                                                {i18n.t('login.fields.lastName')}
                                            </Label>
                                            <Input
                                                disabled={loading}
                                                style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                                onChangeText={v => this.handleChange('lastName', v)}
                                            />
                                        </Item>

                                        <Item floatingLabel style={{ margin: 15 }}>
                                            <Label style={{ color: '#fff', fontFamily: 'Montserrat' }}>
                                                {i18n.t('login.fields.email')}
                                            </Label>
                                            <Input
                                                disabled={loading}
                                                style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                onChangeText={v => this.handleChange('email', v)}
                                            />
                                        </Item>

                                        <Item floatingLabel style={{ margin: 15 }}>
                                            <Label style={{ color: '#fff', fontFamily: 'Montserrat' }}>
                                                {i18n.t('login.fields.password')}
                                            </Label>
                                            <Input
                                                disabled={loading}
                                                style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                                secureTextEntry
                                                onChangeText={v => this.handleChange('password', v)}
                                            />
                                        </Item>

                                        <Item floatingLabel style={{ margin: 15 }}>
                                            <Label style={{ color: '#fff', fontFamily: 'Montserrat' }}>
                                                {i18n.t('login.fields.confirmPassword')}
                                            </Label>
                                            <Input
                                                disabled={loading}
                                                style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                                secureTextEntry
                                                selectionColor={'white'}
                                                onChangeText={v => this.handleChange('password2', v)}
                                            />
                                        </Item>
                                        <Spacer size={40}/>
                                        <ButtonH2t text={'login.signUp'} loading={loading} onPress={this.handleSubmit}/>
                                    </Form>
                                </View>
                            </Card>
                        </Content>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

export default SignUp;
