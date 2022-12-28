import React, { FC } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Svg, Path } from 'react-native-svg';
import { Box, IconButton } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';

import OauthContainer from '../containers/Oauth';
import ConfigurationContainer from '../containers/Configuration';
import HomeContainer from '../containers/Home';
import ChartContainer from '../containers/Chart';
import TransactionsListContainer from '../containers/Transactions/List';
import TransactionsEditContainer from '../containers/Transactions/Edit';
import TransactionsCreateContainer from '../containers/Transactions/Create';
import colors from '../constants/colors';

import { translate } from '../i18n/locale';

const Stack = createNativeStackNavigator();
const Stack2 = createStackNavigator();
const Tab = createBottomTabNavigator();
const windowHeight = Dimensions.get('window').height;

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(255,255,255)',
  },
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
const TabBg = () => (
  <Svg width={75} height={81} viewBox="0 0 75 81" style={styles.background}>
    <Path
      d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
      fill={colors.tabBackgroundColor}
    />
  </Svg>
);

// custom tabBarButton
const TabBarAdvancedButton = ({ onPress }) => (
  <Box style={styles.container} pointerEvents="box-none">
    <TabBg />
    <IconButton
      variant="solid"
      _icon={{
        as: AntDesign,
        name: 'edit',
        size: 'lg',
      }}
      onPress={() => {
        onPress();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      _pressed={{
        style: {
          ...styles.button,
          transform: [{
            scale: 0.95,
          }],
          opacity: 0.95,
        },
      }}
      style={styles.button}
    />
  </Box>
);

const TransactionNavigator = () => (
  <Stack2.Navigator screenOptions={{ headerShown: false }}>
    <Stack2.Screen
      name="TransactionsList"
      component={TransactionsListContainer}
    />
  </Stack2.Navigator>
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
      tabBarInactiveBackgroundColor: colors.tabBackgroundColor,
      tabBarActiveBackgroundColor: colors.tabBackgroundColor,
      tabBarActiveTintColor: colors.brandStyle,
      tabBarInactiveTintColor: colors.tabInactiveDarkLight,
      headerShown: false,
      tabBarShowLabel: true,
      tabBarLazyLoad: true,
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        height: 75,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontFamily: 'Montserrat_Bold',
      },
    })}
  >
    <Tab.Screen
      name={translate('navigation_home_tab')}
      options={{
        tabBarIcon: (icon) => (
          <AntDesign
            name="home"
            size={22}
            color={icon.color}
          />
        ),
      }}
      component={HomeContainer}
    />
    <Tab.Screen
      name={translate('navigation_chart_tab')}
      component={ChartContainer}
      options={{
        tabBarIcon: (icon) => (
          <AntDesign
            name="linechart"
            size={22}
            color={icon.color}
          />
        ),
      }}
    />
    <Tab.Screen
      name={translate('navigation_create_tab')}
      component={HomeContainer}
      options={({ navigation }) => ({
        tabBarButton: () => (
          <TabBarAdvancedButton onPress={() => navigation.navigate('TransactionsCreateModal')} />
        ),
      })}
    />
    <Tab.Screen
      name={translate('navigation_transactions_tab')}
      component={TransactionNavigator}
      options={{
        tabBarIcon: (icon) => (
          <Feather name="list" size={25} color={icon.color} />
        ),
      }}
    />
    <Tab.Screen
      name={translate('navigation_settings_tab')}
      component={ConfigurationContainer}
      options={{
        tabBarIcon: (icon) => (
          <AntDesign
            name="setting"
            size={22}
            color={icon.color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const Index: FC = () => (
  <NavigationContainer theme={MyTheme}>
    <Stack.Navigator initialRouteName="dashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="oauth"
        component={OauthContainer}
      />
      <Stack.Screen
        name="dashboard"
        component={Home}
      />
      <Stack2.Group
        screenOptions={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: true,
          gestureResponseDistance: windowHeight,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      >
        <Stack2.Screen
          name="TransactionsEditModal"
          component={TransactionsEditContainer}
        />
        <Stack2.Screen
          name="TransactionsCreateModal"
          component={TransactionsCreateContainer}
        />
      </Stack2.Group>
    </Stack.Navigator>
  </NavigationContainer>
);

export default Index;
