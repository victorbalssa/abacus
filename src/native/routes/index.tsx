import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import OauthContainer from '../../containers/Oauth';
import ConfigurationContainer from '../../containers/Configuration';
import DashboardContainer from '../../containers/Dashboard';
import ChartContainer from '../../containers/Chart';
import colors from '../../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(255,255,255)',
  },
};

const tabIconConfig = {
  Home: 'home',
  Chart: 'linechart',
  Settings: 'setting',
};

const Home = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: (icon) => (
        <AntDesign
          name={tabIconConfig[route.name]}
          size={25}
          color={icon.color}
        />
      ),
      tabBarActiveTintColor: colors.brandStyle,
      tabBarInactiveTintColor: colors.brandDarkLight,
      headerShown: false,
      tabBarShowLabel: true,
      tabBarLazyLoad: true,
      tabBarStyle: {
        fontFamily: 'Montserrat',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        height: 80,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={DashboardContainer}
    />
    <Tab.Screen
      name="Chart"
      component={ChartContainer}
    />
    <Tab.Screen
      name="Settings"
      component={ConfigurationContainer}
    />
  </Tab.Navigator>
);

const Index = (
  <NavigationContainer theme={MyTheme}>
    <Stack.Navigator initialRouteName="oauth" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="oauth"
        component={OauthContainer}
      />
      <Stack.Screen
        name="dashboard"
        component={Home}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Index;
