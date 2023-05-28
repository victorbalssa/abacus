import React, { FC, useMemo } from 'react';
import {
  HStack,
  Box,
  Text,
  IconButton,
  VStack, useColorModeValue,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { Layout } from 'react-native-reanimated';
import { RootDispatch, RootState } from '../../store';
import ErrorWidget from './ErrorWidget';
import CurrencySwitcher from './CurrencySwitcher';
import { isMediumScreen, isSmallScreen } from '../../lib/common';

const RangeTitle: FC = () => {
  const { rangeTitle, start, end } = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();
  const displayFilter = useSelector((state: RootState) => state.configuration.displayFilter);
  const backgroundColor = useColorModeValue('warmGray.50', 'coolGray.800');

  const tabSize = (() => {
    if (isSmallScreen()) {
      return 28;
    }

    if (isMediumScreen()) {
      return 54;
    }

    return 67;
  })();

  return useMemo(() => (
    <>
      <Box
        shadow={0}
        right={0}
        left={0}
        position="absolute"
        backgroundColor={backgroundColor}
        zIndex={30}
        alignItems="center"
        justifyContent="center"
        safeAreaTop
      >
        <HStack px={3} justifyContent="space-between" alignItems="center">
          <IconButton
            borderRadius={15}
            variant="link"
            size="lg"
            _icon={{
              as: FontAwesome,
              name: 'angle-left',
              px: 2,
            }}
            colorScheme="primary"
            onPress={() => dispatch.firefly.handleChangeRange({ direction: -1 })}
            onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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
            mx={4}
            borderRadius={15}
            variant="link"
            size="sm"
            _icon={{
              as: AntDesign,
              name: 'filter',
            }}
            _pressed={{
              style: {
                transform: [{
                  scale: 0.95,
                }],
                opacity: 0.95,
              },
            }}
            onPress={() => dispatch.configuration.setDisplayFilter(!displayFilter)}
          />

          <IconButton
            borderRadius={15}
            variant="link"
            size="lg"
            _icon={{
              as: FontAwesome,
              name: 'angle-right',
              size: 'lg',
              px: 2,
            }}
            alignContent="center"
            colorScheme="primary"
            onPress={() => dispatch.firefly.handleChangeRange({ direction: 1 })}
            onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />

        </HStack>
      </Box>
      <Box>
        <Box height={tabSize} />
        <Box bgColor="gray.100" height={41} display={!displayFilter ? 'none' : ''} />
        <Animated.View layout={Layout}>
          <CurrencySwitcher />
        </Animated.View>
      </Box>
    </>
  ), [
    displayFilter,
    rangeTitle,
    start,
    end,
  ]);
};

export default RangeTitle;
