import React from 'react';
import { ViewStyle } from 'react-native';
import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  ScrollView,
  VStack, Select, CheckIcon, IconButton,
} from 'native-base';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import UIButton from './UI/UIButton';
import { HomeDisplayType } from '../../models/firefly';

type DashboardType = {
  range: number,
  loading: boolean,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  fetchData: () => Promise<void>,
  handleChangeRange: (value: object) => Promise<void>,
}

const Dashboard = ({
  range,
  netWorth,
  spent,
  earned,
  balance,
  loading,
  fetchData,
  handleChangeRange,
}: DashboardType) => (
  <ScrollView>
    <Stack safeAreaTop={8}>
      <Box alignItems="center">
        <Text
          style={{
            fontSize: 20,
            paddingTop: 10,
            paddingBottom: 15,
          }}
        >
          Abacus.
        </Text>
      </Box>
      <Stack shadow="3" justifyContent="center" alignItems="center">
        <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
          {netWorth.map((nw) => (
            <VStack
              key={nw.title}
              minW={160}
              maxW={160}
              height={65}
              margin={1}
              padding={3}
              bg={{
                linearGradient: {
                  colors: [colors.brandStyle, colors.brandStyleSecond],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              rounded="15"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Text style={{
                fontSize: 20,
                fontFamily: 'Montserrat_Bold',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {nw.value_parsed}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Montserrat',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {nw.title}
              </Text>
            </VStack>
          ))}
        </HStack>
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton
            m={1}
            variant="solid"
            _icon={{
              as: AntDesign,
              name: 'left',
            }}
            onPress={() => handleChangeRange({ direction: -1 })}
          />
          <Select
            m={1}
            minWidth="120"
            minHeight="50"
            _selectedItem={{
              bg: 'primary.600',
              endIcon: <CheckIcon size="5" />,
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
            m={1}
            variant="solid"
            _icon={{
              as: AntDesign,
              name: 'right',
            }}
            onPress={() => handleChangeRange({ direction: 1 })}
          />
        </HStack>
        <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
          {spent.map((s) => (
            <VStack
              key={s.title}
              minW={160}
              maxW={160}
              height={65}
              margin={1}
              padding={3}
              bg={{
                linearGradient: {
                  colors: [colors.brandStyle1, colors.brandStyle1],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              rounded="15"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Text style={{
                fontSize: 20,
                fontFamily: 'Montserrat_Bold',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {s.value_parsed}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Montserrat',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {s.title}
              </Text>
            </VStack>
          ))}
        </HStack>
        <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
          {balance.map((s) => (
            <VStack
              key={s.title}
              minW={160}
              maxW={160}
              height={65}
              margin={1}
              padding={3}
              bg={{
                linearGradient: {
                  colors: [colors.brandStyle2, colors.brandStyle2],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              rounded="15"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Text style={{
                fontSize: 20,
                fontFamily: 'Montserrat_Bold',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {s.value_parsed}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Montserrat',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {s.title}
              </Text>
            </VStack>
          ))}
        </HStack>
        <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
          {earned.map((s) => (
            <VStack
              key={s.title}
              minW={160}
              maxW={160}
              height={65}
              margin={1}
              padding={3}
              bg={{
                linearGradient: {
                  colors: [colors.brandStyle3, colors.brandStyle3],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              rounded="15"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Text style={{
                fontSize: 20,
                fontFamily: 'Montserrat_Bold',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {s.value_parsed}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Montserrat',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {s.title}
              </Text>
            </VStack>
          ))}
        </HStack>
        <UIButton
          text="Refresh"
          loading={loading}
          onPress={fetchData}
          icon={(
            <Icon
              as={Ionicons}
              name="refresh"
              style={{
                color: '#fff',
                fontSize: 15,
                paddingRight: 10,
                marginLeft: 10,
                paddingLeft: 5,
              } as ViewStyle}
            />
            )}
          style={{
            margin: 15,
            height: 35,
          }}
        />
      </Stack>
    </Stack>
  </ScrollView>
);

export default Dashboard;
