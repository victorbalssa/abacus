import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import OauthContainer from '../../containers/Oauth';
import ConfigurationContainer from '../../containers/Configuration';
import DashboardContainer from '../../containers/Dashboard';
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

function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({
          focused,
          color,
        }) => {
          let iconName;

          if (route.name === 'dashboard-tab') {
            iconName = focused
              ? 'view-dashboard'
              : 'view-dashboard-outline';
            return <MaterialCommunityIcons name={iconName} size={30} color={color} />;
          }
          iconName = focused ? 'ios-settings' : 'ios-settings-outline';
          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: colors.brandStyle,
        tabBarInactiveTintColor: colors.brandDarkLight,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLazyLoad: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: 100,
        },
      })}
    >
      <Tab.Screen
        name="dashboard-tab"
        component={DashboardContainer}
      />
      <Tab.Screen
        name="configuration-tab"
        component={ConfigurationContainer}
      />
    </Tab.Navigator>
  );
}

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
