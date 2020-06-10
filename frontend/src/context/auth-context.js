import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    userRol: null,
    login: (token, userId, userRol, tokenExpiration) => {},
    logout: () => {}
});