import { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';

import ProductItem from '../components/ProductItem';
import Empty from '../../shared/components/Empty/Empty';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const ProductList = (props) => {
  const [products, setProducts] = useState([]);
  const { isLoading, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sendRequest(process.env.REACT_APP_BACKEND_URL + 'products');
        console.log(data);
        setProducts(data.products);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [sendRequest, setProducts]);

  let productList = products.map((product) => {
    return <ProductItem key={product._id} product={product} />;
  });

  if (productList.length === 0) {
    productList = (
      <Empty>
        <p>No Product Found!</p>
      </Empty>
    );
  }

  return <div>{isLoading ? <LoadingSpinner /> : productList}</div>;
};

export default ProductList;
