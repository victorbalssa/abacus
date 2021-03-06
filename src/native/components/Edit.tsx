import React from 'react';
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  IconButton,
  Input,
  ScrollView,
  Select,
  VStack,
  KeyboardAvoidingView,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import moment from 'moment';

import Title from './UI/Title';

const TransactionForm = ({
  accounts = [], loading, payload, submit,
}) => {
  console.log('payload', payload);
  const [formData, setData] = React.useState({
    description: payload.description,
    date: new Date(payload.date),
    source_id: payload.source_id,
    destination_id: payload.destination_id,
    amount: parseFloat(payload.amount).toFixed(payload.currency_decimal_places),
    type: payload.type,
  });
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    if (formData.description === undefined) {
      setErrors({
        ...errors,
        description: 'Description is required',
      });
      return false;
    }
    if (formData.description.length < 1) {
      setErrors({
        ...errors,
        description: 'Description is too short',
      });
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    if (validate()) {
      submit(formData);
    } else {

    }
  };

  return (
    <VStack mx="3" pb={240}>
      <FormControl isRequired>
        <FormControl.Label>
          Type
        </FormControl.Label>
        <Select
          _selectedItem={{
            bg: 'primary.600',
            endIcon: <CheckIcon size="5" />,
          }}
          selectedValue={formData.type}
          onValueChange={(value) => setData({
            ...formData,
            type: value,
          })}
        >
          {['deposit', 'withdrawal', 'transfer', 'opening balance'].map((type) => (<Select.Item key={type} label={type} value={type} />))}
        </Select>
      </FormControl>
      <FormControl mt="1" isRequired isInvalid={'description' in errors}>
        <FormControl.Label>
          Description
        </FormControl.Label>
        <Input
          placeholder="Description"
          value={formData.description}
          onChangeText={(value) => setData({
            ...formData,
            description: value,
          })}
          InputRightElement={(
            <IconButton
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircleo',
                size: 15,
                color: 'gray.400',
              }}
              onPress={() => setData({
                ...formData,
                description: '',
              })}
            />
          )}
        />
        {'description' in errors ? <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage> : <></>}
      </FormControl>
      <FormControl mt="1" isRequired isInvalid={'source_id' in errors}>
        <FormControl.Label>
          Source account
        </FormControl.Label>
        <Select
          _selectedItem={{
            bg: 'primary.600',
            endIcon: <CheckIcon size="5" />,
          }}
          selectedValue={formData.source_id}
          onValueChange={(value) => setData({
            ...formData,
            source_id: value,
          })}
        >
          {accounts.filter((a) => ['asset', 'revenue'].includes(a.attributes.type)).map((a) => (
            <Select.Item key={a.id} label={a.attributes.name} value={a.id} />))}
        </Select>
      </FormControl>
      <FormControl mt="1" isRequired isInvalid={'destination_id' in errors}>
        <FormControl.Label>
          Destination account
        </FormControl.Label>
        <Select
          _selectedItem={{
            bg: 'primary.600',
            endIcon: <CheckIcon size="5" />,
          }}
          selectedValue={formData.destination_id}
          onValueChange={(value) => setData({
            ...formData,
            destination_id: value,
          })}
        >
          {accounts.filter((a) => ['asset', 'expense'].includes(a.attributes.type)).map((a) => (
            <Select.Item key={a.id} label={a.attributes.name} value={a.id} />))}
        </Select>
      </FormControl>
      <FormControl mt="1" isRequired>
        <FormControl.Label>
          Date
        </FormControl.Label>
        <DateTimePicker
          mode="date"
          style={{ width: 130 }}
          value={formData.date}
          onChange={(event, value) => setData({
            ...formData,
            date: value,
          })}
        />
      </FormControl>
      <FormControl mt="1" isRequired isInvalid={'amount' in errors}>
        <FormControl.Label>
          Amount
        </FormControl.Label>
        <Input
          keyboardType="numeric"
          placeholder="Amount"
          value={formData.amount}
          onChangeText={(value) => setData({
            ...formData,
            amount: value,
          })}
          InputRightElement={(
            <IconButton
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircleo',
                size: 15,
                color: 'gray.400',
              }}
              onPress={() => setData({
                ...formData,
                amount: '',
              })}
            />
          )}
        />
        {'amount' in errors ? <FormControl.ErrorMessage>{errors.amount}</FormControl.ErrorMessage> : <></>}
      </FormControl>
      <Button
        mt="3"
        variant="outline"
        borderRadius={15}
        colorScheme="gray"
        onPress={() => {
          setData({
            date: new Date(),
            source_id: '',
            destination_id: '',
            description: '',
            amount: '',
            type: 'deposit',
          });
          setErrors({});
        }}
      >
        Reset
      </Button>
      <Button
        mt="2"
        shadow={2}
        borderRadius={15}
        onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        _pressed={{
          style: {
            transform: [{
              scale: 0.99,
            }],
          },
        }}
        _loading={{
          bg: 'primary.50',
          _text: {
            color: 'white',
          },
          alignItems: 'flex-start',
          opacity: 1,
        }}
        _spinner={{
          color: 'white',
          size: 10,
        }}
        colorScheme="primary"
        isLoading={loading}
        isLoadingText="Submitting..."
        onPress={onSubmit}
      >
        Submit
      </Button>
    </VStack>
  );
};

const Edit = ({
  loading,
  payload,
  accounts,
  submit,
}) => (
  <>
    <Title text={payload.description} />
    <KeyboardAvoidingView
      h={{
        base: '100%',
        lg: 'auto',
      }}
      behavior="padding"
    >
      <ScrollView flex={1} p={3}>
        <TransactionForm
          loading={loading}
          payload={payload}
          accounts={accounts}
          submit={submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </>
);

export default Edit;
