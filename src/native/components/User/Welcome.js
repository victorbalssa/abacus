import React from 'react';
import PropTypes from 'prop-types';
import {
    Container, Content, View, Text, Card, Left, Icon, Body, ListItem
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import Spacer from '../UI/Spacer';
import Loading from '../UI/Loading';
import TextI18n from '../UI/TextI18n';
import commonColor from '../../../constants/colors';

class Welcome extends React.Component {
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

    constructor(props) {
        super(props);
        this.state = {
            email: (props.member && props.member.email) ? props.member.email : '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (name, val) => this.setState({ [name]: val });

    handleSubmit = () => {
        const { onFormSubmit } = this.props;

        return onFormSubmit(this.state)
            .then(() => setTimeout(() => Actions.tabbar(), 100))
            .catch(() => {});
    };

    render() {
        const { loading } = this.props;

        return (<Container style={{ backgroundColor: commonColor.backgroundColor }}>
            <StatusBar style="light"/>
            <Content padder style={{ flex: 1 }}>
                <Spacer size={60}/>
                <Text style={{
                    flex: 1,
                    fontSize: 55,
                    fontWeight: '400',
                    fontFamily: 'Montserrat_Bold',
                    color: 'white',
                    textAlign: 'center',
                }}>
                    {'Expo\nTicket App'}
                </Text>
                <LottieView
                    loop={true}
                    autoPlay
                    speed={1.5}
                    style={{ width: '100%' }}
                    source={require('../../../images/home')}
                />
                {!loading && <View>
                    <Card style={{ backgroundColor: commonColor.brandStyle }}>
                        <ListItem onPress={Actions.login} icon first>
                            <Left>
                                <Icon name="log-in" style={{ color: 'white' }}/>
                            </Left>
                            <Body style={{ borderBottomWidth: 0 }}>
                                <TextI18n style={{
                                    color: 'white',
                                    fontSize: 20
                                }}>
                                    login.connect
                                </TextI18n>
                            </Body>
                        </ListItem>
                        <ListItem onPress={Actions.signUp} icon>
                            <Left>
                                <Icon name="add-circle" style={{ color: 'white' }}/>
                            </Left>
                            <Body style={{ borderBottomWidth: 0 }}>
                                <TextI18n style={{
                                    color: 'white',
                                    fontSize: 20
                                }}>
                                    login.signUp
                                </TextI18n>
                            </Body>
                        </ListItem>
                    </Card>
                    <TextI18n
                        onPress={Actions.tabbar}
                        style={{
                            flex: 1,
                            fontSize: 13,
                            fontWeight: '400',
                            fontFamily: 'Montserrat',
                            paddingTop: 10,
                            color: 'white',
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                        }}>
                        login.withoutAccount
                    </TextI18n>
                </View>}
                {loading && <Loading/>}
            </Content>
        </Container>);
    }
}

export default Welcome;
