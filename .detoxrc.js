/** @type {Detox.DetoxConfig} */
module.exports = {
  logger: {
    level: 'debug',
  },
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.ts'
    },
    jest: {
      setupTimeout: 120000,
    }
  },
  artifacts: {
    rootDir: 'artifacts',
    plugins: {
      log: { enabled: false },
      screenshot: {
        shouldTakeAutomaticSnapshots: false,
        keepOnlyFailedTestsArtifacts: false,
        takeWhen: {
          testStart: false,
          testDone: false,
        }
      },
      video: {
        enabled: false,
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
    IPHONE_15: {
      type: 'ios.simulator',
      device: {
        name: 'IPHONE_15'
      }
    },
    IPHONE_PRO_MAX: {
      type: 'ios.simulator',
      device: {
        name: 'IPHONE_PRO_MAX'
      }
    },
    IPHONE_SE: {
      type: 'ios.simulator',
      device: {
        name: 'IPHONE_SE'
      }
    },
    IPAD_MINI: {
      type: 'ios.simulator',
      device: {
        name: 'IPAD_MINI'
      }
    },
    IPAD_PRO: {
      type: 'ios.simulator',
      device: {
        name: 'IPAD_PRO'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    'android.emulator.resizable': {
      type: 'android.emulator',
      device: {
        avdName: 'Resizable'
      }
    },
    'android.emulator.4': {
      type: 'android.emulator',
      device: {
        avdName: '4'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'ios.sim.release.IPHONE_PRO_MAX': {
      device: 'IPHONE_PRO_MAX',
      app: 'ios.release'
    },
    'ios.sim.release.IPHONE_15': {
      device: 'IPHONE_15',
      app: 'ios.release'
    },
    'ios.sim.release.IPHONE_SE': {
      device: 'IPHONE_SE',
      app: 'ios.release'
    },
    'ios.sim.release.IPAD_MINI': {
      device: 'IPAD_MINI',
      app: 'ios.release'
    },
    'ios.sim.release.IPAD_PRO': {
      device: 'IPAD_PRO',
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
      device: 'android.emulator.6',
      app: 'android.debug'
    },
    'android.emu.resizable.release': {
      device: 'android.emulator.resizable',
      app: 'android.release'
    },
    'android.emu.4.release': {
      device: 'android.emulator.4',
      app: 'android.release'
    }
  }
};
