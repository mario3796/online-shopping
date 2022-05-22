import React from 'react';

import classes from './Button.module.css';

const Button = (props) => {
  return (
    <button
      className={classes.Button}
      type={props.type}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
