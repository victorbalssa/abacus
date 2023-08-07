import React from 'react';
import {
  IconButton,
  Heading,
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { Platform, View } from 'react-native';

import { useThemeColors } from '../../lib/common';

export default function Title({ text, navigation }) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.tileBackgroundColor,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 10,
        paddingBottom: 5,
      }}
    >
      <Heading
        numberOfLines={2}
        fontSize={21}
        lineHeight={25}
        maxW={270}
      >
        {text}
      </Heading>

      <IconButton
        variant="link"
        _icon={{
          as: FontAwesome,
          name: 'angle-down',
        }}
        onPress={() => navigation.pop()}
      />
    </View>
  );
}
