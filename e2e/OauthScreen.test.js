const {
  DETOX_TEST_TOKEN,
  DETOX_TEST_URL,
} = process.env;
const testURL = DETOX_TEST_URL;
const testToken = DETOX_TEST_TOKEN;

describe('OauthScreen', () => {
  beforeAll(async () => {
    // reset authentication tokens
    await device.clearKeychain();
    await device.launchApp();
  });

  it('should display auth_form_url_label', async () => {
    await waitFor(element(by.id('auth_form_url_label'))).toBeVisible().withTimeout(10000);
  });

  it('should show auth_form_personal_access_token_label after switch is_oauth', async () => {
    await waitFor(element(by.id('toggle_is_oauth'))).toBeVisible().withTimeout(10000);
    await element(by.id('toggle_is_oauth')).longPress();
    await waitFor(element(by.id('auth_form_personal_access_token_input'))).toBeVisible().withTimeout(10000);
  });

  it('should login successfully', async () => {
    await element(by.id('auth_form_url_input')).replaceText(testURL);
    await element(by.id('auth_form_personal_access_token_input')).replaceText(testToken);
    await element(by.id('auth_form_submit_button_initial')).longPress();

    await waitFor(element(by.id('home_screen_net_worth_text'))).toBeVisible().withTimeout(10000);
  });
});
