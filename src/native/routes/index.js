import React from 'react';
import {Scene, Tabs, Stack} from 'react-native-router-flux';
import {Icon} from 'native-base';

import DefaultProps from '../constants/navigation';

import EventsContainer from '../../containers/Events';
import EventListingComponent from '../components/Event/EventsListing';
import EventViewComponent from '../components/Event/EventView';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/User/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/User/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/User/ForgotPassword';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/User/UpdateProfile';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/User/Profile';
import TicketsListingComponent from '../components/Ticket/TicketsListing';
import TicketViewComponent from '../components/Ticket/TicketView';

import HomeContainer from '../../containers/Home';
import HomeComponent from '../components/Home';
import ScanComponent from '../components/User/Scan';

import WelcomeComponent from '../components/User/Welcome';

const Index = (
  <Stack
    key="root"
  >
    <Scene
      initial
      hideNavBar
      type="replace"
      key="welcome"
      {...DefaultProps.navbarProps}
      component={LoginContainer}
      Layout={WelcomeComponent}
    />
    <Scene
      back
      key="login"
      {...DefaultProps.navbarProps}
      component={LoginContainer}
      Layout={LoginComponent}
    />
    <Scene
      back
      key="signUp"
      {...DefaultProps.navbarProps}
      component={SignUpContainer}
      Layout={SignUpComponent}
    />
    <Scene
      back
      key="forgotPassword"
      {...DefaultProps.navbarProps}
      component={ForgotPasswordContainer}
      Layout={ForgotPasswordComponent}
    />
    <Tabs
      hideNavBar
      showLabel={false}
      key="tabbar"
      tabBarPosition="bottom"
      type="reset"
      {...DefaultProps.tabProps}
    >
      <Stack
        hideNavBar
        key="home"
        icon={({focused}) => (
          <Icon
            type="FontAwesome"
            name="home"
            style={{color: focused ? '#FC1055' : '#CACDD4', fontSize: 25}}
          />
        )}
        {...DefaultProps.navbarProps}
      >
        <Scene key="home" component={HomeContainer} Layout={HomeComponent}/>
      </Stack>

      <Stack
        hideNavBar
        key="events"
        icon={({focused}) => (
          <Icon
            type="Ionicons"
            name="md-search"
            style={{color: focused ? '#FC1055' : '#CACDD4', fontSize: 25}}
          />
        )}
        {...DefaultProps.navbarProps}
      >
        <Scene
          key="eventsListing"
          component={EventsContainer}
          Layout={EventListingComponent}
        />

        <Scene
          back
          hideNavBar
          key="eventView"
          component={EventsContainer}
          Layout={EventViewComponent}
        />
      </Stack>

      <Stack
        hideNavBar
        key="tickets"
        icon={({focused}) => (
          <Icon
            type="FontAwesome"
            name="ticket"
            style={{color: focused ? '#FC1055' : '#CACDD4', fontSize: 22}}
          />
        )}
        {...DefaultProps.navbarProps}
      >
        <Scene
          key="ticketsListing"
          component={MemberContainer}
          Layout={TicketsListingComponent}
        />
        <Scene
          back
          key="ticketView"
          component={MemberContainer}
          Layout={TicketViewComponent}
        />
      </Stack>

      <Stack
        key="profile"
        icon={({focused}) => (
          <Icon
            name="person-circle"
            style={{color: focused ? '#FC1055' : '#CACDD4', fontSize: 25}}
          />
        )}
        {...DefaultProps.navbarProps}
      >
        <Scene
          hideNavBar
          key="profileHome"
          component={MemberContainer}
          Layout={ProfileComponent}
        />

        <Scene
          back
          key="updateProfile"
          {...DefaultProps.navbarProps}
          component={UpdateProfileContainer}
          Layout={UpdateProfileComponent}
        />

        <Scene
          back
          key="scan"
          {...DefaultProps.navbarProps}
          component={MemberContainer}
          Layout={ScanComponent}
        />
      </Stack>
    </Tabs>
  </Stack>
);

export default Index;
