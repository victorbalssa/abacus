import React from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import Layout from '../native/components/Chart';
import { Dispatch, RootState } from '../store';

const mapStateToProps = (state: RootState) => ({
  range: state.firefly.range,
  start: state.firefly.start,
  end: state.firefly.end,
  netWorth: state.firefly.netWorth,
  spent: state.firefly.spent,
  earned: state.firefly.earned,
  balance: state.firefly.balance,
  accounts: state.firefly.accounts,
  loading: state.loading.models.firefly,
  scrollEnabled: state.configuration.scrollEnabled,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  filterData: dispatch.firefly.filterData,
  handleChangeRange: dispatch.firefly.handleChangeRange,
  getSummary: dispatch.firefly.getSummaryBasic,
  getDashboard: dispatch.firefly.getDashboardBasic,
  disableScroll: dispatch.configuration.disableScroll,
  enableScroll: dispatch.configuration.enableScroll,
});

const Chart = ({
  loading,
  start,
  end,
  accounts,
  getSummary,
  getDashboard,
  filterData,
  disableScroll,
  enableScroll,
  scrollEnabled,
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
      enableScroll={enableScroll}
      disableScroll={disableScroll}
      scrollEnabled={scrollEnabled}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
