import React, { Component } from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';
import UserStore from '../../stores/UserStore';


const PrivateRoute = ({component:Component, ...rest}) => (
    <Route {...rest} render={(props) =>(
        UserStore.isLoggedIn() === true
        ? 
        <Component {...props} />
        : <Redirect to={{
            pathname : '/login',
            state : { from : props.location }
        }} />
    )} />
)

export default PrivateRoute;