import React, { useEffect, useState } from 'react';

import OrderItem from '../components/OrderItem';
import Empty from '../../shared/components/Empty/Empty';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        'orders?userId=' +
        localStorage.getItem('userId')
    );
    const data = await response.json();
    setOrders(data.orders);
    console.log(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  let orderItems = orders.map((item) => (
    <OrderItem key={item._id} item={item} />
  ));

  return orderItems.length === 0 ? (
    <Empty>
      <p>No Orders yet!</p>
    </Empty>
  ) : (
    orderItems
  );
};

export default OrderList;
