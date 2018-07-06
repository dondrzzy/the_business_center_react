import dispatcher from "../dispatcher";
import * as urlConfig from '../utils/baseUrl';
import axios from "axios";
const baseUrl = urlConfig.default.getBaseUrl()+'auth/';

export const authenticateUser = data =>{
    axios.post(
        baseUrl+'login',
        data,
        {
            headers: {
            'Content-Type': 'application/json'
            }
        })
    .then(response => {
        dispatcher.dispatch({
            type:"LOGIN_USER",
            data:response.data
        })
    })
    .catch( error => {
        if(error.response){
            dispatcher.dispatch({
                type:"LOGIN_USER",
                data: error.response.data
            });
        }
    });
}

export const logout = () =>{
    const token = window.localStorage.getItem('jwt') 
    ? JSON.parse(window.localStorage.getItem('jwt')) 
    : null;
    axios.get(
        baseUrl+'logout',
        {
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
            }
    })
    .then( response => {
        dispatcher.dispatch({
            type:"LOGOUT_USER",
            data:response.data
        });
    })
    .catch( error => {
        if(error.response){
            dispatcher.dispatch({
                type:"LOGOUT_USER",
                data: error.response.data
            });
        }
    });
}

export const registerUser = data => {
    axios.post(
        baseUrl+'register',
        data,
        {
            headers: {
            'Content-Type': 'application/json'
            }
        })
    .then( response => {
        dispatcher.dispatch({
            type:"REGISTERED_USER",
            data:response.data
        });
    })
    .catch( error => {
        if(error.response){
            dispatcher.dispatch({
                type:"REGISTERED_USER",
                data: error.response.data
            });
        }
    });
    
}

export const resetPassword = data =>{
    axios.post(
        baseUrl+'reset-password',
        data,
        {
            headers: {
            'Content-Type': 'application/json'
            }
        })
    .then(response => {
        dispatcher.dispatch({
            type:"RESET_PASSWORD",
            data:response.data
        });
    })
    .catch( error => {
        if(error.response){
            dispatcher.dispatch({
                type:"RESET_PASSWORD",
                data: error.response.data
            });
        }
    });
}
export const forgotPassword = email =>{
    let data ={ "email" : email }
    axios.post(
        baseUrl+'forgot-password',
        data,
        {
            headers: {
            'Content-Type': 'application/json'
            }
        })
    .then( response => {
        dispatcher.dispatch({
            type:"FORGOT_PASSWORD",
            data:response.data
        });
    })
    .catch( function(error){
        if(error.response)
            dispatcher.dispatch({
                type:"FORGOT_PASSWORD",
                data: error.response.data
            });
    });
}

export const verifyToken = token =>{
    let data ={ "token" : token }
    axios.post(
        baseUrl+'verify-password-token',
        data,
        {
            headers: {
            'Content-Type': 'application/json'
            }
        })
    .then(function (response) {
        dispatcher.dispatch({
            type:"SHOW_RESET_PASSWORD",
            data:response.data
        });
    }).catch(function (error) {
        if(error.response){
            dispatcher.dispatch({
                type:"SHOW_RESET_PASSWORD",
                data: error.response.data
            });
        }
    });
}
