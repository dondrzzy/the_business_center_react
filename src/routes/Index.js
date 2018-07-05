import React, { Component } from 'react';
import Home from "../components/Home";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Logout from "../components/auth/Logout";
import Dashboard from "../components/Dashboard";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import Businesses from "../components/businesses/Businesses";
import NotFound from "../components/NotFound";
// import Business from "../components/Business";
import PrivateRoute from "../components/auth/PrivateRoute";
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

export default class Routes extends Component{
    constructor(){
        super();
    }

    render(){
        return (
                <Switch>
                    <Route exact path="/" render={(props) => <Home {...props} />} />
                    <Route path="/home" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/forgot_password" component={ForgotPassword} />
                    <Route path="/reset_password/:token" component={ResetPassword} />
                    <Route exact path="/businesses" component={Businesses} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />} />
                    <NotFound />
                </Switch>
        );
    }
}