import React, { useMemo } from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ABlurView,
  AStack,
  AText,
  AIconButton,
} from './ALibrary';
import { RootDispatch, RootState } from '../../store';
import { useThemeColors } from '../../lib/common';

export default function NavigationHeader({ navigation }): React.ReactNode {
  const { colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const title = useSelector((state: RootState) => state.firefly.rangeDetails.title);
  const range = useSelector((state: RootState) => state.firefly.rangeDetails.range);
  const start = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const end = useSelector((state: RootState) => state.firefly.rangeDetails.end);
  const { firefly: { setRange } } = useDispatch<RootDispatch>();

  return useMemo(() => (
    <ABlurView
      intensity={45}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: safeAreaInsets.top,
        paddingBottom: 5,
        paddingHorizontal: 5,
        backgroundColor: Platform.select({ ios: colors.tabBackgroundColor, android: colors.blurAndroidHeader }),
      }}
    >
      <AIconButton
        icon={<FontAwesome name="angle-left" size={25} color={colors.text} />}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
          setRange({ direction: -1 });
        }}
      />
      <AStack
        alignItems="flex-start"
        justifyContent="space-between"
        style={{ flex: 1, marginHorizontal: 5 }}
      >
        <AText fontSize={17} lineHeight={18} bold>
          {title}
        </AText>
        <AText py={4} fontSize={12} numberOfLines={1}>
          {range === 1 ? `${moment(start).format('MMMM D')} - ${moment(end).format('D')}` : `${moment(start).format('MMMM D')} - ${moment(end).format('MMMM D')}`}
        </AText>
        {(currentCode && range) && (
        <AStack row justifyContent="flex-start">
          <View style={{
            alignSelf: 'flex-start',
            borderWidth: 0.7,
            borderColor: colors.text,
            borderRadius: 10,
            paddingHorizontal: 5,
            marginHorizontal: 1,
          }}
          >
            <AText fontSize={10} lineHeight={12} bold>
              {currentCode}
            </AText>
          </View>
          <View style={{
            alignSelf: 'flex-start',
            borderWidth: 0.7,
            borderColor: colors.text,
            borderRadius: 10,
            paddingHorizontal: 5,
            marginHorizontal: 1,
          }}
          >
            <AText fontSize={10} lineHeight={12} bold>
              {`${range}M`}
            </AText>
          </View>
        </AStack>
        )}
      </AStack>

      <TouchableOpacity
        style={{
          margin: 5,
          padding: 5,
          borderRadius: 10,
        }}
        onPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'FiltersScreen',
          }),
        )}
      >
        <Ionicons name="filter" size={20} color={colors.text} />
      </TouchableOpacity>

      <AIconButton
        icon={<FontAwesome name="angle-right" size={25} color={colors.text} />}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
          setRange({ direction: +1 });
        }}
      />

    </ABlurView>
  ), [
    currentCode,
    title,
    range,
    start,
    end,
    colors,
  ]);
}
