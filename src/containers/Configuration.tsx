import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import Layout from '../components/Configuration';
import { RootDispatch, RootState } from '../store';
import { ContainerPropType } from './types';

const ConfigurationContainer: FC = ({ navigation }: ContainerPropType) => {
  const configuration = useSelector((state: RootState) => state.configuration);
  const dispatch = useDispatch<RootDispatch>();

  const resetApp = async () => {
    await dispatch.configuration.resetAllStorage();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'oauth' },
        ],
      }),
    );
  };

  return (
    <Layout
      backendURL={configuration.backendURL}
      faceId={configuration.faceId}
      resetApp={resetApp}
      setFaceId={dispatch.configuration.setFaceId}
    />
  );
};

export default ConfigurationContainer;
