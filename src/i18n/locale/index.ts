import * as Localization from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import languages from './translations';

const i18n = new I18n();

// Set languages that will be supported by I18n
i18n.translations = {
  ...languages,
};

i18n.enableFallback = true;
i18n.defaultLocale = 'en-US';
i18n.locale = Localization.locale;

export function getKeyByValue(object, value: string) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function translate(value: string, option: TranslateOptions = null) {
  return i18n.t(value, option);
}
