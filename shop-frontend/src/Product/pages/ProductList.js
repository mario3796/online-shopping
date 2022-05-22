import { useEffect, useState } from 'react';

import ProductItem from '../components/ProductItem';
import Empty from '../../shared/components/Empty/Empty';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const ProductList = (props) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'products');
        const data = await response.json();
        console.log(data);
        setProducts(data.products);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [setProducts]);

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
