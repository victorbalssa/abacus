import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';
import React, { useState } from 'react';
import { getLocales } from 'expo-localization';
import { Ionicons } from '@expo/vector-icons';
import { AText } from './index';
import { useThemeColors } from '../../../lib/common';
import AView from './AView';

interface ADateFilterButtonType {
  currentDate: Date;
  selectDate: (date: Date) => void;
}

export default function ADateFilterButton({
  currentDate,
  selectDate,
}: ADateFilterButtonType) {
  const [locale] = getLocales();
  const { colors, colorScheme } = useThemeColors();
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  return (
    <AView style={{ marginHorizontal: 2 }}>
      {showDatePicker && (
        <DateTimePicker
          accentColor={colors.brandDark}
          themeVariant={colorScheme}
          locale={locale.languageCode}
          value={currentDate}
          style={{ flex: 1 }}
          onChange={(event, value) => {
            setShowDatePicker(Platform.OS === 'ios');
            selectDate(value);
          }}
        />
      )}
      {Platform.OS === 'android' && (
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
        >
          <AView
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.listBorderColor,
              borderRadius: 8,
              paddingHorizontal: 7,
              marginHorizontal: 2,
              height: 37,
            }}
          >
            <AText fontSize={14} bold>{moment(currentDate).format('ll')}</AText>
            <Ionicons name="chevron-down-outline" size={15} color={colors.text} />
          </AView>
        </TouchableOpacity>
      )}
    </AView>
  );
}
