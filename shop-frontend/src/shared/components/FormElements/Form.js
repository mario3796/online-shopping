import classes from './Form.module.css';

const Form = (props) => (
  <form
    onSubmit={props.onSubmit}
    className={classes.Form}
    encType={props.encType}
    noValidate
  >
    {props.children}
  </form>
);

export default Form;
