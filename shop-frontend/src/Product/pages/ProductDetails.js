import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Empty from '../../shared/components/Empty/Empty';

import classes from './ProductDetails.module.css';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const ProductDetails = (props) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsLoading(true);
    const fetchProduct = async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'products/' + params.id
      );
      const data = await response.json();
      setProduct(data.product);
      console.log(data);
      setIsLoading(false);
    };
    fetchProduct();
  }, [params, setProduct]);

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
