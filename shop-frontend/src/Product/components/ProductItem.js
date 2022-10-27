import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classes from './ProductItem.module.css';
import { AuthContext } from '../../shared/context/auth-context';
import { modalActions } from '../../shared/store/modal-slice';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Button from '../../shared/components/FormElements/Button';

const ProductItem = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient()

  const deleteProductHandler = async (event) => {
    event.preventDefault();
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'products/' + props.product._id,
        'DELETE',
        null,
        { Authorization: authCtx.token },
    );
    dispatch(modalActions.deleteProduct(() => dispatch(modalActions.close())));
    console.log(data);
    history.replace('/');
  };

  const addToCart = async () => {
    const data = await sendRequest(process.env.REACT_APP_BACKEND_URL + 'cart',
      'POST',
      JSON.stringify({
        userId: localStorage.getItem('userId'),
        productId: props.product._id,
      }),
      {
        'Content-Type': 'application/json',
        Authorization: authCtx.token,
      }
    );
    console.log(data);
  };

  return (
    <div className={classes.ProductItem}>
      <img
        src={process.env.REACT_APP_BACKEND_URL + props.product.image}
        alt={props.product.name}
      />
      <div className={classes.container}>
        <h2>{props.product.title.toUpperCase()}</h2>
        <h3>{props.product.price.toFixed(2)}$</h3>
        {authCtx.token && (
          <Link
            className={classes.link}
            to={`/edit-product/${props.product._id}`}
          >
            Update
          </Link>
        )}
        <Link className={classes.link} to={`/products/${props.product._id}`}>
          Details
        </Link>
        {authCtx.token && (
          <Button onClick={deleteProductHandler} type="button">
            Delete
          </Button>
        )}
        {authCtx.token && (
          <Button onClick={addToCart} type="button">
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
