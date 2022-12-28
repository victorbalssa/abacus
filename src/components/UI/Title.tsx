import React from 'react';
import {
  Text,
  IconButton,
  HStack,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const Title = ({ text, navigation }) => (
  <HStack
    shadow={2}
    backgroundColor="white"
    py={3}
    px={5}
    justifyContent="space-between"
    alignItems="center"
  >
    <Text
      numberOfLines={2}
      style={{
        fontFamily: 'Montserrat_Bold', fontSize: 21, lineHeight: 40, maxWidth: 270,
      }}
    >
      {text}
    </Text>
    <IconButton
      shadow={2}
      borderRadius={15}
      width={10}
      variant="solid"
      _icon={{
        as: AntDesign,
        name: 'arrowdown',
      }}
      onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      onPress={() => navigation.pop()}
    />
  </HStack>
);

export default Title;
