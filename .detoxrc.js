/** @type {Detox.DetoxConfig} */
module.exports = {
  logger: {
    level: process.env.CI ? 'debug' : undefined,
  },
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  artifacts: {
    rootDir: '.artifacts',
    plugins: {
      log: { enabled: true },
      screenshot: {
        shouldTakeAutomaticSnapshots: true,
        keepOnlyFailedTestsArtifacts: true,
        takeWhen: {
          testStart: false,
          testDone: true,
        }
      },
      video: {
        enabled: true,
        android: {
          bitRate: 4000000,
        },
        simulator: {
          codec: 'hevc',
        }
      }
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Abacus.app',
      build: 'xcodebuild -workspace ios/Abacus.xcworkspace -scheme Abacus -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/Abacus.app',
      build: 'xcodebuild -workspace ios/Abacus.xcworkspace -scheme Abacus -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [
        8081
      ]
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release'
    }
  },
  devices: {
    iPhone15: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    },
    iPhoneSE: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone SE (2nd generation)'
      }
    },
    iPadmini: {
      type: 'ios.simulator',
      device: {
        type: 'iPad mini (6th generation)'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_33_arm64-v8a'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'ios.sim.release.iPhone14': {
      device: 'iPhone14',
      app: 'ios.release'
    },
    'ios.sim.release.iPhoneSE': {
      device: 'iPhoneSE',
      app: 'ios.release'
    },
    'ios.sim.release.iPadmini': {
      device: 'iPadmini',
      app: 'ios.release'
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug'
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  }
};
