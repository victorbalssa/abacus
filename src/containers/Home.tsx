import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';

import Layout from '../native/components/Home';
import { HomeDisplayType } from '../models/firefly';

const mapStateToProps = (state) => ({
  loading: state.loading.models.firefly,
  netWorth: state.firefly.netWorth,
  spent: state.firefly.spent,
  balance: state.firefly.balance,
  earned: state.firefly.earned,
});

const mapDispatchToProps = (dispatch) => ({
  handleChangeRange: dispatch.firefly.handleChangeRange,
  getSummary: dispatch.firefly.getSummaryBasic,
  getDashboard: dispatch.firefly.getDashboardBasic,
});

type HomeContainerType = {
  loading: boolean,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  balance: HomeDisplayType[],
  earned: HomeDisplayType[],
  getSummary: () => Promise<void>,
  getDashboard: () => Promise<void>,
  handleChangeRange: (value: object) => Promise<void>,
};

const Home = ({
  loading,
  netWorth,
  spent,
  balance,
  earned,
  getSummary,
  getDashboard,
  handleChangeRange,
}: HomeContainerType) => {
  const toast = useToast();

  useEffect(() => {
    (async () => handleChangeRange({ range: '3' }))();
  }, []);

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

  return (
    <Layout
      loading={loading}
      netWorth={netWorth}
      spent={spent}
      balance={balance}
      earned={earned}
      fetchData={fetchData}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
