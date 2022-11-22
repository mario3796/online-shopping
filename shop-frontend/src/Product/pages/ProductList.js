import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import queryString from 'query-string';

import ProductItem from '../components/ProductItem';
import Empty from '../../shared/components/Empty/Empty';
import Pagination from '../../shared/components/Pagination/Pagination';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const ProductList = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
  const { search } = useLocation();
  const values = queryString.parse(search);

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + 'products?page=' + +values.page || page
          );
          setProducts(data.products);
          setTotalItems(data.totalItems);
        } catch (err) {
          console.log(err);
        }
      };
      +values.page && setPage(+values.page);
      fetchProducts();
  }, [sendRequest, setProducts, values.page, page]);

  let productList = products.map((product) => {
    return <ProductItem key={product._id} product={product} />;
  });

  return isLoading ? (
    <LoadingSpinner />
  ) : productList.length > 0 ? (
    <div>
      {productList}
      <Pagination
        currentPage={page}
        hasNextPage={2 * page < totalItems}
        hasPreviousPage={page > 1}
        nextPage={page + 1}
        previousPage={page - 1}
        lastPage={Math.ceil(totalItems / 2)}
      />
    </div>
  ) : (
    <Empty>
      <p>No Product Found!</p>
    </Empty>
  );
};

export default ProductList;
