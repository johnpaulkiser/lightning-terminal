import React, { useEffect } from 'react';

import { useStore } from 'store';
import NodeStatus from 'components/NodeStatus';

export default {
  title: 'Components/Node Status',
  component: NodeStatus,
  parameters: { centered: true },
};

export const Default = () => {
  const store = useStore();
  useEffect(() => {
    const { channelBalance, walletBalance } = store.balances || {
      channelBalance: 0,
      walletBalance: 0,
    };
    store.balances = { channelBalance: 0, walletBalance: 0 };

    // change back to sample data when the component is unmounted
    return () => {
      store.balances = { channelBalance, walletBalance };
    };
  }, []);

  return <NodeStatus />;
};

export const WithBalances = () => <NodeStatus />;
