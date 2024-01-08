import { getLocales } from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import moment from 'moment/moment';
import languages from './translations';

const i18n = new I18n();

// Set languages that will be supported by I18n
i18n.translations = {
  ...languages,
};

i18n.enableFallback = true;
i18n.defaultLocale = 'en-US';
const [{ languageCode }] = getLocales();
i18n.locale = languageCode;

if (Object.keys(languages).includes(languageCode)) {
  // fix zh locale
  moment.locale(languageCode === 'zh' ? 'zh-cn' : languageCode);
} else {
  moment.locale('en');
}

export default function translate(value: string, option: TranslateOptions = null) {
  return i18n.t(value, option);
}
