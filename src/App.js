// src/App.js

import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import Login from './components/Login';
import Home from './components/Home';
import NotFound from "./components/NotFound";
import Header from "./components/Header";
import MyOrders from "./components/MyOrders";
import CreateOrder from "./components/CreateOrder";
import Queue from "./components/Queue";

function App() {
    return (
        <Router>
            <Header/>

            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/login" component={Login}/>
                <PrivateRoute path="/my-orders" component={MyOrders}/>
                <PrivateRoute path="/create-order" component={CreateOrder}/>
                <PrivateRoute path="/queue" component={Queue}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    );
}

export default App;