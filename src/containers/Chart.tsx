import React from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import Layout from '../native/components/Chart';
import Loading from '../native/components/UI/Loading';

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

const Chart = ({
  range,
  start,
  end,
  dashboard,
  loading,
  getSummary,
  getDashboard,
  filterData,
  handleChangeRange,
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

  if (loading) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
