import React from 'react';
import { View } from 'react-native';
import { ASkeleton, AStack, AText } from './ALibrary';
import { localNumberFormat, useThemeColors } from '../../lib/common';

type IncomeExpenseBarPropType = {
  income: number,
  incomeTotal?: number,
  expense: number,
  expenseTotal?: number,
  currencyCode: string,
  loading: boolean,
  barHeight?: number,
}

function IncomeExpenseBar({
  income,
  incomeTotal,
  expense,
  expenseTotal,
  currencyCode,
  loading,
  barHeight = 5,
}: IncomeExpenseBarPropType) {
  const { colors } = useThemeColors();
  const incomePercentage = loading ? 0 : income && incomeTotal ? (income / incomeTotal) * 100 : 0;
  const expensePercentage = loading ? 0 : Math.abs(expense && expenseTotal ? (expense / expenseTotal) * 100 : 0);
  return (
    <AStack
      row
      flexWrap="wrap"
    >
      <View style={{
        width: '50%',
        borderRightWidth: 1,
        borderColor: colors.listBorderColor,
        alignItems: 'flex-end',
      }}
      >
        <ASkeleton loading={loading}>
          <AText style={{ width: '100%', paddingRight: 5 }} textAlign="right">{localNumberFormat(currencyCode, expense)}</AText>
        </ASkeleton>
        {expenseTotal && (
          <View style={{
            width: `${expensePercentage}%`,
            marginLeft: `${100 - expensePercentage}%`,
            height: barHeight,
            backgroundColor: colors.red,
            borderBottomLeftRadius: expensePercentage < 100 ? 5 : 0,
            borderTopLeftRadius: expensePercentage < 100 ? 5 : 0,
          }}
          />
        )}
      </View>
      <View style={{ width: '50%', borderLeftWidth: 1, borderColor: colors.listBorderColor }}>
        <ASkeleton loading={loading}>
          <AText style={{ paddingLeft: 5 }} textAlign="left">{localNumberFormat(currencyCode, income)}</AText>
        </ASkeleton>
        {incomeTotal && (
          <View style={{
            width: `${incomePercentage}%`,
            height: barHeight,
            backgroundColor: colors.green,
            borderBottomRightRadius: incomePercentage < 100 ? 5 : 0,
            borderTopRightRadius: incomePercentage < 100 ? 5 : 0,
          }}
          />
        )}
      </View>
    </AStack>
  );
}

export default IncomeExpenseBar;
