// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthService from './services/auth.service';
import PrivateRoute from './components/privateRoute';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';

function App() {
    AuthService.createExampleUser();
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;