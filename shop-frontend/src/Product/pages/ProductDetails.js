import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

import classes from './ProductDetails.module.css';
import Empty from '../../shared/components/Empty/Empty';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const ProductDetails = (props) => {
  const [product, setProduct] = useState(null);
  const params = useParams();
  const { isLoading, sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + 'products/' + params.id
      );
      setProduct(data.product);
      console.log(data);
    };
    fetchProduct();
  }, [params, sendRequest, setProduct]);

  return !product && !isLoading ? (
    <Empty>
      <p>No such a product!</p>
    </Empty>
  ) : (
    <div className={classes.product}>
      {product && !isLoading ? (
        <Fragment>
          <img
            src={process.env.REACT_APP_BACKEND_URL + product.image}
            alt={product.title}
          />
          <div className={classes.container}>
            <h2>{product.title.toUpperCase()}</h2>
            <h3>{product.price.toFixed(2)}$</h3>
            <p>{product.description}</p>
          </div>
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default ProductDetails;
