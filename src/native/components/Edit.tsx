import React from 'react';
import {
  Button,
  CheckIcon,
  FormControl,
  IconButton,
  Input,
  ScrollView,
  Select,
  VStack,
  KeyboardAvoidingView, HStack, Spinner, Pressable, Text,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { FlatList, Keyboard } from 'react-native';
import Title from './UI/Title';
import ToastAlert from './UI/ToastAlert';

const TransactionForm = ({
  accounts = [], loading, payload, getAutocompleteAccounts, loadingAutocomplete, submit,
}) => {
  const [formData, setData] = React.useState({
    description: payload.description,
    date: new Date(payload.date),
    source_name: payload.source_name,
    destination_name: payload.destination_name,
    amount: parseFloat(payload.amount).toFixed(payload.currency_decimal_places),
    type: payload.type,
  });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState(false);
  const [displayAutocomplete, setDisplayAutocomplete] = React.useState({ source: false, destination: false });

  const validate = () => {
    if (formData.description === undefined) {
      setErrors({
        ...errors,
        description: 'Description is required.',
      });
      return false;
    }
    if (formData.description.length < 1) {
      setErrors({
        ...errors,
        description: 'Description is too short.',
      });
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (validate()) {
      try {
        setErrors({});
        await submit(formData);
        /*      toast.show({
        placement: 'top',
        render: ({ id }) => <ToastAlert title="Success" id={id} status="success" variant="accent" isClosable description="Transaction created. Click here to go to transactions list." />,
        onTouchEnd: () => goToTransactions(),
      }); */
        setSuccess(true);
      } catch (e) {
        if (e.response) {
          console.log(e.response.data);
          console.log(e.response.data.message);
          setErrors({
            ...errors,
            global: e.response.data.message,
          });
          /*        toast.show({
          placement: 'top',
          title: 'Something went wrong',
          status: 'error',
          description: e.response.data.message,
        }); */
        } else {
          /*        toast.show({
          placement: 'top',
          title: 'Something went wrong',
          status: 'error',
          description: e.message,
        }); */
        }
      }
    } else {

    }
  };

  console.log(formData);

  return (
    <VStack mx="3" pb={240}>
      <FormControl isRequired>
        <FormControl.Label>
          Type
        </FormControl.Label>
        <HStack justifyContent="center" flexWrap="wrap">
          <Button.Group isAttached borderRadius={15}>
            {['deposit', 'withdrawal', 'transfer'].map((type) => (
              <Button
                shadow={2}
                onPress={() => setData({
                  ...formData,
                  type,
                })}
                _text={{
                  textTransform: 'capitalize',
                }}
                _disabled={{
                  opacity: 1,
                }}
                onTouchEnd={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                isDisabled={type === formData.type}
                backgroundColor={type !== formData.type ? 'gray.400' : 'primary.700'}
                key={type}
                borderWidth={1}
                borderColor="white"
              >
                {type}
              </Button>
            ))}
          </Button.Group>
        </HStack>
      </FormControl>
      <FormControl mt="1" isRequired isInvalid={'description' in errors}>
        <FormControl.Label>
          Description
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder="Description"
          value={formData.description}
          onChangeText={(value) => setData({
            ...formData,
            description: value,
          })}
          InputRightElement={(
            <IconButton
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircleo',
                size: 19,
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
      <FormControl mt="1" isRequired isInvalid={'source_name' in errors}>
        <FormControl.Label>
          Source account
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder="Source account"
          value={formData.source_name}
          onChangeText={(value) => {
            setData({
              ...formData,
              source_name: value,
            });
            getAutocompleteAccounts({ query: value, isDestination: false });
          }}
          onFocus={() => {
            getAutocompleteAccounts({ query: formData.source_name, isDestination: false });
            setDisplayAutocomplete({ source: true, destination: false });
          }}
          onBlur={() => setDisplayAutocomplete({ source: false, destination: false })}
          InputRightElement={(
            <IconButton
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircleo',
                size: 19,
                color: 'gray.400',
              }}
              onPress={() => setData({
                ...formData,
                source_name: '',
              })}
            />
          )}
        />

        {displayAutocomplete.source && loadingAutocomplete && <Spinner mt={2} />}
        {displayAutocomplete.source && !loadingAutocomplete && (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={accounts}
            renderItem={(a) => (
              <Pressable
                mx={2}
                onPress={() => {
                  setData({
                    ...formData,
                    source_name: a.item.name,
                  });
                  setDisplayAutocomplete({ source: false, destination: false });
                }}
                _pressed={{
                  borderRadius: 15,
                  backgroundColor: 'gray.300',
                }}
              >
                <HStack
                  justifyContent="space-between"
                  key={a.index}
                  mx={2}
                  my={2}
                >
                  <Text underline>
                    {a.item.name_with_balance || 'no name'}
                  </Text>
                </HStack>
              </Pressable>
            )}
          />
        )}
      </FormControl>
      <FormControl mt="1" isRequired isInvalid={'destination_name' in errors}>
        <FormControl.Label>
          Destination account
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder="Destination account"
          value={formData.destination_name}
          onChangeText={(value) => {
            setData({
              ...formData,
              destination_name: value,
            });
            getAutocompleteAccounts({ query: value, isDestination: true });
          }}
          onFocus={() => {
            getAutocompleteAccounts({ query: formData.destination_name, isDestination: true });
            setDisplayAutocomplete({ source: false, destination: true });
          }}
          onBlur={() => setDisplayAutocomplete({ source: false, destination: false })}
          InputRightElement={(
            <IconButton
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircleo',
                size: 19,
                color: 'gray.400',
              }}
              onPress={() => setData({
                ...formData,
                destination_name: '',
              })}
            />
          )}
        />

        {displayAutocomplete.destination && loadingAutocomplete && <Spinner mt={2} />}
        {displayAutocomplete.destination && !loadingAutocomplete && (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={accounts}
            renderItem={(a) => (
              <Pressable
                mx={2}
                onPress={() => {
                  setData({
                    ...formData,
                    destination_name: a.item.name,
                  });
                  setDisplayAutocomplete({ source: false, destination: false });
                }}
                _pressed={{
                  borderRadius: 15,
                  backgroundColor: 'gray.300',
                }}
              >
                <HStack
                  justifyContent="space-between"
                  key={a.index}
                  mx={2}
                  my={2}
                >
                  <Text underline>
                    {a.item.name_with_balance || 'no name'}
                  </Text>
                </HStack>
              </Pressable>
            )}
          />
        )}

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
          returnKeyType="done"
          keyboardType="numeric"
          placeholder="10.00"
          value={formData.amount}
          onChangeText={(value) => setData({
            ...formData,
            amount: value,
          })}
          InputRightElement={(
            <IconButton
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircleo',
                size: 19,
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

      {success && <ToastAlert title="Success" id="success" status="success" variant="solid" isClosable description="Transaction created. Click here to go to transactions list." />}
      {'global' in errors && <ToastAlert title="Error" id="error" status="error" variant="solid" isClosable description={errors.global} />}

      <Button
        mt="3"
        variant="outline"
        borderRadius={15}
        colorScheme="gray"
        onPress={() => {
          setData({
            date: new Date(),
            source_name: '',
            destination_name: '',
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
  getAutocompleteAccounts,
  loadingAutocomplete,
  navigation,
}) => (
  <>
    <Title navigation={navigation} text={payload.description} />
    <KeyboardAvoidingView
      h={{
        base: '100%',
        lg: 'auto',
      }}
      behavior="padding"
    >
      <ScrollView flex={1} p={1} keyboardShouldPersistTaps="handled">
        <TransactionForm
          payload={payload}
          loading={loading}
          accounts={accounts}
          getAutocompleteAccounts={getAutocompleteAccounts}
          loadingAutocomplete={loadingAutocomplete}
          submit={submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </>
);

export default Edit;
