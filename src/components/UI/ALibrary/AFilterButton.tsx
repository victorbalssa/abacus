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
  capitalize?: boolean;
}

export default function AFilterButton({
  selected,
  navigation,
  filterType,
  selectFilter,
  capitalize = false,
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
          backgroundColor: selected ? colors.filterBorderColor : colors.listBorderColor,
          borderRadius: 8,
          paddingHorizontal: 7,
          marginHorizontal: 2,
          height: 37,
        }}
      >
        <AText fontSize={15} bold capitalize={capitalize}>
          {selected || filterType}
        </AText>
        <Ionicons name="chevron-down-outline" size={15} color={colors.text} />
      </AView>
    </TouchableOpacity>
  );
}
