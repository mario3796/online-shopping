import React, { Suspense, useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// import NewProduct from './Product/pages/NewProduct';
// import ProductDetails from './Product/pages/ProductDetails';
// import ProductList from './Product/pages/ProductList';
// import Auth from './Auth/Auth';
// import Cart from './Cart/pages/Cart';
// import OrderList from './Order/pages/OrderList';
// import OrderDetails from './Order/pages/OrderDetails';

import NotFound from './shared/pages/NotFound';
import Layout from './shared/components/Layout/Layout';
import Modal from './shared/components/Modal/Modal';
import LoadingSpinner from './shared/components/LoadingSpinner/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context';
import { modalActions } from './shared/store/modal-slice';

const NewProduct = React.lazy(() => import('./Product/pages/NewProduct'));
const ProductDetails = React.lazy(() => import('./Product/pages/ProductDetails'));
const ProductList = React.lazy(() => import('./Product/pages/ProductList'));
const Auth = React.lazy(() => import('./Auth/Auth'));
const Cart = React.lazy(() => import('./Cart/pages/Cart'));
const OrderList = React.lazy(() => import('./Order/pages/OrderList'));
const OrderDetails = React.lazy(() => import('./Order/pages/OrderDetails'));

function App() {
  const authCtx = useContext(AuthContext);
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const routes = (
    <Switch>
        <Route path="/" exact>
          <Redirect to="/products" />
        </Route>
        <Route path="/new-product">
          {authCtx.token || localStorage.getItem('token') ? (
            <NewProduct />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/products" exact>
          <ProductList />
        </Route>
        <Route path="/products/:id">
          <ProductDetails />
        </Route>
        <Route path="/edit-product/:id">
          {authCtx.token || localStorage.getItem('token') ? (
            <NewProduct editing />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/cart">
          {authCtx.token || localStorage.getItem('token') ? (
            <Cart />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/orders" exact>
          {authCtx.token || localStorage.getItem('token') ? (
            <OrderList />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/orders/:id">
          {authCtx.token || localStorage.getItem('token') ? (
            <OrderDetails />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/signup">
          {!authCtx.token ? <Auth /> : <Redirect to="/" />}
        </Route>
        <Route path="/login">
          {!authCtx.token ? <Auth isLogin /> : <Redirect to="/" />}
        </Route>
        <Route path="*" component={NotFound} />
      </Switch>
  );
  return (
    <Layout>
      <Modal
        clicked={dispatch.bind(this, modalActions.close())}
        show={modal.show}
      >
        {modal.content}
      </Modal>
      <Suspense fallback={<LoadingSpinner />}>
        {routes}
      </Suspense>
    </Layout>
  );
}

export default App;
