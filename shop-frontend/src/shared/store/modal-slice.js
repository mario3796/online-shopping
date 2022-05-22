import { createSlice } from '@reduxjs/toolkit';
import { Fragment } from 'react';
import Button from '../components/FormElements/Button';

const initialState = {
  show: false,
  content: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    editProduct: (state, action) => {
      state.content = (
        <Fragment>
          <h3>Product {action.payload.editing ? 'Updated' : 'Added'}!</h3>
          <Button type="button" onClick={action.payload.close}>
            OK
          </Button>
        </Fragment>
      );
      state.show = !state.show;
    },
    deleteProduct: (state, action) => {
      state.content = (
        <Fragment>
          <h3>Product Deleted!</h3>
          <Button type="button" onClick={action.payload}>
            OK
          </Button>
        </Fragment>
      );
      state.show = !state.show;
    },
    signup: (state, action) => {
      state.content = (
        <Fragment>
          <h3>You successfully signed in!</h3>
          <Button type="button" onClick={action.payload}>
            OK
          </Button>
        </Fragment>
      );
      state.show = !state.show;
    },
    checkout: (state, action) => {
      state.content = (
        <Fragment>
          <h4>Total Price: {action.payload.totalPrice}$</h4>
          <h3>Are you sure that you want to checkout ?</h3>
          <Button onClick={action.payload.addOrder} type="button">
            Yes
          </Button>
          <Button onClick={action.payload.close} type="button">
            No
          </Button>
        </Fragment>
      );
      state.show = !state.show;
    },
    clear: (state, action) => {
      state.content = (
        <Fragment>
          <h3>Are you sure that you want to clear the cart ?</h3>
          <Button onClick={action.payload.clearCart} type="button">
            Yes
          </Button>
          <Button onClick={action.payload.close} type="button">
            No
          </Button>
        </Fragment>
      );
      state.show = !state.show;
    },
    close: (state) => {
      state.show = false;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
