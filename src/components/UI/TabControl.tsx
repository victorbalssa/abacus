import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { PanGestureHandler } from 'react-native-gesture-handler';

import { translate } from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

const gap = 2;
const iosTabVerticalSpacing = 1;
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
  },
  activeTabStyle: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  activeTabTextStyle: {
    fontSize: 14.5,
  },
  firstTabStyle: { marginLeft: 0 },
  lastTabStyle: { marginRight: 0 },
});

const Container = ({
  children,
  numberValues,
  style,
  activeTabIndex,
  onIndexChange,
}) => {
  const { tabStyle, activeTabStyle, tabsContainerStyle } = style;
  const margin = 2;
  const [moveAnimation] = useState(new Animated.Value(0));
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const leftVal = (containerWidth / numberValues) * activeTabIndex;
    Animated.timing(moveAnimation, {
      toValue: leftVal,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [containerWidth, activeTabIndex]);

  const onGestureEvent = (evt) => {
    const tabWidth = containerWidth / numberValues;
    let index = Math.floor(evt.nativeEvent.x / tabWidth);
    if (index > numberValues - 1) index = numberValues - 1;
    else if (index < 0) index = 0;
    if (index !== activeTabIndex) {
      onIndexChange(index);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View
        style={[
          {
            marginHorizontal: margin,
            flexDirection: 'row',
            position: 'relative',
          },
          tabsContainerStyle,
        ]}
        onLayout={(event) => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          style={{
            width: containerWidth / numberValues,
            left: moveAnimation,
            top: iosTabVerticalSpacing,
            bottom: iosTabVerticalSpacing,
            position: 'absolute',
            ...tabStyle,
            ...activeTabStyle,
          }}
        />
        {children}
      </View>
    </PanGestureHandler>
  );
};

const shouldRenderLeftSeparator = (index, selectedIndex) => {
  const isFirst = index === 0;
  const isSelected = index === selectedIndex;
  const isPrevSelected = index - 1 === selectedIndex;
  return !(isFirst || isSelected || isPrevSelected);
};

const IosTab = ({
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator,
}) => {
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
};

const Tab = ({
  label,
  onPress,
  isActive,
  isFirst,
  isLast,
  renderLeftSeparator,
}) => {
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
};

const SegmentedControl = ({
  values: tabValues,
  selectedIndex,
  onIndexChange,
  renderSeparators,
}) => (
  <Container
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

const TabControl = ({ values, onChange }) => {
  const { colors } = useThemeColors();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIndexChange = (index) => {
    setSelectedIndex(index);
    onChange(values[index]);
  };

  return (
    <View
      style={{
        backgroundColor: colors.warmGray200,
        borderRadius: 7,
        marginHorizontal: 20,
        marginVertical: 10,
      }}
    >
      <SegmentedControl
        values={values}
        selectedIndex={selectedIndex}
        onIndexChange={handleIndexChange}
        renderSeparators
      />
    </View>
  );
};

export default TabControl;
