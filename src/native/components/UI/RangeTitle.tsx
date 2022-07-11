import React from 'react';
import {
  HStack,
  Box,
  Text,
  Select,
  CheckIcon, IconButton,
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Dispatch, RootState } from '../../../store';

const RangeTitle = ({
  start,
  end,
  range,
  rangeTitle,
  handleChangeRange,
}) => (
  <Box
    shadow={2}
    backgroundColor="white"
    pl={4}
    pr={4}
    safeAreaTop
  >
    <HStack justifyContent="space-between" alignItems="center">
      <IconButton
        shadow={2}
        size="sm"
        borderRadius={15}
        variant="solid"
        _icon={{
          as: AntDesign,
          name: 'arrowleft',
        }}
        onPress={() => handleChangeRange({ direction: -1 })}
        onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        _pressed={{
          style: {
            transform: [{
              scale: 0.95,
            }],
            opacity: 0.95,
          },
        }}
      />
      <Box flex={1} pl={3} mt={1} height={41} justifyContent="center">
        <Text style={{ fontFamily: 'Montserrat_Bold', fontSize: 21 }}>
          {rangeTitle}
        </Text>
        <Text style={{ fontSize: 12 }}>
          {`${moment(start).format('ll')} - ${moment(end).format('ll')}`}
        </Text>
      </Box>
      <Select
        m={1}
        borderRadius={15}
        variant="outline"
        dropdownIcon={<></>}
        height={41}
        width={78}
        _selectedItem={{
          bg: 'primary.600',
          endIcon: <CheckIcon size="5" />,
        }}
        selectedValue={`${range}`}
        onValueChange={(v) => handleChangeRange({ range: v })}
      >
        <Select.Item key="1" label="Monthly" value="1" />
        <Select.Item key="3" label="Quarterly" value="3" />
        <Select.Item key="6" label="Semiannually" value="6" />
        <Select.Item key="12" label="Yearly" value="12" />
      </Select>

      <IconButton
        shadow={2}
        size="sm"
        borderRadius={15}
        variant="solid"
        _icon={{
          as: AntDesign,
          name: 'arrowright',
        }}
        onPress={() => handleChangeRange({ direction: 1 })}
        onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        _pressed={{
          style: {
            transform: [{
              scale: 0.95,
            }],
            opacity: 0.95,
          },
        }}
      />
    </HStack>
  </Box>
);

const mapStateToProps = (state: RootState) => ({
  start: state.firefly.start,
  end: state.firefly.end,
  range: state.firefly.range,
  rangeTitle: state.firefly.rangeTitle,
});

const mapDispatchToProps = (state: Dispatch) => ({
  handleChangeRange: state.firefly.handleChangeRange,
});

export default connect(mapStateToProps, mapDispatchToProps)(RangeTitle);
