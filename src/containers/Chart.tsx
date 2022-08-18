import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../components/Chart';
import { RootDispatch, RootState } from '../store';

const Chart: FC = () => {
  const { loading } = useSelector((state: RootState) => state.loading.models.firefly);
  const configuration = useSelector((state: RootState) => state.configuration);
  const firefly = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();

  const fetchData = () => Promise.all([
    dispatch.firefly.getSummaryBasic(),
    dispatch.firefly.getDashboardBasic(),
  ]).catch();

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
      scrollEnabled={configuration.scrollEnabled}
      fetchData={fetchData}
      filterData={filterData}
      enableScroll={dispatch.configuration.enableScroll}
      disableScroll={dispatch.configuration.disableScroll}
    />
  );
};

export default Chart;
