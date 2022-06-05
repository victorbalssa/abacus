import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import PropTypes from 'prop-types';
import { CommonActions } from '@react-navigation/native';
import Layout from '../native/components/Chart';
import Loading from '../native/components/UI/Loading';

const Dashboard = ({
  range,
  start,
  end,
  navigation,
  dashboard,
  loading,
  getSummary,
  getDashboard,
  filterData,
  handleChangeRange,
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
      //TODO: if oauth exeption gotoOauth()
      //goToOauth();
    }
  };

  if (loading || !dashboard || !dashboard?.length) {
    return <Loading />;
  }

  return (
    <Layout
      range={range}
      loading={loading}
      start={start}
      end={end}
      dashboard={dashboard}
      fetchData={fetchData}
      filterData={filterData}
      handleChangeRange={handleChangeRange}
    />
  );
};

const mapStateToProps = (state) => ({
  range: state.firefly.range,
  start: state.firefly.start,
  end: state.firefly.end,
  netWorth: state.firefly.netWorth,
  spent: state.firefly.spent,
  earned: state.firefly.earned,
  balance: state.firefly.balance,
  dashboard: state.firefly.dashboard,
  loading: state.loading.models.firefly,
});

const mapDispatchToProps = (dispatch) => ({
  filterData: dispatch.firefly.filterData,
  handleChangeRange: dispatch.firefly.handleChangeRange,
  getSummary: dispatch.firefly.getSummaryBasic,
  getDashboard: dispatch.firefly.getDashboardBasic,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
