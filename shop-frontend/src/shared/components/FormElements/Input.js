import classes from './Input.module.css';

const Input = (props) => {
  let input;
  if (props.textarea) {
    input = (
      <textarea
        name={props.name}
        rows="5"
        onChange={props.onChange}
        defaultValue={props.defaultValue}
      />
    );
  } else {
    input = (
      <input
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        type={props.type}
        accept={props.accept}
        name={props.name}
        step={props.step}
        required
      />
    );
  }
  return (
    <div className={classes.Input}>
      <label htmlFor={props.name}>
        {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
      </label>
      {input}
    </div>
  );
};

export default Input;
