import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import translate from '../../../i18n/locale';
import { RootDispatch } from '../../../store';
import {
  AFormView, AIconButton,
  AInput,
  ALabel,
  AText,
} from '../../UI/ALibrary';
import { useThemeColors } from '../../../lib/common';

export default function GroupTitle({ title }) {
  const { colors } = useThemeColors();
  const [groupTitle, setGroupTitle] = useState(title);
  const dispatch = useDispatch<RootDispatch>();

  return useMemo(
    () => (
      <AFormView mx={0}>
        <ALabel>
          {translate('transaction_form_group_title_label')}
        </ALabel>
        <AInput
          returnKeyType="done"
          placeholder={translate('transaction_form_group_title_placeholder')}
          value={groupTitle}
          onChangeText={(value) => {
            setGroupTitle(value);
            dispatch.transactions.setGroupTitle(value);
          }}
          InputRightElement={(
            <AIconButton
              icon={<AntDesign name="closecircle" size={19} color={colors.greyLight} />}
              onPress={() => {
                setGroupTitle('');
                dispatch.transactions.setGroupTitle('');
              }}
            />
          )}
        />
        <AText fontSize={10} py={5} color={colors.greyLight}>{translate('transaction_form_group_title_helper')}</AText>
      </AFormView>
    ),
    [
      groupTitle,
    ],
  );
}
