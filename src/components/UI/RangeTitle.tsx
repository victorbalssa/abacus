import React, { FC } from 'react';
import {
  HStack,
  Box,
  Text,
  Select,
  CheckIcon, IconButton,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { RootDispatch, RootState } from '../../store';
import ErrorWidget from "./ErrorWidget";

const RangeTitle: FC = () => {
  const firefly = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();

  return (
    <Box
      shadow={2}
      backgroundColor="white"
      pl={3}
      pr={3}
      zIndex={30}
      safeAreaTop
    >
      <HStack justifyContent="space-between" alignItems="center">
        <IconButton
          shadow={2}
          borderRadius={15}
          variant="solid"
          _icon={{
            as: AntDesign,
            name: 'arrowleft',
          }}
          onPress={() => dispatch.firefly.handleChangeRange({ direction: -1 })}
          onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <Box pl={2} mt={1} height={41} width={170} justifyContent="center">
          <Text style={{ fontFamily: 'Montserrat_Bold', fontSize: 21 }}>
            {firefly.rangeTitle}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {`${moment(firefly.start).format('ll')} - ${moment(firefly.end).format('ll')}`}
          </Text>
        </Box>
        <Select
          m={1}
          borderRadius={15}
          variant="outline"
          dropdownIcon={<></>}
          height={41}
          width={84}
          _selectedItem={{
            bg: 'primary.600',
            endIcon: <CheckIcon size="5" />,
          }}
          selectedValue={`${firefly.range}`}
          onValueChange={(v) => dispatch.firefly.handleChangeRange({ range: v })}
        >
          <Select.Item key="1" label="Monthly" value="1" />
          <Select.Item key="3" label="Quarterly" value="3" />
          <Select.Item key="6" label="Semiannually" value="6" />
          <Select.Item key="12" label="Yearly" value="12" />
        </Select>

        <ErrorWidget />

        <IconButton
          shadow={2}
          borderRadius={15}
          variant="solid"
          _icon={{
            as: AntDesign,
            name: 'arrowright',
          }}
          onPress={() => dispatch.firefly.handleChangeRange({ direction: 1 })}
          onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </HStack>
    </Box>
  );
};

export default RangeTitle;
