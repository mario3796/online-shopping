import classes from './ErrorMessage.module.css';

const ErrorMessage = (props) => (
  <div className={classes.ErrorMessage}>{props.children}</div>
);

export default ErrorMessage;
