import { Fragment } from 'react';

import classes from './Modal.module.css';
import Backdrop from './Backdrop';

const Modal = (props) => {
  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.clicked} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? 1 : 0,
        }}
      >
        <div className={classes.header}>
          <h3>Alert!</h3>
        </div>
        <div className={classes.body}>
          <div className={classes.content}>{props.children}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;
