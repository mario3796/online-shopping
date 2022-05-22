import React, { useCallback, useEffect, useState } from 'react';

export const AuthContext = React.createContext({
  token: null,
  login: (token) => {},
  logout: () => {},
});

let logoutTimer;

const calculateRemainingTime = (expTime) => {
  const currentTime = new Date().getTime();
  const expirationTime = new Date(expTime).getTime() * 1000;
  const duration = expirationTime - currentTime;
  return duration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = +localStorage.getItem('expiresIn');
  const userId = localStorage.getItem('userId');
  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (storedToken && storedExpirationDate) {
    return {
      token: storedToken,
      duration: remainingTime,
      userId: userId,
    };
  } else return null;
};

const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const loginHandler = async (tokenData) => {
    setToken(tokenData.token);
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('expiresIn', tokenData.expirationTime);
    localStorage.setItem('userId', tokenData.userId);

    const duration = calculateRemainingTime(tokenData.expirationTime);
    logoutTimer = setTimeout(logoutHandler, duration);
  };

  const logoutHandler = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
    setToken(null);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      setTimeout(logoutHandler, tokenData.duration);
      console.log(tokenData);
    }
  }, [logoutHandler, tokenData]);

  const contextValue = {
    token: token,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
