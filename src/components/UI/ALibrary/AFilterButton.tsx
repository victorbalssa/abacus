import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AText, AView } from './index';
import { NavigationType } from '../../../types/screen';
import { useThemeColors } from '../../../lib/common';

interface AFilterButtonType {
  filterType: string;
  navigation: NavigationType;
  selected: string;
  selectFilter: (filter: string) => void;
}

export default function AFilterButton({
  selected,
  navigation,
  filterType,
  selectFilter,
}: AFilterButtonType) {
  const { colors } = useThemeColors();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('FilterScreen', {
        filterType,
        selectFilter,
      })}
    >
      <AView
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0.2,
          borderColor: colors.filterBorderColor,
          backgroundColor: selected ? colors.filterBorderColor : colors.listBorderColor,
          borderRadius: 10,
          paddingHorizontal: 7,
          paddingVertical: 5,
          marginHorizontal: 2,
        }}
      >
        <AText fontSize={13} bold>
          {selected || filterType}
        </AText>
        <Ionicons name="chevron-down-outline" size={15} color={colors.text} />
      </AView>
    </TouchableOpacity>
  );
}
