import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Body, ListItem, Form, Item, Label, Input, View } from 'native-base';
import Messages from '../UI/Messages';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';
import ButtonH2t from '../UI/ButtonH2t';
import { StatusBar } from 'expo-status-bar';
import commonColor from '../../../constants/colors';
import TextH2t from '../UI/TextH2t';
import i18n from '../../../translations/i18n';

class UpdateProfile extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        success: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        onFormSubmit: PropTypes.func.isRequired,
        member: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            email: PropTypes.string,
        }).isRequired,
    };

    static defaultProps = {
        error: null,
        success: null,
    };

    constructor (props) {
        super(props);
        this.state = {
            firstName: props.member.firstName || '',
            lastName: props.member.lastName || '',
            email: props.member.email || '',
            password: '',
            password2: '',
            changeEmail: false,
            changePassword: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (name, val) => this.setState({ [name]: val });

    handleSubmit = () => {
        const { onFormSubmit } = this.props;

        return onFormSubmit(this.state).catch(() => {});
    };

    render () {
        const { loading, error, success } = this.props;
        const {
            firstName, lastName, email, changeEmail, changePassword,
        } = this.state;

        return (
            <Container style={{ backgroundColor: commonColor.backgroundColor }}>
                <StatusBar style="light"/>
                <Content padder>
                    <Header
                        title={i18n.t('profile.myAccount')}
                        content={i18n.t('profile.updateAccount')}
                    />

                    {error && <Messages message={error}/>}
                    {success && <Messages message={success} type="success"/>}

                    <Form>
                        <Item stackedLabel>
                            <Label style={{ fontFamily: 'Montserrat', color: '#fff' }}>
                                {i18n.t('login.fields.firstName')}
                            </Label>
                            <Input
                                value={firstName}
                                style={{ fontFamily: 'Montserrat', color: '#fff' }}
                                disabled={loading}
                                onChangeText={v => this.handleChange('firstName', v)}
                            />
                        </Item>

                        <Item stackedLabel>
                            <Label style={{ fontFamily: 'Montserrat', color: '#fff' }}>
                                {i18n.t('login.fields.lastName')}
                            </Label>
                            <Input
                                value={lastName}
                                style={{ fontFamily: 'Montserrat', color: '#fff' }}
                                disabled={loading}
                                onChangeText={v => this.handleChange('lastName', v)}
                            />
                        </Item>

                        <ListItem icon onPress={() => this.handleChange('changeEmail', !changeEmail)}>
                            <Body>
                                <TextH2t>{i18n.t('login.fields.email')}</TextH2t>
                            </Body>
                        </ListItem>

                        {changeEmail && (
                            <Item stackedLabel>
                                <Label style={{ fontFamily: 'Montserrat', color: '#fff' }}>{i18n.t('login.fields.email')}</Label>
                                <Input
                                    autoCapitalize="none"
                                    value={email}
                                    style={{ fontFamily: 'Montserrat', color: '#fff' }}
                                    keyboardType="email-address"
                                    disabled={loading}
                                    onChangeText={v => this.handleChange('email', v)}
                                />
                            </Item>
                        )}

                        <ListItem icon onPress={() => this.handleChange('changePassword', !changePassword)}>
                            <Body>
                                <TextH2t>{i18n.t('profile.updatePassword')}</TextH2t>
                            </Body>
                        </ListItem>

                        {changePassword && (
                            <View padder>
                                <Item stackedLabel>
                                    <Label style={{ fontFamily: 'Montserrat', color: '#fff' }}>{i18n.t('login.fields.password')}</Label>
                                    <Input
                                        secureTextEntry
                                        style={{ fontFamily: 'Montserrat', color: '#fff' }}
                                        onChangeText={v => this.handleChange('password', v)}
                                        disabled={loading}
                                    />
                                </Item>

                                <Item stackedLabel last>
                                    <Label style={{ fontFamily: 'Montserrat', color: '#fff' }}>{i18n.t('login.fields.confirmPassword')}</Label>
                                    <Input
                                        secureTextEntry
                                        style={{ fontFamily: 'Montserrat', color: '#fff' }}
                                        onChangeText={v => this.handleChange('password2', v)}
                                        disabled={loading}
                                    />
                                </Item>
                            </View>
                        )}

                        <Spacer size={20}/>
                        <ButtonH2t text={'login.update'} onPress={this.handleSubmit}/>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default UpdateProfile;
