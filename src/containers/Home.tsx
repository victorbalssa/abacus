import React, { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from 'native-base';

import Layout from '../components/Home';
import { RootDispatch, RootState } from '../store';

const Home: FC = () => {
  const toast = useToast();
  const loading = useSelector((state: RootState) => state.loading.models.firefly);
  const firefly = useSelector((state: RootState) => state.firefly);
  const dispatch = useDispatch<RootDispatch>();

  useEffect(() => {
    dispatch.firefly.handleChangeRange({});
  }, []);

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
      netWorth={firefly.netWorth}
      spent={firefly.spent}
      balance={firefly.balance}
      earned={firefly.earned}
      fetchData={fetchData}
    />
  );
};

export default Home;
