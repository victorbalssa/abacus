import React from 'react';
import {
  HStack,
  Box,
  Text,
  IconButton,
  VStack,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';

import { RootDispatch, RootState } from '../../store';
import ErrorWidget from './ErrorWidget';
import ThemeBlurView from './ThemeBlurView';
import { useThemeColors } from '../../lib/common';

export default function NavigationHeader({ navigation, relative = false }): React.ReactNode {
  const { colors } = useThemeColors();
  const currentCurrency = useSelector((state: RootState) => state.currencies.current);
  const rangeDetails = useSelector((state: RootState) => state.firefly.rangeDetails || {
    title: '', range: 3, end: '', start: '',
  });
  const dispatch = useDispatch<RootDispatch>();
  const navigationStateIndex = navigation.getState().index;

  return (
    <ThemeBlurView
      intensity={45}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Platform.select({ ios: colors.tabBackgroundColor, android: relative ? colors.tileBackgroundColor : colors.tabBackgroundColor }),
        display: [0, 1].includes(navigationStateIndex) ? undefined : 'none',
      }}
    >
      <Box
        alignItems="center"
        justifyContent="center"
        safeAreaTop
        borderColor={colors.listBorderColor}
      >
        <HStack px={2} py={1} justifyContent="space-between" alignItems="center">
          <IconButton
            variant="ghost"
            _icon={{
              color: colors.text,
              as: FontAwesome,
              name: 'angle-left',
              px: 2,
            }}
            colorScheme="black"
            onPress={() => dispatch.firefly.handleChangeRange({ direction: -1 })}
            onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />

          <VStack px={3} flex={1} justifyContent="space-between">
            <Text style={{ fontFamily: 'Montserrat_Bold', fontSize: 18, lineHeight: 18 }}>
              {rangeDetails.title}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {`${moment(rangeDetails.start).format('ll')} - ${moment(rangeDetails.end).format('ll')}`}
            </Text>
            <HStack>
              <HStack style={{
                alignSelf: 'flex-start',
                borderWidth: 0.5,
                borderColor: colors.text,
                borderRadius: 10,
                paddingHorizontal: 5,
                marginHorizontal: 1,
              }}
              >
                <Text style={{
                  fontSize: 10,
                  lineHeight: 14,
                  fontFamily: 'Montserrat_Bold',
                  color: colors.brandNeutral,
                }}
                >
                  {`${currentCurrency?.attributes.code} ${currentCurrency?.attributes.symbol}`}
                </Text>
              </HStack>
              <HStack style={{
                alignSelf: 'flex-start',
                borderWidth: 0.5,
                borderColor: colors.text,
                borderRadius: 10,
                paddingHorizontal: 5,
                marginHorizontal: 1,
              }}
              >
                <Text style={{
                  fontSize: 10,
                  lineHeight: 14,
                  fontFamily: 'Montserrat_Bold',
                  color: colors.brandNeutral,
                }}
                >
                  {`${rangeDetails.range}M`}
                </Text>
              </HStack>
            </HStack>
          </VStack>

          <TouchableOpacity
            style={{
              margin: 5,
              padding: 5,
              borderRadius: 10,
            }}
            onPress={() => navigation.dispatch(
              CommonActions.navigate({
                name: 'FiltersScreen',
              }),
            )}
          >
            <Ionicons name="ios-filter" size={20} color={colors.text} />
          </TouchableOpacity>

          <ErrorWidget />

          <IconButton
            variant="ghost"
            _icon={{
              color: colors.text,
              as: FontAwesome,
              name: 'angle-right',
              size: 'lg',
              px: 2,
            }}
            colorScheme="black"
            onPress={() => dispatch.firefly.handleChangeRange({ direction: 1 })}
            onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />

        </HStack>
      </Box>
    </ThemeBlurView>
  );
}
