import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import classes from './OrderDetails.module.css';
import Empty from '../../shared/components/Empty/Empty';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const OrderDetails = (props) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + 'orders/' + params.id
    );
    const data = await response.json();
    setOrder(data.order);
    setIsLoading(false);
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  let orderItems =
    order &&
    order.products.map((product) => {
      return (
        <tr key={product._id}>
          <td>{product._id}</td>
          <td>{product.title}</td>
          <td>{product.price.toFixed(2)}$</td>
          <td>{product.quantity}</td>
          <td>{product.price * product.quantity}$</td>
        </tr>
      );
    });

  return !isLoading && !order ? (
    <Empty>
      <p>No such an order!</p>
    </Empty>
  ) : (
    <div className={classes.order}>
      {order && !isLoading ? (
        <Fragment>
          <h3>Order ID: {order._id}</h3>
          <h4>Ordered by: {order.userId.username}</h4>
          <h4>Total Price: {order.price.toFixed(2)}$</h4>
          <h4>Order Date: {order.createdAt}</h4>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Title</th>
                <th>Product Price</th>
                <th>Product Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>{orderItems}</tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Total Price</td>
                <td>{order.price.toFixed(2)}$</td>
              </tr>
            </tfoot>
          </table>
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default OrderDetails;
