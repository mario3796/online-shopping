import React from 'react';

import Button from '../../shared/components/FormElements/Button';
import classes from './CartItem.module.css';

const CartItem = (props) => {
  return (
    <div className={classes.CartItem} id={props.item._id}>
      <div className={classes.container}>
        <h3>Title: {props.item.title.toUpperCase()}</h3>
        <h4>Price: {props.item.price.toFixed(2)}$</h4>
        <h4>Quantity: {props.item.quantity}</h4>
        <Button
          type="button"
          style={{ fontSize: 'xx-large', width: '30px' }}
          onClick={props.increment.bind(this, props.item._id)}
        >
          +
        </Button>
        <Button
          type="button"
          style={{ fontSize: 'xx-large', width: '30px' }}
          onClick={props.decrement.bind(this, props.item._id)}
        >
          -
        </Button>
      </div>
      <img
        src={process.env.REACT_APP_BACKEND_URL + props.item.image}
        alt={props.item.title}
      />
    </div>
  );
};

export default CartItem;
