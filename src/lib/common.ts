import { Dimensions, Platform, useColorScheme } from 'react-native';
import { getLocales } from 'expo-localization';
import colors from '../constants/colors';

const { height: D_HEIGHT, width: D_WIDTH } = (() => {
  const { width, height } = Dimensions.get('window');
  if (width === 0 && height === 0) {
    return Dimensions.get('screen');
  }
  return { width, height };
})();

const LG_HEIGHT = 900;
const MD_HEIGHT = 800;
const XS_HEIGHT = 690;

export const isSmallScreen = () => {
  if (Platform.OS === 'web') {
    return false;
  }

  return (Platform.OS === 'ios' && D_HEIGHT < XS_HEIGHT && D_WIDTH);
};

export const isMediumScreen = () => {
  if (Platform.OS === 'web') {
    return false;
  }

  return (Platform.OS === 'ios' && D_HEIGHT > MD_HEIGHT && D_HEIGHT < LG_HEIGHT);
};

export const isLargeScreen = () => {
  if (Platform.OS === 'web') {
    return false;
  }

  return (Platform.OS === 'ios' && D_HEIGHT > LG_HEIGHT);
};

export const isValidHttpUrl = (string) => {
  const pattern = new RegExp('^(https?:\\/\\/)' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(string);
};

export const localNumberFormat = (currencyCode, string) => {
  const [local] = getLocales();
  const formatter = new Intl.NumberFormat(local.languageTag, {
    style: 'currency',
    currency: currencyCode,
  });

  return formatter.format(string);
};

export const useThemeColors = () => {
  const colorScheme = useColorScheme();

  return {
    colors: { ...colors, ...colors[colorScheme] },
    colorScheme,
  };
};
