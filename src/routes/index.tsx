import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { AntDesign, Foundation } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Box, IconButton } from 'native-base';
import { StyleSheet, Platform, View } from 'react-native';

import translate from '../i18n/locale';
import { useThemeColors } from '../lib/common';

// Screens
import OauthScreen from '../components/Screens/OauthScreen';
import HomeScreen from '../components/Screens/HomeScreen';
import ChartScreen from '../components/Screens/ChartScreen';
import TransactionsScreen from '../components/Screens/TransactionsScreen';
import ConfigurationScreen from '../components/Screens/ConfigurationScreen';

// Modals
import TransactionCreateModal from '../components/Modals/TransactionCreateModal';
import TransactionEditModal from '../components/Modals/TransactionEditModal';

// UI components
import ThemeBlurView from '../components/UI/ThemeBlurView';
import NavigationHeader from '../components/UI/NavigationHeader';

const Stack = createNativeStackNavigator();
const ModalStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

function TabBarPrimaryButton() {
  const navigation = useNavigation();

  return (
    <Box style={styles.container} pointerEvents="box-none">
      <IconButton
        _icon={{
          as: AntDesign,
          name: 'plus',
        }}
        onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'TransactionCreateModal' }))}
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
}

function PrimaryButtonComponent() {
  return <View />;
}

function TabBarComponent({
  state,
  descriptors,
  navigation,
  insets,
}) {
  return (
    <>
      <ThemeBlurView
        style={{
          ...styles.navigatorContainer,
          borderTopWidth: 0.5,
        }}
      >
        <BottomTabBar
          state={state}
          descriptors={descriptors}
          navigation={navigation}
          insets={insets}
        />
      </ThemeBlurView>
      <NavigationHeader navigationState={state} />
    </>
  );
}

function TabBarChartScreenIcon({ color }) {
  return (
    <AntDesign
      name="linechart"
      size={20}
      color={color}
    />
  );
}

function TabBarHomeScreenIcon({ color }) {
  return (
    <Foundation
      name="home"
      size={24}
      color={color}
    />
  );
}

function TabBarTransactionScreenIcon({ color }) {
  return (
    <AntDesign
      name="bars"
      size={25}
      color={color}
    />
  );
}

function TabBarConfigurationScreenIcon({ color }) {
  return (
    <AntDesign
      name="setting"
      size={22}
      color={color}
    />
  );
}

function Home() {
  const { colors } = useThemeColors();

  return (
    <Tab.Navigator
      tabBar={TabBarComponent}
      screenOptions={() => ({
        tabBarInactiveBackgroundColor: colors.tabBackgroundColor,
        tabBarActiveBackgroundColor: colors.tabBackgroundColor,
        tabBarActiveTintColor: colors.brandStyle,
        tabBarInactiveTintColor: colors.tabInactiveDarkLight,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLazyLoad: true,
        tabBarStyle: {
          backgroundColor: Platform.select({ ios: 'transparent', android: colors.tileBackgroundColor }),
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
        component={HomeScreen}
        options={{
          tabBarIcon: TabBarHomeScreenIcon,
        }}
      />
      <Tab.Screen
        name={translate('navigation_chart_tab')}
        component={ChartScreen}
        options={{
          tabBarIcon: TabBarChartScreenIcon,
        }}
      />
      <Tab.Screen
        name={translate('navigation_create_tab')}
        component={PrimaryButtonComponent}
        options={{
          tabBarButton: TabBarPrimaryButton,
        }}
      />
      <Tab.Screen
        name={translate('navigation_transactions_tab')}
        component={TransactionsScreen}
        options={{
          tabBarIcon: TabBarTransactionScreenIcon,
        }}
      />
      <Tab.Screen
        name={translate('navigation_settings_tab')}
        component={ConfigurationScreen}
        options={{
          tabBarIcon: TabBarConfigurationScreenIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Index() {
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
          component={OauthScreen}
        />
        <Stack.Screen
          name="dashboard"
          component={Home}
        />
        <ModalStack.Group
          screenOptions={{
            headerShown: false,
            presentation: 'modal',
          }}
        >
          <ModalStack.Screen
            name="TransactionCreateModal"
            component={TransactionCreateModal}
          />
          <ModalStack.Screen
            name="TransactionEditModal"
            component={TransactionEditModal}
          />
        </ModalStack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
