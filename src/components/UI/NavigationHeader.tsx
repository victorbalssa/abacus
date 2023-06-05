import React, { FC, useMemo } from 'react';
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
import { useThemeColors } from '../../lib/common';
import ThemeBlurView from './ThemeBlurView';

type NavigationHeaderType = {
  relative?: boolean
}

const NavigationHeader: FC<NavigationHeaderType> = ({ relative = false }: NavigationHeaderType) => {
  const { rangeTitle, start, end } = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();
  const { colorScheme } = useThemeColors();

  return useMemo(() => (
    <ThemeBlurView
      intensity={60}
      tint={colorScheme}
      style={{
        position: relative ? 'relative' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Box
        alignItems="center"
        justifyContent="center"
        safeAreaTop
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
              {rangeTitle}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {`${moment(start).format('ll')} - ${moment(end).format('ll')}`}
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
    rangeTitle,
    start,
    end,
  ]);
};

export default NavigationHeader;
