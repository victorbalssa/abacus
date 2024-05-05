import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import moment from 'moment';
import React, { useState } from 'react';
import { getLocales } from 'expo-localization';
import { AButton, AStack, AText } from './index';
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
          // to fix the display issue of -1 day, offset the timezone by 1 minute
          timeZoneOffsetInMinutes={1}
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
        <AStack row>
          <AButton
            mx={10}
            px={10}
            onPress={() => setShowDatePicker(true)}
            style={{
              height: 40, borderWidth: 0.5, borderColor: colors.listBorderColor,
            }}
          >
            <AText fontSize={14}>{moment(currentDate).format('ll')}</AText>
          </AButton>
        </AStack>
      )}
    </AView>
  );
}
