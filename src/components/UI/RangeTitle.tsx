import React, { FC, useState } from 'react';
import {
  HStack,
  Box,
  Text,
  Select,
  CheckIcon, IconButton, VStack,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { Layout, SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { RootDispatch, RootState } from '../../store';
import ErrorWidget from './ErrorWidget';
import CurrencySwitcher from './CurrencySwitcher';

const RangeTitle: FC = () => {
  const firefly = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();
  const displayFilter = useSelector((state: RootState) => state.configuration.displayFilter);

  return (
    <>
      <Box
        shadow={0}
        right={0}
        left={0}
        position="absolute"
        backgroundColor="white"
        zIndex={30}
        alignItems="center"
        justifyContent="center"
        safeAreaTop
      >
        <HStack px={3} pb={1} justifyContent="space-between" alignItems="center">
          <IconButton
            shadow={1}
            borderRadius={15}
            variant="solid"
            _icon={{
              as: AntDesign,
              name: 'arrowleft',
              size: 6,
            }}
            onPress={() => dispatch.firefly.handleChangeRange({ direction: -1 })}
            onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />

          <VStack px={3} flex={1} justifyContent="space-between">
            <Text style={{ fontFamily: 'Montserrat_Bold', fontSize: 22, lineHeight: 25 }}>
              {firefly.rangeTitle}
            </Text>
            <Text style={{ fontSize: 14 }}>
              {`${moment(firefly.start).format('ll')} - ${moment(firefly.end).format('ll')}`}
            </Text>
          </VStack>

          <ErrorWidget />

          <IconButton
            shadow={0}
            mx={3}
            borderRadius={15}
            _icon={{
              as: AntDesign,
              name: 'filter',
              size: 6,
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
            shadow={1}
            borderRadius={15}
            variant="solid"
            _icon={{
              as: AntDesign,
              name: 'arrowright',
              size: 6,
            }}
            onPress={() => dispatch.firefly.handleChangeRange({ direction: 1 })}
            onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
        </HStack>
      </Box>
      <Box>
        <Box height={55} />
        <Box bgColor="gray.100" height={41} display={!displayFilter ? 'none' : ''} />
        <Animated.View layout={Layout}>
          <CurrencySwitcher />
          <VStack
            bgColor="white"
            height={1}
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 1.7,
            }}
          />
        </Animated.View>
      </Box>
    </>
  );
};

export default RangeTitle;
