import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather } from '@expo/vector-icons';

import { Svg, Path } from 'react-native-svg';
import { Box } from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native';
import OauthContainer from '../../containers/Oauth';
import ConfigurationContainer from '../../containers/Configuration';
import DashboardContainer from '../../containers/Dashboard';
import ChartContainer from '../../containers/Chart';
import colors from '../../constants/colors';
import { isiPhoneX } from '../../lib/common';

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

const styles = StyleSheet.create({
  navigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // SHADOW
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3.22,
  },
  navigator: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 30,
  },
  xFillLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  container: {
    position: 'relative',
    width: 75,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
  },
  button: {
    top: -22.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 27,
    backgroundColor: colors.brandStyle,
  },
  buttonIcon: {
    fontSize: 16,
    color: colors.tabBackgroundColor,
  },
});

// background svg which will create space
const TabBg = ({ ...props }) => (
  <Svg width={75} height={81} viewBox="0 0 75 81" {...props}>
    <Path
      d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
      fill={colors.tabBackgroundColor}
    />
  </Svg>
);

// custom tabBarButton
const TabBarAdvancedButton = ({ ...props }) => (
  <Box style={styles.container} pointerEvents="box-none">
    <TabBg style={styles.background} />
    <TouchableOpacity
      style={styles.button}
      onPress={props.onPress}
    >
      <AntDesign
        name="edit"
        size={24}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  </Box>
);

const Home = () => (
  <Tab.Navigator
    tabBar={({
      state, descriptors, navigation, insets,
    }) => (
      <Box style={styles.navigatorContainer}>
        <BottomTabBar
          state={state}
          descriptors={descriptors}
          navigation={navigation}
          insets={insets}
        />
        <Box style={[styles.xFillLine, { backgroundColor: colors.tabBackgroundColor }]} />
      </Box>
    )}
    screenOptions={({ route }) => ({
      tabBarIcon: (icon) => (
        <AntDesign
          name={tabIconConfig[route.name]}
          size={20}
          color={icon.color}
        />
      ),
      tabBarInactiveBackgroundColor: colors.tabBackgroundColor,
      tabBarActiveBackgroundColor: colors.tabBackgroundColor,
      tabBarActiveTintColor: colors.brandStyle,
      tabBarInactiveTintColor: colors.tabInactiveDarkLight,
      headerShown: false,
      tabBarShowLabel: true,
      tabBarLazyLoad: true,
      tabBarStyle: {
        fontFamily: 'Montserrat',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        height: 75,
      },
      tabBarLabelStyle: {
        fontSize: 12,
      }
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
      name="Create"
      component={ChartContainer}
      options={{
        tabBarButton: (props) => (
          <TabBarAdvancedButton
            {...props}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Transactions"
      component={ChartContainer}
      options={{
        tabBarIcon: (icon) => (
          <Feather name="list" size={25} color={icon.color} />
        ),
      }}
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
