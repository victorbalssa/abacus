import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon, Text } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import Loading from './Loading';

const UIButton = ({
  text,
  style,
  onPress,
  loading,
  disabled = false,
  icon = null,
}) => (
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
    {icon && !loading
      && (
      <Icon
        as={AntDesign}
        name="exclamationcircleo"
        style={{
          color: '#fff',
          fontSize: 15,
          paddingRight: 10,
          marginLeft: 10,
          paddingLeft: 5,
        }}
      />
      )}
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

UIButton.propTypes = {
  onPress: PropTypes.func,
};

UIButton.defaultProps = {};

export default UIButton;
