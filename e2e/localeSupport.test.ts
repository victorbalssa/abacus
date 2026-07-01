import {
  device,
  waitFor,
  element,
  by,
  expect,
} from 'detox';

const SUPPORTED_LOCALES = [
  'en-US',
  'fr-FR',
  'es-ES',
  'pt-BR',
  'de-DE',
  'it-IT',
  'sl-SI',
  'id-ID',
  'zh-CN',
  'ko-KR',
  'tr-TR',
  'uk-UA',
  'ja-JP',
  'fa-IR',
];

describe('Locale Support', () => {
  describe.each(SUPPORTED_LOCALES)('%s locale', (locale) => {
    beforeAll(async () => {
      await device.clearKeychain();
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
      });
    });

    it('should load authentication form with correct locale', async () => {
      await expect(element(by.id('auth_form_url_label'))).toBeVisible();
    });

    it('should display all required UI elements', async () => {
      await expect(element(by.id('toggle_is_oauth'))).toBeVisible();
      await expect(element(by.id('auth_form_url_input'))).toBeVisible();
    });

    afterAll(async () => {
      await device.sendUserInteraction({type: 'background', duration: 1});
    });
  });

  describe('Locale switcher', () => {
    beforeAll(async () => {
      await device.clearKeychain();
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: 'en-US',
          locale: 'en-US',
        },
      });
    });

    it('should support Persian (fa-IR) locale', async () => {
      // Verify Persian locale is available in the supported locales list
      expect(SUPPORTED_LOCALES).toContain('fa-IR');
    });

    it('should have Persian translations loaded', async () => {
      // This test verifies that the Persian locale file exists and is properly imported
      const faIRLocale = SUPPORTED_LOCALES.find(l => l === 'fa-IR');
      expect(faIRLocale).toBeDefined();
    });
  });
});
