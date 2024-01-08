import React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import { useThemeColors } from '../../lib/common';

const DOT_SIZE = 40;

export default function Pagination({
  renderIcons,
  handlePress,
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  renderIcons: React.JSX.Element[];
  handlePress: (item: number) => void;
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) {
  const { colors } = useThemeColors();
  const inputRange = [0, renderIcons.length];
  const translateX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, renderIcons.length * DOT_SIZE],
  });

  return (
    <View style={{
      flexDirection: 'row',
      height: DOT_SIZE,
    }}
    >
      <Animated.View
        style={[
          {
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderBottomWidth: 2,
            borderColor: colors.text,
          },
          {
            position: 'absolute',
            transform: [{ translateX }],
          },
        ]}
      />
      {renderIcons.map((item, index) => (
        <TouchableOpacity
          onPress={() => handlePress(index)}
          key={`${item.key}`}
          style={{
            width: DOT_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderIcons[index]}
        </TouchableOpacity>
      ))}
    </View>
  );
}
