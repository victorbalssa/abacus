import React, { useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Image,
} from 'react-native';
import { ABlurView, AText } from './ALibrary';

function PrivacyScreen() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // eslint-disable-next-line global-require
  const img = require('../../images/icon-abacus-splash.png');

  return appStateVisible !== 'active' && (
    <ABlurView
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      intensity={60}
    >
      <Image
        style={{
          width: 100,
          height: 100,
        }}
        source={img}
      />
      <AText>Abacus</AText>
    </ABlurView>
  );
}

export default PrivacyScreen;
