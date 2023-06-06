import React from 'react';
import {
  IconButton,
  Heading,
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import ThemeBlurView from './ThemeBlurView';
import { useThemeColors } from '../../lib/common';

const Title = ({
  text,
  navigation,
}) => {
  const { colors } = useThemeColors();

  return (
    <ThemeBlurView
      intensity={50}
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
    </ThemeBlurView>
  );
};

export default Title;
