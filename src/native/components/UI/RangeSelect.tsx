import React from 'react';
import {
  CheckIcon, HStack, IconButton, Select,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';

const RangeSelect = ({ handleChangeRange, range }) => (
  <HStack shadow="1" justifyContent="space-between" alignItems="center">
    <IconButton
      m={4}
      borderRadius={15}
      variant="solid"
      _icon={{
        as: AntDesign,
        name: 'left',
      }}
      onPress={() => handleChangeRange({ direction: -1 })}
    />
    <Select
      m={1}
      variant="underlined"
      height={50}
      width={200}
      _selectedItem={{
        bg: 'primary.600',
        startIcon: <CheckIcon size="5" />,
      }}
      selectedValue={`${range}`}
      onValueChange={(v) => handleChangeRange({ range: v })}
    >
      <Select.Item label="One month" value="1" />
      <Select.Item label="Three months (quarter)" value="3" />
      <Select.Item label="Six months" value="6" />
      <Select.Item label="One year (SLOW)" value="12" />
    </Select>
    <IconButton
      m={3}
      borderRadius={15}
      variant="solid"
      _icon={{
        as: AntDesign,
        name: 'right',
      }}
      onPress={() => handleChangeRange({ direction: 1 })}
    />
  </HStack>
);

export default RangeSelect;
