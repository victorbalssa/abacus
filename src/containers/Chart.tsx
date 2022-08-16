import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../components/Chart';
import { RootDispatch, RootState } from '../store';

const Chart: FC = () => {
  const { loading } = useSelector((state: RootState) => state.loading.effects.firefly.getDashboardBasic);
  const configuration = useSelector((state: RootState) => state.configuration);
  const firefly = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();

  const filterData = (payload) => {
    try {
      dispatch.firefly.filterData(payload);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout
      loading={loading}
      start={firefly.start}
      end={firefly.end}
      accounts={firefly.accounts}
      backendURL={configuration.backendURL}
      fetchData={dispatch.firefly.getDashboardBasic}
      filterData={filterData}
    />
  );
};

export default Chart;
