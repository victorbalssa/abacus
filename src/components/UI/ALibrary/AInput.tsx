import React from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
} from 'react-native';
import { AStyle } from './types';
import AStack from './AStack';
import { useThemeColors } from '../../../lib/common';
import AView from './AView';

type AInputType = {
  height?: number
  bold?: boolean
  type?: 'text' | 'password'
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | 'default'
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad' | 'url'
  onSubmitEditing?: ({ nativeEvent: { text } }: { nativeEvent: { text: string; }; }) => void
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  InputLeftElement?: React.ReactNode
  InputRightElement?: React.ReactNode
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: number
  numberOfLines?: number
  style?: AStyle
  testID?: string
}

export default function AInput({
  testID = null,
  height = 35,
  bold = false,
  type = 'text',
  returnKeyType = 'default',
  keyboardType = 'default',
  onSubmitEditing,
  placeholder = '',
  value,
  onChangeText,
  onFocus,
  onBlur,
  InputLeftElement = null,
  InputRightElement = null,
  textAlign = 'left',
  fontSize = 14,
  numberOfLines = 1,
  style = null,
}: AInputType) {
  const { colors } = useThemeColors();
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = (focusState: boolean, callback: () => void) => {
    setIsFocused(focusState);
    callback();
  };

  return (
    <AStack
      justifyContent="space-between"
      style={{
        width: '100%',
        borderRadius: 10,
        borderColor: isFocused ? colors.brandStyle : colors.listBorderColor,
        backgroundColor: isFocused ? 'rgba(255,85,51,0.10)' : 'transparent',
        borderWidth: 1,
        ...style,
      }}
      row
    >
      {InputLeftElement || <AView style={{ width: 10 }} />}
      <TextInput
        testID={testID}
        multiline={numberOfLines > 1}
        accessible
        secureTextEntry={type === 'password'}
        style={{
          flex: 1,
          height,
          fontSize,
          textAlign,
          fontFamily: bold ? 'Montserrat_Bold' : 'Montserrat',
          color: colors.text,
          paddingVertical: 5,
          ...style,
        }}
        cursorColor={colors.listBorderColor}
        returnKeyType={returnKeyType}
        keyboardType={keyboardType}
        placeholderTextColor={colors.listBorderColor}
        onChangeText={onChangeText}
        numberOfLines={numberOfLines}
        value={value}
        placeholder={placeholder}
        onSubmitEditing={onSubmitEditing}
        onFocus={(e) => {
          handleFocus(true, onFocus ? () => onFocus(e) : () => null);
        }}
        onBlur={(e) => {
          handleFocus(false, onBlur ? () => onBlur(e) : () => null);
        }}
      />
      {InputRightElement}
    </AStack>
  );
}
