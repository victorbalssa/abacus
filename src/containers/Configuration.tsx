import React from 'react';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Layout from '../native/components/Configuration';
import { Dispatch } from '../store';

const mapStateToProps = (state) => ({
  backendURL: state.configuration.backendURL,
  faceId: state.configuration.faceId,
  loading: state.loading.models.configuration,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetAllStorage: dispatch.configuration.resetAllStorage,
  setFaceId: dispatch.configuration.setFaceId,
});

interface ConfigurationContainerType extends ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> {
  navigation: { dispatch: (action) => void },
  loading: boolean,
  backendURL: string,
}

const ConfigurationContainer = ({
  loading,
  navigation,
  backendURL,
  resetAllStorage,
  faceId,
  setFaceId,
}: ConfigurationContainerType) => {
  const resetApp = async () => {
    await resetAllStorage();
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
      loading={loading}
      backendURL={backendURL}
      resetApp={resetApp}
      faceId={faceId}
      setFaceId={setFaceId}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationContainer);
