import React, { useCallback, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from 'native-base';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { Entypo, Feather } from '@expo/vector-icons';

import { RootDispatch, RootState } from '../../store';
import { useThemeColors } from '../../lib/common';
import AssetsHistoryChart from '../Charts/AssetsHistoryChart';
import BalanceHistoryChart from '../Charts/BalanceHistoryChart';
import Pagination from '../UI/Pagination';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function ChartScreen() {
  const { colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();

  const rangeDetails = useSelector((state: RootState) => state.firefly.rangeDetails);
  const { firefly: { getAccountChart, getBalanceChart } } = useDispatch<RootDispatch>();

  const prevFiltersRef = useRef<string>();
  const scrollRef = React.useRef(null);
  const viewPagerRef = useRef<PagerView>();
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const renderIcons = [
    <Entypo key="line-graph" name="line-graph" size={20} color={colors.text} />,
    <Feather key="bar-chart-2" name="bar-chart-2" size={20} color={colors.text} />,
  ];

  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          if (isActive) {
            await Promise.all([getAccountChart(), getBalanceChart()]);
          }
        } catch (e) {
          // catch error
        }
      };

      if (prevFiltersRef.current !== `${rangeDetails.start}-${rangeDetails.end}`) {
        fetchData();
        prevFiltersRef.current = `${rangeDetails.start}-${rangeDetails.end}`;
      }

      return () => {
        isActive = false;
      };
    }, [rangeDetails]),
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: safeAreaInsets.top + 53,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'center',
      }}
    >
      <Box alignItems="center" p={2}>
        <Pagination
          renderIcons={renderIcons}
          handlePress={(index) => viewPagerRef?.current?.setPage(index)}
          scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
          positionAnimatedValue={positionAnimatedValue}
        />
      </Box>

      <AnimatedPagerView
        ref={viewPagerRef}
        initialPage={0}
        style={{ flex: 1 }}
        onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
          [
            {
              nativeEvent: {
                offset: scrollOffsetAnimatedValue,
                position: positionAnimatedValue,
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
      >
        <AssetsHistoryChart key="1" />
        <BalanceHistoryChart key="2" />
      </AnimatedPagerView>

      <View style={{ height: 100 }} />

    </View>
  );
}
