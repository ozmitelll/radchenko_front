// src/components/privateRoute.js

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthService.getCurrentUser()
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login' }} />
  )} />
);

export default PrivateRoute;