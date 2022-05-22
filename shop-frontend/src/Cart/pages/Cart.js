import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import CartItem from '../components/CartItem';
import Button from '../../shared/components/FormElements/Button';
import Empty from '../../shared/components/Empty/Empty';
import { modalActions } from '../../shared/store/modal-slice';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const Cart = () => {
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchCart = async () => {
    setIsLoading(true);
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + 'cart/' + localStorage.getItem('userId'),
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setCart({
      items: data.cart,
      totalPrice: data.totalPrice,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increment = async (productId) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userId'),
        productId: productId,
      }),
    });
    const data = await response.json();
    console.log(data);
    fetchCart();
    setTimeout(() => {
      let product = document.getElementById(productId)
      localStorage.setItem('scrollPosition', product.getBoundingClientRect().top);
      product.scrollIntoView({ behavior: "smooth", block: "center" });
      localStorage.removeItem('scrollPosition');
    }, 1000);
  };

  const decrement = async (productId) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userId'),
        productId: productId,
      }),
    });
    const data = await response.json();
    console.log(data);
    fetchCart();

    let scrollTop = document.documentElement.scrollTop;
    localStorage.setItem('scrollPosition', scrollTop);
    setTimeout(() => {
      let product = document.getElementById(productId)
      if (product) {
        localStorage.setItem('scrollPosition', product.getBoundingClientRect().top);
        product.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({behavior: "smooth", top: localStorage.getItem('scrollPosition')})
      }
      localStorage.removeItem('scrollPosition');
    }, 1000);
  };

  const addOrder = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userId'),
        price: cart.totalPrice,
        products: cart.items,
      }),
    });
    const data = await response.json();
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
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + 'cart/' + localStorage.getItem('userId'),
      {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      }
    );
    const data = await response.json();
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
