import React, { useMemo } from 'react';
import {
  HStack,
  Box,
  Text,
  IconButton,
  VStack,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { RootDispatch, RootState } from '../../store';
import ErrorWidget from './ErrorWidget';
import ThemeBlurView from './ThemeBlurView';
import { useThemeColors } from '../../lib/common';

const NavigationHeader = ({
  navigationState,
  relative = false,
}) => {
  const { colors } = useThemeColors();
  const rangeDetails = useSelector((state: RootState) => state.firefly.rangeDetails || {
    title: '', range: 3, end: '', start: '',
  });
  const dispatch = useDispatch<RootDispatch>();
  const navigationStateIndex = navigationState.index;

  return useMemo(() => (
    <ThemeBlurView
      intensity={60}
      style={{
        position: relative ? 'relative' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.tileBackgroundColor,
        display: navigationState.index === 4 ? 'none' : undefined,
      }}
    >
      <Box
        alignItems="center"
        justifyContent="center"
        safeAreaTop
        borderBottomWidth={1}
        borderColor={colors.listBorderColor}
      >
        <HStack px={3} py={2} justifyContent="space-between" alignItems="center">
          <IconButton
            variant="ghost"
            _icon={{
              as: FontAwesome,
              name: 'angle-left',
              px: 2,
            }}
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
          </VStack>

          <ErrorWidget />

          <IconButton
            variant="ghost"
            _icon={{
              as: FontAwesome,
              name: 'angle-right',
              size: 'lg',
              px: 2,
            }}
            onPress={() => dispatch.firefly.handleChangeRange({ direction: 1 })}
            onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />

        </HStack>
      </Box>
    </ThemeBlurView>
  ), [
    navigationStateIndex,
    rangeDetails,
  ]);
};

export default NavigationHeader;
