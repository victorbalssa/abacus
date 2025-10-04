import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-native';

import { RootDispatch, RootState } from '../../store';
import { useThemeColors } from '../../lib/common';

export default function DisplayAllAccountsSwitch() {
  const { colors } = useThemeColors();
  const displayAllAccounts = useSelector((state: RootState) => state.configuration.displayAllAccounts);
  const selectedBrandStyle = useSelector((state: RootState) => state.configuration.selectedBrandStyle || colors.brandStyleOrange);
  const dispatch = useDispatch<RootDispatch>();

  const onSwitch = async (bool: boolean) => {
    dispatch.configuration.setDisplayAllAccounts(bool);
    dispatch.accounts.getAccounts();
    return Promise.resolve();
  };

  return useMemo(() => (
    <Switch thumbColor="white" trackColor={{ false: '#767577', true: selectedBrandStyle }} onValueChange={onSwitch} value={displayAllAccounts} />
  ), [
    colors,
    displayAllAccounts,
  ]);
}
