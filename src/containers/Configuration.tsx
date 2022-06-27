import React from 'react';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Layout from '../native/components/Configuration';

const Configuration = ({
  loading,
  navigation,
  backendURL,
  setBackendURL,
  resetAllStorage,
}: ConfigurationContainer) => {
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
      navigation={navigation}
      loading={loading}
      backendURL={backendURL}
      setBackendURL={setBackendURL}
      resetApp={resetApp}
    />
  );
};

type ConfigurationContainer = {
  navigation: any,
  loading: boolean,
};

const mapStateToProps = (state) => ({
  backendURL: state.configuration.backendURL,
  loading: state.loading.models.configuration,
});

const mapDispatchToProps = (dispatch) => ({
  setBackendURL: dispatch.configuration.setBackendURL,
  resetAllStorage: dispatch.configuration.resetAllStorage,
});

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
