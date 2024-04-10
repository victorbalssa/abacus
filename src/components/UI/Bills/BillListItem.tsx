import moment from 'moment/moment';
import React, { useMemo } from 'react';
import translate from '../../../i18n/locale';
import { useThemeColors } from '../../../lib/common';
import { BillType } from '../../../models/bills';
import { ASkeleton, AStack, AText } from '../ALibrary';

type Props = {
  bill: BillType;
  loading: boolean;
  lastItem: boolean;
}

export default function BillListItem({ bill, loading, lastItem }: Props) {
  const { colors } = useThemeColors();
  const paidDate = useMemo(() => bill.attributes.paidDates[0]?.date || null, [bill]);

  const statusColor = useMemo(() => {
    // The bill is paid
    if (paidDate !== null) {
      return colors.green;
    }

    // The bill is not expected in the current period
    if (bill.attributes.nextExpectedMatch === null) {
      return colors.brandStyle4;
    }

    // The bill should be paid by now
    if (moment(bill.attributes.nextExpectedMatch).diff(moment(), 'days') < 0) {
      return colors.brandWarning;
    }

    // The expected date is in the future
    return undefined;
  }, [paidDate]);

  const billContent = useMemo(() => {
    if (paidDate !== null) {
      return translate('bills_paid');
    }

    if (bill.attributes.nextExpectedMatch === null) {
      return translate('bills_not_expected');
    }

    return moment(bill.attributes.nextExpectedMatch).format('ll');
  }, [bill, paidDate]);

  return (
    <AStack
      key={bill.id}
      row
      mx={15}
      style={{
        height: 45,
        borderColor: colors.listBorderColor,
        borderBottomWidth: lastItem ? 0 : 0.5,
      }}
      justifyContent="space-between"
    >
      <AText
        fontSize={14}
        maxWidth="60%"
        numberOfLines={1}
      >
        {bill.attributes.name}
      </AText>

      <ASkeleton loading={loading}>
        <AText
          fontSize={14}
          maxWidth={100}
          numberOfLines={1}
          color={statusColor}
        >
          {billContent}
        </AText>
      </ASkeleton>
    </AStack>
  );
}
