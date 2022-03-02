import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import {
    Container, Content, Form, View, Item, Label, Input, Text, Card, Left, Icon, Body, ListItem,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from '../UI/Messages';
import Spacer from '../UI/Spacer';
import commonColor from '../../../constants/colors';
import ButtonH2t from '../UI/ButtonH2t';
import { StatusBar } from 'expo-status-bar';
import i18n from '../../../translations/i18n';
import TextI18n from '../UI/TextI18n';

class Login extends React.Component {
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
        error: null,
        success: null,
        member: {},
    };

    constructor (props) {
        super(props);
        this.inputs = {};
        this.state = {
            email: (props.member && props.member.email) ? props.member.email : '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (name, val) => this.setState({ [name]: val });

    focusTheField = (id) => {
        this.inputs[id]._root.focus();
    };

    handleSubmit = () => {
        const { onFormSubmit } = this.props;

        return onFormSubmit(this.state)
            .then(() => setTimeout(() => Actions.tabbar(), 100))
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
                <StatusBar style="light"/>
                <ScrollView>
                    <Container style={{ backgroundColor: commonColor.backgroundColor }}>
                        <Content padder>
                            <Spacer size={60}/>
                            <Text style={{
                                flex: 1,
                                fontSize: 75,
                                fontWeight: '400',
                                fontFamily: 'Montserrat_Bold',
                                color: 'white',
                                textAlign: 'center',
                            }}>
                                {'H2T.'}
                            </Text>
                            <Spacer size={60}/>
                            <Card style={{ backgroundColor: commonColor.backgroundColor }}>
                                {error && <View style={{ margin: 10 }}><Messages message={error}/></View>}
                                {success &&
                                <View style={{ margin: 10 }}><Messages type="success" message={success}/></View>}
                                <Form>
                                    <Item floatingLabel style={{ margin: 15 }}>
                                        <Label style={{
                                            color: '#fff',
                                            fontFamily: 'Montserrat',
                                        }}>{i18n.t('login.fields.email')}</Label>
                                        <Input
                                            style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                            autoCapitalize="none"
                                            value={email}
                                            keyboardType="email-address"
                                            disabled={loading}
                                            returnKeyType={'next'}
                                            onChangeText={v => this.handleChange('email', v)}
                                            onSubmitEditing={() => { this.focusTheField('field2'); }}
                                            blurOnSubmit={false}
                                        />
                                    </Item>
                                    <Item floatingLabel style={{ margin: 15 }}>
                                        <Label style={{
                                            color: '#fff',
                                            fontFamily: 'Montserrat',
                                        }}>{i18n.t('login.fields.password')}</Label>
                                        <Input
                                            getRef={input => { this.inputs['field2'] = input; }}
                                            style={{ color: '#fff', fontFamily: 'Montserrat' }}
                                            secureTextEntry
                                            disabled={loading}
                                            returnKeyType={'go'}
                                            onChangeText={v => this.handleChange('password', v)}
                                            onSubmitEditing={this.handleSubmit}
                                        />
                                    </Item>

                                    <Spacer size={20}/>

                                    <ButtonH2t text={'login.connect'} loading={loading} onPress={this.handleSubmit}/>
                                </Form>
                                <ListItem onPress={Actions.forgotPassword} icon>
                                    <Left>
                                        <Icon style={{ color: 'white' }} name="help-buoy"/>
                                    </Left>
                                    <Body style={{ borderBottomWidth: 0 }}>
                                        <TextI18n style={{ color: 'white' }}>
                                            login.forgotPassword
                                        </TextI18n>
                                    </Body>
                                </ListItem>
                            </Card>
                        </Content>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

export default Login;
