import React from 'react';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Layout from '../native/components/Configuration';

const mapStateToProps = (state) => ({
  backendURL: state.configuration.backendURL,
  loading: state.loading.models.configuration,
});

const mapDispatchToProps = (dispatch) => ({
  setBackendURL: dispatch.configuration.setBackendURL,
  resetAllStorage: dispatch.configuration.resetAllStorage,
});

interface ConfigurationContainerType extends
  ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> {
  navigation: object,
  loading: boolean,
  backendURL: string,
}

const ConfigurationContainer = ({
  loading,
  navigation,
  backendURL,
  setBackendURL,
  resetAllStorage,
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
      navigation={navigation}
      loading={loading}
      backendURL={backendURL}
      setBackendURL={setBackendURL}
      resetApp={resetApp}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationContainer);
