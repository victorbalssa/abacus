import React, { useMemo, useState } from 'react';
import { FormControl, Input } from 'native-base';
import { useDispatch } from 'react-redux';
import translate from '../../../i18n/locale';
import { RootDispatch } from '../../../store';

export default function GroupTitle({ title }) {
  const [groupTitle, setGroupTitle] = useState(title);
  const dispatch = useDispatch<RootDispatch>();

  return useMemo(
    () => (
      <FormControl mt="1" isInvalid={!groupTitle}>
        <FormControl.Label>
          {translate('transaction_form_group_title_label')}
        </FormControl.Label>
        <Input
          variant="outline"
          returnKeyType="done"
          placeholder={translate('transaction_form_group_title_placeholder')}
          value={groupTitle}
          onChangeText={(value) => {
            setGroupTitle(value);
            dispatch.transactions.setGroupTitle(value);
          }}
        />
        <FormControl.HelperText>{translate('transaction_form_group_title_helper')}</FormControl.HelperText>
      </FormControl>
    ),
    [
      groupTitle,
    ],
  );
}
