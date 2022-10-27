import React, { useCallback, useEffect, useState } from 'react';

import OrderItem from '../components/OrderItem';
import Empty from '../../shared/components/Empty/Empty';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();

  const fetchOrders = useCallback(async () => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL +
        'orders?userId=' +
        localStorage.getItem('userId')
    );
    setOrders(data.orders);
    console.log(data);
  }, [sendRequest]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  let orderItems = orders.map((item) => (
    <OrderItem key={item._id} item={item} />
  ));

  return !isLoading ? (
    orderItems.length === 0 ? (
      <Empty>
        <p>No Orders yet!</p>
      </Empty>
    ) : (
      orderItems
    )
  ) : (
    <LoadingSpinner />
  );
};

export default OrderList;
