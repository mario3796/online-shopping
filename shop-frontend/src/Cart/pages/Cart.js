import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import CartItem from '../components/CartItem';
import Button from '../../shared/components/FormElements/Button';
import Empty from '../../shared/components/Empty/Empty';
import { modalActions } from '../../shared/store/modal-slice';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const Cart = () => {
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();

  const fetchCart = useCallback(async () => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL +
        'cart/' +
        localStorage.getItem('userId'),
      'GET',
      null,
      { Authorization: localStorage.getItem('token') }
    );
    console.log(data);
    setCart({
      items: data.cart,
      totalPrice: data.totalPrice,
    });
    setIsLoading(false);
  }, [sendRequest]);

  useEffect(() => {
    setIsLoading(true);
    fetchCart();
  }, [fetchCart]);

  const increment = async (productId) => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'cart',
      'POST',
      JSON.stringify({
        userId: localStorage.getItem('userId'),
        productId: productId,
      }),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    console.log(data);
    fetchCart();
    // setTimeout(() => {
    //   let product = document.getElementById(productId)
    //   localStorage.setItem('scrollPosition', product.getBoundingClientRect().top);
    //   product.scrollIntoView({ behavior: "smooth", block: "center" });
    //   localStorage.removeItem('scrollPosition');
    // }, 1000);
  };

  const decrement = async (productId) => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'cart',
      'PUT',
      JSON.stringify({
        userId: localStorage.getItem('userId'),
        productId: productId,
      }),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    console.log(data);
    fetchCart();

    // let scrollTop = document.documentElement.scrollTop;
    // localStorage.setItem('scrollPosition', scrollTop);
    // setTimeout(() => {
    //   let product = document.getElementById(productId)
    //   if (product) {
    //     localStorage.setItem('scrollPosition', product.getBoundingClientRect().top);
    //     product.scrollIntoView({ behavior: "smooth", block: "center" });
    //   } else {
    //     window.scrollTo({behavior: "smooth", top: localStorage.getItem('scrollPosition')})
    //   }
    //   localStorage.removeItem('scrollPosition');
    // }, 1000);
  };

  const addOrder = async () => {
    setIsLoading(true);
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'orders',
      'POST',
      JSON.stringify({
        userId: localStorage.getItem('userId'),
        price: cart.totalPrice,
        products: cart.items,
      }),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    console.log(data);
    dispatch(modalActions.close());
    fetchCart();
  };

  const checkout = () => {
    dispatch(
      modalActions.checkout({
        addOrder,
        close: () => dispatch(modalActions.close()),
        totalPrice: cart.totalPrice,
      })
    );
  };

  const clearCart = async () => {
    setIsLoading(true);
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL +
        'cart/' +
        localStorage.getItem('userId'),
      'DELETE',
      null,
      { Authorization: localStorage.getItem('token') }
    );
    console.log(data);
    dispatch(modalActions.close());
    fetchCart();
  };

  const clear = () => {
    dispatch(
      modalActions.clear({
        clearCart,
        close: () => dispatch(modalActions.close()),
      })
    );
  };

  let cartItems = cart.items.map((item) => {
    return (
      <CartItem
        key={item._id}
        item={item}
        increment={increment}
        decrement={decrement}
      />
    );
  });

  return !isLoading ? (
    cartItems.length === 0 ? (
      <Empty>
        <p>No Product Added!</p>
      </Empty>
    ) : (
      <div>
        {cartItems}
        <Empty>
          <p>Total Price: {cart.totalPrice}$</p>
          <Button type="button" onClick={checkout}>
            Checkout
          </Button>
          <Button type="button" onClick={clear}>
            Clear
          </Button>
        </Empty>
      </div>
    )
  ) : (
    <LoadingSpinner />
  );
};

export default Cart;
