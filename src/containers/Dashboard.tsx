import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';

import { CommonActions } from '@react-navigation/native';
import Layout from '../native/components/Dashboard';
import Loading from '../native/components/UI/Loading';
import { HomeDisplayType } from "../models/firefly";

type DashboardContainerType = {
  loading: boolean,
  range: number,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  getSummary: () => Promise<void>,
  getDashboard: () => Promise<void>,
  handleChangeRange: (value: object) => Promise<void>,
};

const Dashboard = ({
  loading,
  range,
  netWorth,
  spent,
  earned,
  balance,
  getSummary,
  getDashboard,
  handleChangeRange,
}: DashboardContainerType) => {
  const toast = useToast();

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
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      range={range}
      loading={loading}
      netWorth={netWorth}
      spent={spent}
      balance={balance}
      earned={earned}
      fetchData={fetchData}
      handleChangeRange={handleChangeRange}
    />
  );
};

const mapStateToProps = (state) => ({
  range: state.firefly.range,
  start: state.firefly.start,
  end: state.firefly.end,
  netWorth: state.firefly.netWorth || [],
  spent: state.firefly.spent || [],
  earned: state.firefly.earned || [],
  balance: state.firefly.balance || [],
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
