import React, { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { AuthContext } from '../shared/context/auth-context';
import { modalActions } from '../shared/store/modal-slice';
import { useHttpClient } from '../shared/hooks/http-hook';

import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../shared/components/Error/ErrorMessage';
import Button from '../shared/components/FormElements/Button';
import Input from '../shared/components/FormElements/Input';
import Form from '../shared/components/FormElements/Form';

const Auth = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
  });
  const { isLoading, error, sendRequest } = useHttpClient();

  const submitHandler = async (event) => {
    event.preventDefault();
    let url = process.env.REACT_APP_BACKEND_URL + 'signup';
    if (props.isLogin) {
      url = process.env.REACT_APP_BACKEND_URL + 'login';
    }
    const data = await sendRequest(url, 'POST', JSON.stringify(user), {
      'Content-Type': 'application/json',
    });

    if (props.isLogin) {
      authCtx.login(data);
      return history.replace('/');
    }

    dispatch(modalActions.signup(() => dispatch(modalActions.close())));
    history.replace('/login');
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <Form onSubmit={submitHandler}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        defaultValue={user.email}
        type="email"
        name="email"
        value={user.email}
        onChange={(event) => setUser({ ...user, email: event.target.value })}
      />
      {!props.isLogin && (
        <Fragment>
          <Input
            defaultValue={user.username}
            type="text"
            name="username"
            value={user.username}
            onChange={(event) =>
              setUser({ ...user, username: event.target.value })
            }
          />
        </Fragment>
      )}
      <Input
        defaultValue={user.password}
        type="password"
        name="password"
        value={user.password}
        onChange={(event) => setUser({ ...user, password: event.target.value })}
      />
      <Button type="submit">{props.isLogin ? 'Login' : 'Sign in'}</Button>
    </Form>
  );
};

export default Auth;
