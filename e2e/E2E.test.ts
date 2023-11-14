import {
  device,
  waitFor,
  element,
  by,
  expect,
} from 'detox';

const {
  DETOX_TEST_TOKEN,
  DETOX_TEST_URL,
} = process.env;
const testURL = DETOX_TEST_URL;
const testToken = DETOX_TEST_TOKEN;

describe.each([
  ['en-US'],
  ['fr-FR'],
  ['es-ES'],
  ['pt-BR'],
  ['de-DE'],
  ['it-IT'],
  ['sl-SI'],
  ['id-ID'],
  ['zh-CN'],
])(`%s`, (locale) => {
  beforeAll(async () => {
    // reset authentication tokens
    await device.clearKeychain();
    await device.launchApp({
      newInstance: true,
      languageAndLocale: {
        language: locale,
        locale
      }
    });
  });

  it('screenshots', async () => {
    // OAUTH
    await expect(element(by.id('auth_form_url_label'))).toBeVisible();
    await device.takeScreenshot('oauth');
    await expect(element(by.id('toggle_is_oauth'))).toBeVisible();
    await element(by.id('toggle_is_oauth')).tap();
    await expect(element(by.id('auth_form_personal_access_token_input'))).toBeVisible();

    //HOME
    await device.disableSynchronization();
    await element(by.id('auth_form_url_input')).replaceText(testURL);
    await element(by.id('auth_form_personal_access_token_input')).replaceText(testToken);
    // dismiss keyboard by tapping a label (iOS)
    await element(by.id('auth_form_url_label')).tap();
    await new Promise((r) => setTimeout(r, 1000));
    await element(by.id('auth_form_submit_button_initial')).tap();

    // redirect to home
    await waitFor(element(by.id('home_screen_net_worth'))).toExist().withTimeout(20000);
    await new Promise((r) => setTimeout(r, 5000));
    await device.takeScreenshot('home');

    // CHART
    await element(by.id('navigation_chart_tab')).tap();
    await new Promise((r) => setTimeout(r, 1000));
    await device.takeScreenshot('chart');

    // TRANSACTIONS
    await element(by.id('navigation_transactions_tab')).tap();
    await new Promise((r) => setTimeout(r, 3000));
    await device.takeScreenshot('transactions');

    // SETTINGS
    await element(by.id('navigation_settings_tab')).tap();
    await new Promise((r) => setTimeout(r, 1000));
    await device.takeScreenshot('settings');

    // MODAL NEW TRANSACTION
    await element(by.id('navigation_create_transaction')).tap();
    await new Promise((r) => setTimeout(r, 1000));
    await device.takeScreenshot('create');
  });
});
