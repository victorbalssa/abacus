import colors from './colors';

export default {
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
      600: colors.brandStyle0,
    },
    chart1: {
      600: colors.brandStyle1,
    },
    chart2: {
      600: colors.brandStyle2,
    },
    chart3: {
      600: colors.brandStyle3,
    },
    chart4: {
      600: colors.brandStyle4,
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
    Heading: {
      baseStyle: {
        fontFamily: 'Montserrat_Bold',
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: 10,
        _icon: {
          size: 'xl',
        },
        _pressed: {
          style: {
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
