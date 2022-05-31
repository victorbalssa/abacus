import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import PropTypes from 'prop-types';
import { CommonActions } from '@react-navigation/native';
import Layout from '../native/components/Dashboard';
import Loading from '../native/components/UI/Loading';

const Dashboard = ({
  navigation,
  summary,
  dashboard,
  loading,
  getSummary,
  getDashboard,
}) => {
  const toast = useToast();

  const goToOauth = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'oauth' },
      ],
    }),
  );

  const fetchData = async () => {
    try {
      await Promise.all([getSummary(), getDashboard()]);
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        status: 'error',
        description: e.message,
      });
      //goToOauth();
    }
  };

  useEffect(async () => {
    await fetchData();
  }, []);

  if (loading || !dashboard || !summary || !dashboard?.length || !summary?.length) {
    return <Loading />;
  }

  return (
    <Layout
      loading={loading}
      summary={summary}
      dashboard={dashboard}
      fetchData={fetchData}
    />
  );
};

const mapStateToProps = (state) => ({
  summary: state.firefly.summary,
  dashboard: state.firefly.dashboard,
  loading: state.loading.models.firefly,
});

const mapDispatchToProps = (dispatch) => ({
  getSummary: dispatch.firefly.getSummaryBasic,
  getDashboard: dispatch.firefly.getDashboardBasic,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
