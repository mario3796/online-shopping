import { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">Online Shopping</Link>
      </div>
      <div className={classes.left}>
        <Link to="/products">Products</Link>
        {authCtx.token && (
          <Fragment>
            <Link to="/new-product">New Product</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </Fragment>
        )}
      </div>
      <div className={classes.right}>
        {authCtx.token ? (
          <button onClick={authCtx.logout}>Logout</button>
        ) : (
          <Fragment>
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Login</Link>
          </Fragment>
        )}
      </div>
    </header>
  );
};

export default MainNavigation;
