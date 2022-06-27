import React, {ReactElement} from 'react';

import { TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import colors from '../../../constants/colors';
import Loading from './Loading';

type UIButtonType = {
  text: string,
  style: {},
  onPress: () => {},
  loading: boolean,
  disabled: boolean,
  icon: ReactElement<any, any>,
};

const UIButton = ({
  text,
  style,
  onPress,
  loading,
  disabled = false,
  icon = null,
}: UIButtonType) => (
  <TouchableOpacity
    style={{
      height: 50,
      borderRadius: 15,
      backgroundColor: disabled ? colors.brandDarkLight : colors.brandStyle,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}
    onPress={onPress}
    disabled={loading || disabled}
  >
    {!loading && icon}
    {!loading && (
      <Text style={{
        flex: icon ? 0 : 1,
        color: '#fff',
        fontSize: 15,
        textAlign: icon ? 'left' : 'center',
        paddingRight: 10,
      }}
      >
        {text}
      </Text>
    )}
    {loading && <Loading />}
  </TouchableOpacity>
);

export default UIButton;
