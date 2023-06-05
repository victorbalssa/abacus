import React, { FC } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Foundation } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Box, IconButton } from 'native-base';
import { StyleSheet, Dimensions, Platform } from 'react-native';

import {
  BottomSheetAndroid,
  ModalTransition,
} from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import OauthContainer from '../containers/Oauth';
import ConfigurationContainer from '../containers/Configuration';
import HomeContainer from '../containers/Home';
import ChartContainer from '../containers/Chart';
import TransactionsListContainer from '../containers/Transactions/List';
import TransactionsEditContainer from '../containers/Transactions/Edit';
import TransactionsCreateContainer from '../containers/Transactions/Create';

import { translate } from '../i18n/locale';
import { useThemeColors } from '../lib/common';
import ThemeBlurView from '../components/UI/ThemeBlurView';

const Stack = createNativeStackNavigator();
const Stack2 = createStackNavigator();
const Tab = createBottomTabNavigator();
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  navigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    height: 0,
  },
  container: {
    position: 'relative',
    width: 45,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
  },
});

// custom tabBarButton
const TabBarAdvancedButton = ({ onPress }) => (
  <Box style={styles.container} pointerEvents="box-none">
    <IconButton
      _icon={{
        as: AntDesign,
        name: 'plus',
      }}
      onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      onPress={onPress}
      _pressed={{
        style: {
          top: -15,
        },
      }}
      style={{
        top: -15,
      }}
    />
  </Box>
);

const TransactionNavigator: FC = () => (
  <Stack2.Navigator screenOptions={{ headerShown: false }}>
    <Stack2.Screen
      name="TransactionsList"
      component={TransactionsListContainer}
    />
  </Stack2.Navigator>
);

const Home: FC = () => {
  const { colorScheme, colors } = useThemeColors();

  return (
    <Tab.Navigator
      tabBar={({
        state, descriptors, navigation, insets,
      }) => (
        <ThemeBlurView
          intensity={50}
          tint={colorScheme}
          style={styles.navigatorContainer}
        >
          <BottomTabBar
            state={state}
            descriptors={descriptors}
            navigation={navigation}
            insets={insets}
          />
        </ThemeBlurView>
      )}
      screenOptions={() => ({
        tabBarInactiveBackgroundColor: colors.tabBackgroundColor,
        tabBarActiveBackgroundColor: colors.tabBackgroundColor,
        tabBarActiveTintColor: colors.brandStyle,
        tabBarInactiveTintColor: colors.tabInactiveDarkLight,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLazyLoad: true,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.backgroundColor,
          borderTopWidth: 0,
          marginTop: 10,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Montserrat',
          paddingBottom: 10,
        },
      })}
    >
      <Tab.Screen
        name={translate('navigation_home_tab')}
        options={{
          tabBarIcon: (icon) => (
            <Foundation
              name="home"
              size={24}
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
              size={20}
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
            <AntDesign
              name="bars"
              size={25}
              color={icon.color}
            />
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
};

const Index: FC = () => {
  const { colors } = useThemeColors();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.tabBackgroundColor,
        },
      }}
    >
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
};

export default Index;
