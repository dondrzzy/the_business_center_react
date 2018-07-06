import React, { Component } from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';
import UserStore from '../../stores/UserStore';

// This is a high order component that wraps authentication required components and routes
const PrivateRoute = ({component:Component, ...rest}) => (
    <Route {...rest} render={(props) =>(
        UserStore.isLoggedIn() === true
        ? 
        <Component {...props} />
        : <Redirect to={{ pathname : '/login', state : { from : props.location } }} />
    )} />
)

export default PrivateRoute;