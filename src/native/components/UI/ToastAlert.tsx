import React from 'react';
import {
  Text,
  IconButton,
  HStack, Alert, VStack, CloseIcon,
} from 'native-base';

const ToastAlert = ({
  id,
  status,
  variant,
  title,
  description,
  onClose,
  onPress,
}) => (
  <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status || 'info'} variant={variant}>
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
          variant="unstyled"
          icon={<CloseIcon size="3" />}
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
