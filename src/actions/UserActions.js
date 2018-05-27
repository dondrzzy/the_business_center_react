import dispatcher from "../dispatcher";
import * as urlConfig from '../utils/baseUrl';
import axios from "axios";
const baseUrl = urlConfig.default.getBaseUrl()+'auth/';

export const authenticate_user = (data) =>{
    axios.post(
        baseUrl+'login',
        data,
        {
            headers: {
            'Content-Type': 'application/json'
            }
        })
    .then(response=>{
        console.log(response);
        dispatcher.dispatch({
            type:"LOGIN_USER",
            data:response.data
        })
    })
    .catch(function (error) {
        console.log(error);
        dispatcher.dispatch({
            type:"LOGIN_USER",
            data: error.response.data
        });
    });
}

export const logout = () =>{
    const token = window.localStorage.getItem('jwt') 
    ? JSON.parse(window.localStorage.getItem('jwt')) 
    : null;

    console.log('token', token);
    axios({
        method: 'get',
        url: baseUrl+'logout',
        headers:{
            'Content-Type':'application/json',
            'x-access-token': token
        }
    })
    .then(function (response) {
        console.log('response', response);
        dispatcher.dispatch({
            type:"LOGOUT_USER",
            data:response.data
        });
    })
    .catch(function (error) {
        dispatcher.dispatch({
            type:"LOGOUT_USER",
            data: error.response.data
        });
    });
}

export const registerUser = (data) =>{
    // axios({
    //     method: 'post',
    //     url: baseUrl+'register',
    //     data: data,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(function (response) {
    //     console.log(response)
    //     dispatcher.dispatch({
    //         type:"REGISTERED_USER",
    //         data:response.data
    //     });
    // })
    // .catch(function (error) {
    //     dispatcher.dispatch({
    //         type:"REGISTERED_USER",
    //         data: error.response.data
    //     });
    // });
    
}

export const resetPasword = (data) =>{
    axios({
        method: 'post',
        url: baseUrl+'reset-password',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        dispatcher.dispatch({
            type:"RESET_PASSWORD",
            data:response.data
        });
    })
    .catch(function (error) {
        console.log(error.response);
        dispatcher.dispatch({
            type:"RESET_PASSWORD",
            data: error.response.data
        });
    });
    
}


// export const getBusinesses = () =>{     
//     axios.get("/businesses")
//         .then(res => {
//             console.log('fetched', res.data);
//             dispatcher.dispatch({
//                 type:"LOAD_BUSINESSES",
//                 data:res.data
//             })
//         })
         
// }