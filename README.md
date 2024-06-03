<div align="center">
    <p></p>
  <img alt="logo" src=".github/img/icon.png" height=120 />
  <h1>Abacus: Firefly III mobile application</h1>
  <div>
    <a href="https://apps.apple.com/us/app/1627093491"><img width="180" src=".github/img/apple.svg" /></a>
    <a href="https://play.google.com/store/apps/details?id=abacus.fireflyiii.android.app"><img width="180" src=".github/img/google.svg" /></a>
  </div>
  <p></p>
  <div>
    <img alt="chart" src=".github/img/light-demo.gif" />
    <h6>Light Mode</h6>
    <img alt="chart" src=".github/img/dark-demo.gif" />
    <h6>Dark Mode</h6>
  </div>
  <p></p>
  <sup>

![size](https://img.shields.io/github/repo-size/victorbalssa/abacus?style=for-the-badge)
![licence](https://img.shields.io/github/license/victorbalssa/abacus?style=for-the-badge)
![stars](https://img.shields.io/github/stars/victorbalssa/abacus?style=for-the-badge)
[![sdk](https://img.shields.io/badge/EXPO-SDK-purple?style=for-the-badge&label=EXPO%20SDK)](https://www.npmjs.com/package/expo)
[![pr](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![sponsor](https://img.shields.io/github/sponsors/victorbalssa?style=for-the-badge&color=ff69b4)](https://github.com/sponsors/victorbalssa)

  </sup>
</div>

---

### 🎙 Introduction

[Firefly III](https://github.com/firefly-iii/firefly-iii) mobile application to manage your self-hosted Firefly III from
your mobile.

Support for iPhone, iPad, Android Phone and Android Tablet.

On iOS, Tokens are stored in [**iOS Keychains**](https://developer.apple.com/documentation/security/keychain_services).

On Android, Tokens are stored in [**SharedPreferences**](https://developer.android.com/training/data-storage/shared-preferences), encrypted with [**Android's Keystore system**](https://developer.android.com/training/articles/keystore.html).

No external API calls nor Analytics API, not even sentry / crashlytics.

---

### 📱 Features

## [🏁 Roadmap](https://github.com/users/victorbalssa/projects/2/views/1)

| Feature                      | Available |
|------------------------------|:---------:|
| Oauth2 authentication        |     ✅     |
| Asset accounts history chart |     ✅     | 
| Transactions (create, list)  |     ✅     |
| Net worth                    |     ✅     |
| Balance                      |     ✅     |
| Earned                       |     ✅     |
| Time range selector          |     ✅     |
| Budgets                      |     ✅     |
| Categories                   |     ✅     |
| Translations                 |   ✅(@carvalholeo)    |
| Piggy bank                   |     ✅     |

---

### 📡 Technologies

- __Expo SDK__ Framework and a Platform for universal React applications. [docs.expo.io](https://docs.expo.io/)
- __Routing and navigation__ React Navigation
  V6. [https://reactnavigation.org/docs](https://reactnavigation.org/docs/getting-started)
- __Tests__ on simulator/emulator before each EAS build with [@wix/Detox](https://github.com/wix/Detox)
- __Store arch__
    - Rematch core [@rematch/core](https://github.com/rematch/rematch)
    - Loading plugin [@rematch/loading](https://rematchjs.org/docs/plugins/loading)
    - Persist plugin [@rematch/persist](https://rematchjs.org/docs/plugins/persist)
- __Linting__
    - Airbnb's Linting : [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript)

---

### 📖 Docs

- [Contributing to this project](.github/CONTRIBUTING.md)
- [Understanding the file structure](.github/FILE.md)
- [Need help with Authentication?](.github/HELP.md)
- [ReactNative.dev](https://reactnative.dev)
