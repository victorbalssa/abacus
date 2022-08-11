import React from 'react';
import {
  Text,
  IconButton,
  HStack, Alert, VStack, CloseIcon,
} from 'native-base';

const ToastAlert = ({
  status,
  variant,
  title,
  description,
  onClose,
  onPress = () => {},
}) => (
  <Alert zIndex={1000} maxWidth="100%" alignSelf="center" flexDirection="row" status={status || 'info'} variant={variant}>
    <VStack space={1} flexShrink={1} w="100%">
      <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />
          <Text onPress={onPress} fontSize="md" fontWeight="medium" flexShrink={1} color="lightText">
            {title}
          </Text>
        </HStack>

        <IconButton
          onPress={onClose}
          icon={<CloseIcon size="4" />}
          _icon={{
            color: 'lightText',
          }}
        />
      </HStack>
      <Text onPress={onPress} px="6" color="lightText">
        {description}
      </Text>
    </VStack>
  </Alert>
);

export default ToastAlert;
