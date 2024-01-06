import React, { useMemo, useState } from 'react';
import { FormControl, IconButton, Input } from 'native-base';
import { useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import translate from '../../../i18n/locale';
import { RootDispatch } from '../../../store';

export default function GroupTitle({ title }) {
  const [groupTitle, setGroupTitle] = useState(title);
  const dispatch = useDispatch<RootDispatch>();

  return useMemo(
    () => (
      <FormControl mt="1">
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
          InputRightElement={(
            <IconButton
              mr={0}
              h={8}
              w={8}
              variant="ghost"
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircle',
                size: 19,
                color: 'gray.500',
              }}
              onPress={() => {
                setGroupTitle('');
                dispatch.transactions.setGroupTitle('');
              }}
            />
)}
        />
        <FormControl.HelperText>{translate('transaction_form_group_title_helper')}</FormControl.HelperText>
      </FormControl>
    ),
    [
      groupTitle,
    ],
  );
}
