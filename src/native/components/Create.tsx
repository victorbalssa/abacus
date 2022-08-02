import React from 'react';
import {
  Text,
  Button,
  FormControl,
  IconButton,
  Input,
  ScrollView,
  VStack,
  KeyboardAvoidingView,
  HStack,
  Pressable,
  Spinner,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { FlatList, Keyboard } from 'react-native';
import Title from './UI/Title';
import ToastAlert from './UI/ToastAlert';

const TransactionForm = ({
  accounts = [], loading, getAutocompleteAccounts, loadingAutocomplete, submit, goToTransactions,
}) => {
  const [formData, setData] = React.useState({
    description: '',
    date: new Date(),
    source_name: '',
    destination_name: '',
    amount: '',
    type: 'deposit',
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
        setSuccess(false);
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

  const colorItemTypes = {
    withdrawal: 'red.600',
    deposit: 'green.700',
    transfer: 'blue.700',
    'opening balance': 'blue.700',
  };

  return (
    <VStack mx="3" my={3} pb={240}>
      <FormControl isRequired>
        <HStack justifyContent="center">
          <Button.Group isAttached borderRadius={15}>
            {['deposit', 'withdrawal', 'transfer'].map((type) => (
              <Button
                shadow={2}
                onPress={() => setData({
                  ...formData,
                  type,
                })}
                _text={{
                  fontFamily: 'Montserrat_Bold',
                  textTransform: 'capitalize',
                }}
                _disabled={{
                  opacity: 1,
                }}
                onTouchEnd={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                isDisabled={type === formData.type}
                backgroundColor={type !== formData.type ? 'gray.400' : colorItemTypes[formData.type]}
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
              p={2}
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircle',
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
              p={2}
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircle',
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
              p={2}
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircle',
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
          InputLeftElement={<Text px={3} color="white">*</Text>}
          returnKeyType="done"
          keyboardType="numeric"
          placeholder="0.00"
          value={formData.amount}
          textAlign="center"
          fontStyle="gray"
          fontSize={25}
          onChangeText={(value) => setData({
            ...formData,
            amount: value,
          })}
          InputRightElement={(
            <IconButton
              p={2}
              borderRadius={15}
              colorScheme="gray"
              _icon={{
                as: AntDesign,
                name: 'closecircle',
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

      {success && <ToastAlert title="Success" id="success" status="success" variant="solid" onClose={() => setSuccess(false)} description="Transaction created. Click here to go to transactions list." onPress={goToTransactions} />}
      {'global' in errors && <ToastAlert title="Error" id="error" status="error" variant="solid" onClose={() => setErrors({})} description={errors.global} />}

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

const Create = ({
  loading,
  accounts,
  submit,
  getAutocompleteAccounts,
  loadingAutocomplete,
  navigation,
  goToTransactions,
}) => (
  <>
    <Title navigation={navigation} text="New Transaction" />
    <KeyboardAvoidingView
      h={{
        base: '100%',
        lg: 'auto',
      }}
      behavior="padding"
    >
      <ScrollView flex={1} p={1} keyboardShouldPersistTaps="handled">
        <TransactionForm
          loading={loading}
          accounts={accounts}
          getAutocompleteAccounts={getAutocompleteAccounts}
          loadingAutocomplete={loadingAutocomplete}
          submit={submit}
          goToTransactions={goToTransactions}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </>
);

export default Create;
