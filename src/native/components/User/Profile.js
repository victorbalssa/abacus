import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Container, Content, List, ListItem, Body, Left, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Header from '../UI/Header';
import CardH2t from '../UI/CardH2t';
import Spacer from '../UI/Spacer';
import { StatusBar } from 'expo-status-bar';
import commonColor from '../../../constants/colors';
import TextH2t from '../UI/TextH2t';
import TextI18n from '../UI/TextI18n';
import i18n from '../../../translations/i18n';

const Profile = ({ member, logout, switchLanguage }) => (
    <Container style={{ backgroundColor: commonColor.backgroundColor }}>
        <StatusBar style="light"/>
        <Content>
            <Spacer size={50}/>
            <List>
                {(member && member.email) ? (
                    <View>
                        <Content padder>
                            <Header
                                title={`${member.firstName}`}
                                content={`${i18n.t('profile.connectWith')} : ${member.email}`}
                            />
                        </Content>
                        <ListItem onPress={switchLanguage} icon>
                            <Left>
                                <Icon style={{ color: '#fff' }} name="language"
                                      type="MaterialIcons"/>
                            </Left>
                            <Body style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}>
                                <TextI18n>
                                    global.currentLanguage
                                </TextI18n>
                                <TextH2t style={{ fontSize: 20, marginRight: 20 }}>
                                    {member.locale === 'fr' && 'Fr 🇫🇷'}
                                    {member.locale === 'en' && 'En 🇬🇧'}
                                </TextH2t>
                            </Body>
                        </ListItem>
                        <ListItem onPress={Actions.updateProfile} icon>
                            <Left>
                                <Icon style={{ color: '#fff' }} name="person-add"/>
                            </Left>
                            <Body>
                                <TextI18n>profile.myAccount</TextI18n>
                            </Body>
                        </ListItem>
                        <ListItem onPress={logout} icon>
                            <Left>
                                <Icon style={{ color: '#fff' }} name="power"/>
                            </Left>
                            <Body>
                                <TextI18n>profile.logout</TextI18n>
                            </Body>
                        </ListItem>
                        <Spacer size={20}/>
                        {member.role && member.role.toLowerCase().includes('admin') &&
                        <ListItem onPress={Actions.scan} icon>
                            <Left>
                                <Icon style={{ fontSize: 23, color: '#fff' }} type="AntDesign" name="scan1"/>
                            </Left>
                            <Body>
                                <TextI18n>profile.scan</TextI18n>
                            </Body>
                        </ListItem>}
                    </View>
                ) : (
                    <View>
                        <Spacer size={40}/>
                        <ListItem onPress={switchLanguage} icon>
                            <Left>
                                <Icon style={{ color: '#fff' }} name="language"
                                      type="MaterialIcons"/>
                            </Left>
                            <Body style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                borderBottomWidth: 0,
                            }}>
                                <TextI18n>
                                    global.currentLanguage
                                </TextI18n>
                                <TextH2t style={{ fontSize: 20, marginRight: 20 }}>
                                    {member.locale === 'fr' ? 'Fr 🇫🇷' : 'En 🇬🇧'}
                                </TextH2t>
                            </Body>
                        </ListItem>
                        <CardH2t
                            source={require('../../../images/Events/account.jpg')}
                            onPress={Actions.login}
                            text1="login.connect"
                            text2="login.connectText"
                        />
                        <CardH2t
                            source={require('../../../images/Events/signIn.jpg')}
                            onPress={Actions.signUp}
                            text1="login.signUp"
                            text2="login.signUpText"
                        />
                        <Spacer size={80}/>
                    </View>
                )}
            </List>
        </Content>
    </Container>
);

Profile.propTypes = {
    member: PropTypes.shape({}),
    logout: PropTypes.func.isRequired,
};

Profile.defaultProps = {
    member: {},
};

export default Profile;
