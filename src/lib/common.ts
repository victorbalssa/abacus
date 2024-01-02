import { Dimensions, Platform, useColorScheme } from 'react-native';
import { getLocales } from 'expo-localization';
import moment from 'moment/moment';
import colors from '../constants/colors';
import translate from '../i18n/locale';

export const { height: D_HEIGHT, width: D_WIDTH } = (() => {
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
    + '((\\d{1,3}\\.){3}\\d{1,3})|' // OR ip (v4) address
    + '([a-z\\d]([a-z\\d-]*[a-z\\d])*))' // OR just domain name without .tld
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(string);
};

export const localNumberFormat = (currencyCode: string, num: number | bigint) => {
  const [locale] = getLocales();
  const subLocales = ['CA', 'IN'];
  const formatter = new Intl.NumberFormat(subLocales.some(substring => locale.languageTag.includes(substring)) ? locale.languageTag : locale.languageCode, {
    style: 'currency',
    currency: currencyCode || 'USD',
  });

  return formatter.format(num);
};

export const useThemeColors = () => {
  const colorScheme = useColorScheme();

  return {
    colors: { ...colors, ...colors[colorScheme] },
    colorScheme,
  };
};

export const generateRangeTitle = (range: number, start: string, end: string): string => {
  let title = '';

  switch (range) {
    case 1:
      title = `${moment(end).format('MMM')} ${moment(end).year()}`;
      break;
    case 3:
      title = `${translate('home_header_time_range_q')}${moment(start).quarter()} ${moment(start).year()}`;
      break;
    case 6:
      title = `${translate('home_header_time_range_s')}${moment(start).quarter() < 3 ? 1 : 2} ${moment(start).year()}`;
      break;
    case 12:
      title = `${moment(start).year()}`;
      break;
    default:
      title = `${moment(start).year()}`;
      break;
  }

  return title;
};

const snakeToCamel = (str) => str.replace(/(_\w)/g, (match) => match[1].toUpperCase());

export const convertKeysToCamelCase = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToCamelCase(item));
  }
  if (typeof data === 'object' && data !== null) {
    const camelCaseData = {};
    Object.keys(data).forEach((key) => {
      if (Object.hasOwn(data, key)) {
        const camelKey = snakeToCamel(key);
        if (typeof data[key] === 'object' && data[key] !== null) {
          camelCaseData[camelKey] = convertKeysToCamelCase(data[key]);
        } else {
          camelCaseData[camelKey] = data[key];
        }
      }
    });

    return camelCaseData;
  }

  return data;
};
