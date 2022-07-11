import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import Layout from '../native/components/Transactions';
import { Dispatch, RootState } from '../store';

const mapStateToProps = (state: RootState) => ({
  loading: state.loading.models.transactions,
  transactions: state.transactions.transactions,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getTransactions: dispatch.transactions.getTransactions,
});

const Transactions = ({
  loading,
  transactions,
  getTransactions,
}) => {
  const toast = useToast();

  const fetchData = async () => {
    try {
      await Promise.all([getTransactions()]);
    } catch (e) {
      console.error(e);
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        status: 'error',
        description: e.message,
      });
    }
  };

  useEffect(() => {
    (async () => fetchData())();
  }, []);

  return (
    <Layout
      loading={loading}
      transactions={transactions}
      fetchData={fetchData}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
