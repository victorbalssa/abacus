import colors from './colors';

export default {
  config: {
    useSystemColorMode: true,
  },
  colors: {
    primary: {
      50: colors.brandStyleSecond,
      100: colors.brandStyleSecond,
      200: colors.brandStyleSecond,
      300: colors.brandStyleSecond,
      400: colors.brandStyleSecond,
      500: colors.brandStyle,
      600: colors.brandStyle,
      700: colors.brandStyle,
      800: colors.brandStyle,
      900: colors.brandStyle,
    },
    chart0: {
      50: colors.brandStyle0,
      100: colors.brandStyle0,
      200: colors.brandStyle0,
      300: colors.brandStyle0,
      400: colors.brandStyle0,
      500: colors.brandStyle0,
      600: colors.brandStyle0,
      700: colors.brandStyle0,
      800: colors.brandStyle0,
      900: colors.brandStyle0,
    },
    chart1: {
      50: colors.brandStyle1,
      100: colors.brandStyle1,
      200: colors.brandStyle1,
      300: colors.brandStyle1,
      400: colors.brandStyle1,
      500: colors.brandStyle1,
      600: colors.brandStyle1,
      700: colors.brandStyle1,
      800: colors.brandStyle1,
      900: colors.brandStyle1,
    },
    chart2: {
      50: colors.brandStyle2,
      100: colors.brandStyle2,
      200: colors.brandStyle2,
      300: colors.brandStyle2,
      400: colors.brandStyle2,
      500: colors.brandStyle2,
      600: colors.brandStyle2,
      700: colors.brandStyle2,
      800: colors.brandStyle2,
      900: colors.brandStyle2,
    },
    chart3: {
      50: colors.brandStyle3,
      100: colors.brandStyle3,
      200: colors.brandStyle3,
      300: colors.brandStyle3,
      400: colors.brandStyle3,
      500: colors.brandStyle3,
      600: colors.brandStyle3,
      700: colors.brandStyle3,
      800: colors.brandStyle3,
      900: colors.brandStyle3,
    },
    chart4: {
      50: colors.brandStyle4,
      100: colors.brandStyle4,
      200: colors.brandStyle4,
      300: colors.brandStyle4,
      400: colors.brandStyle4,
      500: colors.brandStyle4,
      600: colors.brandStyle4,
      700: colors.brandStyle4,
      800: colors.brandStyle4,
      900: colors.brandStyle4,
    },
  },
  fontConfig: {
    Montserrat: {
      100: {
        normal: 'Montserrat_Light',
      },
      200: {
        normal: 'Montserrat_Light',
      },
      300: {
        normal: 'Montserrat',
      },
      400: {
        normal: 'Montserrat',
      },
      500: {
        normal: 'Montserrat_Bold',
      },
      600: {
        normal: 'Montserrat_Bold',
      },
    },
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Montserrat',
  },
  components: {
    Alert: {
      baseStyle: {
        m: '3',
        shadow: 2,
      },
    },
    IconButton: {
      defaultProps: {
        size: 'lg',
        variant: 'solid',
      },
      baseStyle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        _icon: {
          size: 'lg',
        },
        _pressed: {
          style: {
            textColor: 'white',
            transform: [{
              scale: 0.95,
            }],
            opacity: 0.95,
          },
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 10,
      },
    },
    Input: {
      baseStyle: {
        borderRadius: 10,
        height: 10,
      },
    },
  },
};
