import React from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import Layout from '../native/components/Chart';

const mapStateToProps = (state) => ({
  range: state.firefly.range,
  start: state.firefly.start,
  end: state.firefly.end,
  netWorth: state.firefly.netWorth,
  spent: state.firefly.spent,
  earned: state.firefly.earned,
  balance: state.firefly.balance,
  accounts: state.firefly.accounts,
  loading: state.loading.models.firefly,
});

const mapDispatchToProps = (dispatch) => ({
  filterData: dispatch.firefly.filterData,
  handleChangeRange: dispatch.firefly.handleChangeRange,
  getSummary: dispatch.firefly.getSummaryBasic,
  getDashboard: dispatch.firefly.getDashboardBasic,
});

const Chart = ({
  loading,
  start,
  end,
  accounts,
  getSummary,
  getDashboard,
  filterData,
}) => {
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

  return (
    <Layout
      loading={loading}
      start={start}
      end={end}
      accounts={accounts}
      fetchData={fetchData}
      filterData={filterData}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
