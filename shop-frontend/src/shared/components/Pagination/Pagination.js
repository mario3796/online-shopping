import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Pagination.module.css';

const Pagination = (props) => {
  return (
    props.currentPage <= props.lastPage && (
      <section className={classes.Pagination}>
        <div style={{ margin: 'auto' }}>
          {props.currentPage !== 1 && props.previousPage !== 1 && (
            <Link to="/products?page=1">{'<<'}</Link>
          )}
          {props.hasPreviousPage && (
            <Link to={`/products?page=${props.previousPage}`}>
              {props.previousPage}
            </Link>
          )}
          <Link
            className={classes.active}
            to={`/products?page=${props.currentPage}`}
          >
            {props.currentPage}
          </Link>
          {props.hasNextPage && (
            <Link to={`/products?page=${props.nextPage}`}>
              {props.nextPage}
            </Link>
          )}
          {props.currentPage !== props.lastPage &&
            props.nextPage !== props.lastPage && (
              <Link to={`/products?page=${props.lastPage}`}>{'>>'}</Link>
            )}
        </div>
      </section>
    )
  );
};

export default Pagination;
