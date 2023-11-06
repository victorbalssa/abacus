import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated as RNAnimated,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming, Easing,
} from 'react-native-reanimated';

import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

const gap = 2;
const iosTabVerticalSpacing = 1;
const TAB_SIZE = 100;
const tabControlStyles = StyleSheet.create({
  tabsContainerStyle: {
    paddingTop: gap,
    paddingBottom: gap,
  },
  tabStyle: {
    flex: 1,
    marginVertical: 1,
    borderRadius: 5,
  },
  tabTextStyle: {
    fontFamily: 'Montserrat_Bold',
    paddingVertical: 2 * gap,
    paddingHorizontal: 2 * gap,
    alignSelf: 'center',
    fontSize: 13,
    color: '#fff',
  },
  activeTabStyle: {
    backgroundColor: '#545454',
  },
  activeTabTextStyle: {
    fontFamily: 'Montserrat_Bold',
    paddingVertical: 2 * gap,
    paddingHorizontal: 2 * gap,
    alignSelf: 'center',
    fontSize: 14,
    color: '#fff',
  },
  firstTabStyle: { marginLeft: 0 },
  lastTabStyle: { marginRight: 0 },
});

function Container({
  translateX,
  children,
  numberValues,
  style,
  activeTabIndex,
  onIndexChange,
}) {
  const { tabStyle, activeTabStyle, tabsContainerStyle } = style;
  const margin = 2;
  // const [containerWidth, setContainerWidth] = useState(0);

  return (
    <View
      style={[
        {
          marginHorizontal: margin,
          flexDirection: 'row',
          position: 'relative',
        },
        tabsContainerStyle,
      ]}
    >
      <RNAnimated.View
        style={{
          width: TAB_SIZE / numberValues,
          left: (TAB_SIZE / numberValues) * activeTabIndex,
          top: iosTabVerticalSpacing,
          bottom: iosTabVerticalSpacing,
          position: 'absolute',
          ...tabStyle,
          ...activeTabStyle,
          transform: [{ translateX }],
        }}
      />
      {children}
    </View>
  );
}

const shouldRenderLeftSeparator = (index, selectedIndex) => {
  const isFirst = index === 0;
  const isSelected = index === selectedIndex;
  const isPrevSelected = index - 1 === selectedIndex;
  return !(isFirst || isSelected || isPrevSelected);
};

function IosTab({
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator,
}) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      {renderLeftSeparator && (
      <View
        style={{
          height: '70%',
          width: 1,
          borderRadius: 5,
          backgroundColor: colors.warmGray100,
        }}
      />
      )}
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={tabControlStyle}>{children}</View>
      </TouchableWithoutFeedback>
    </View>
  );
}

function Tab({
  label,
  onPress,
  isActive,
  isFirst,
  isLast,
  renderLeftSeparator,
}) {
  const {
    tabStyle,
    tabTextStyle,
    activeTabTextStyle,
    firstTabStyle,
    lastTabStyle,
  } = tabControlStyles;
  return (
    <IosTab
      onPress={onPress}
      style={[
        tabStyle,
        isFirst && firstTabStyle,
        isLast && lastTabStyle,
      ]}
      renderLeftSeparator={renderLeftSeparator}
    >
      <Text style={[tabTextStyle, isActive && activeTabTextStyle]}>
        {translate(label)}
      </Text>
    </IosTab>
  );
}

function SegmentedControl({
  values: tabValues,
  selectedIndex,
  onIndexChange,
  renderSeparators,
  translateX,
}) {
  return (
    <Container
      translateX={translateX}
      style={tabControlStyles}
      numberValues={tabValues.length}
      activeTabIndex={selectedIndex}
      onIndexChange={onIndexChange}
    >
      {tabValues.map((tabValue, index) => (
        <Tab
          label={tabValue}
          onPress={() => onIndexChange(index)}
          isActive={selectedIndex === index}
          isFirst={index === 0}
          isLast={index === tabValues.length - 1}
          renderLeftSeparator={
            renderSeparators && shouldRenderLeftSeparator(index, selectedIndex)
          }
          key={tabValue}
        />
      ))}
    </Container>
  );
}

export default function TabControl({
  values,
  onChange,
  defaultIndex,
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  values: string[]
  onChange: (value: string) => void
  defaultIndex: number
  scrollOffsetAnimatedValue: RNAnimated.Value
  positionAnimatedValue: RNAnimated.Value
}) {
  const inputRange = [0, values.length];
  const translateX = RNAnimated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, values.length * TAB_SIZE],
  });
  const { colors } = useThemeColors();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
    onChange(values[index]);
  };

  useEffect(() => {
    handleIndexChange(defaultIndex);
  }, [defaultIndex]);

  return (
    <View
      style={{
        backgroundColor: colors.tileBackgroundColor,
        borderRadius: 7,
        marginHorizontal: 15,
        marginVertical: 5,
        borderWidth: 0.5,
        borderColor: colors.listBorderColor,
      }}
    >
      <GestureHandlerRootView>
        <SegmentedControl
          translateX={translateX}
          values={values}
          selectedIndex={selectedIndex}
          onIndexChange={handleIndexChange}
          renderSeparators
        />
      </GestureHandlerRootView>
    </View>
  );
}
