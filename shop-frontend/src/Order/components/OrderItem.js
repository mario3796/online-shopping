import React from 'react';
import { Link } from 'react-router-dom';
import classes from './OrderItem.module.css';

const OrderItem = (props) => {
  return (
    <div className={classes.OrderItem}>
      <h3>Order ID: {props.item._id}</h3>
      <h4>Price: {props.item.price.toFixed(2)}$</h4>
      <h4>Username: {props.item.userId.username}</h4>
      <Link to={`/orders/${props.item._id}`} className={classes.link}>
        View
      </Link>
    </div>
  );
};

export default OrderItem;
