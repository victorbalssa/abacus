import * as Localization from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import languages from './translations';

const i18n = new I18n();

// Set languages that will be supported by I18n
i18n.translations = {
  ...languages,
};

i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = Localization.locale;

function getKeyByValue(object, value: string) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function translate(value: string, option: TranslateOptions = null) {
  const key = getKeyByValue(i18n.locale, value);
  return i18n.t(key, option);
}

// export const translateByCode = (key: string, option = null) => i18nObject.t(key, option);
