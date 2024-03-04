// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AndroidConfig, withAndroidStyles } = require('@expo/config-plugins');

const setStrings = (modResults) => {
  let newStyles = { ...modResults };

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'colorAccent' }, _: '#ffffff' },
    parent: {
      parent: 'Theme.AppCompat.Dialog.Alert',
      name: 'AlertDialogTheme',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:textColorPrimary' }, _: '#ffffff' },
    parent: {
      parent: 'Theme.AppCompat.Dialog.Alert',
      name: 'AlertDialogTheme',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:background' }, _: '#212121' },
    parent: {
      parent: 'Theme.AppCompat.Dialog.Alert',
      name: 'AlertDialogTheme',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:buttonBarNegativeButtonStyle' }, _: '@style/NegativeButtonStyle' },
    parent: {
      parent: 'Theme.AppCompat.Dialog.Alert',
      name: 'AlertDialogTheme',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:buttonBarPositiveButtonStyle' }, _: '@style/PositiveButtonStyle' },
    parent: {
      parent: 'Theme.AppCompat.Dialog.Alert',
      name: 'AlertDialogTheme',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:windowTitleStyle' }, _: '@style/MyTitleTextStyle' },
    parent: {
      parent: 'Theme.AppCompat.Dialog.Alert',
      name: 'AlertDialogTheme',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:textColor' }, _: '#ffffff' },
    parent: {
      parent: 'Widget.AppCompat.Button.ButtonBar.AlertDialog',
      name: 'MyTitleTextStyle',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:textColor' }, _: '#d50c3c' },
    parent: {
      parent: 'Widget.AppCompat.Button.ButtonBar.AlertDialog',
      name: 'NegativeButtonStyle',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:textColor' }, _: '#549cea' },
    parent: {
      parent: 'Widget.AppCompat.Button.ButtonBar.AlertDialog',
      name: 'PositiveButtonStyle',
    },
    xml: newStyles,
  });

  newStyles = AndroidConfig.Styles.setStylesItem({
    item: { $: { name: 'android:alertDialogTheme' }, _: '@style/AlertDialogTheme' },
    parent: {
      parent: 'Theme.AppCompat.Light.NoActionBar',
      name: 'AppTheme',
    },
    xml: newStyles,
  });

  return newStyles;
};

module.exports = function withAndroidStylesUpdates(configuration) {
  return withAndroidStyles(configuration, (config) => {
    const newConfig = { ...config };

    newConfig.modResults = setStrings(newConfig.modResults);

    return newConfig;
  });
};
