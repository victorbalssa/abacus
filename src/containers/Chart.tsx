import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'native-base';
import Layout from '../components/Chart';
import { RootDispatch, RootState } from '../store';

const Chart: FC = () => {
  const toast = useToast();
  const loading = useSelector((state: RootState) => state.loading.models.firefly);
  const configuration = useSelector((state: RootState) => state.configuration);
  const firefly = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();

  const fetchData = async () => {
    try {
      await Promise.all([
        dispatch.firefly.getSummaryBasic(),
        dispatch.firefly.getDashboardBasic(),
      ]);
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        description: e.message,
      });
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
      filterData={dispatch.firefly.filterData}
      enableScroll={dispatch.configuration.enableScroll}
      disableScroll={dispatch.configuration.disableScroll}
    />
  );
};

export default Chart;
