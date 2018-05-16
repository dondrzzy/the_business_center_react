import React, { Component } from 'react';
import Home from "../components/Home";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Logout from "../components/auth/Logout";
import Dashboard from "../components/Dashboard";
import ForgotPassword from "../components/auth/ResetPassword";
import Businesses from "../components/Businesses/Index";
import Business from "../components/Business";
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
            <div className="container" id="main">
                <Switch>
                    <Route exact path="/" render={(props) => <Home {...props} />} />
                    <Route path="/home" component={Home} />
                    <Route path="/login" render={(props) => <Login {...props} />} />
                    <Route path="/register" component={Register} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/forgot_password" component={ForgotPassword} />
                    <Route exact path="/businesses" render={(props) => <Businesses {...props} />} />
                    <Route path="/businesses/:id" component={Business} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />} />
                    <Route render={()=>(
                        <p>Not Found... If you manually entered the URL, edit it.</p>
                    )} />
                </Switch>
            </div>
        );
    }
}