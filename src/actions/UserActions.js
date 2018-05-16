import dispatcher from "../dispatcher";
import axios from "axios";

export const authenticate_user = (data) =>{
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/api/v1/auth/login',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=> 
        dispatcher.dispatch({
            type:"LOGIN_USER",
            data:response.data
        })
    )
    .catch(function (error) {
        dispatcher.dispatch({
            type:"LOGIN_USER",
            data: error.response.data
        });
    });
}

export const logout = () =>{
    const token = localStorage.getItem('jwt') 
    ? JSON.parse(localStorage.getItem('jwt')) 
    : null;

    console.log('token', token);
    axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/api/v1/auth/logout',
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
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/api/v1/auth/register',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        console.log(response)
        dispatcher.dispatch({
            type:"REGISTERED_USER",
            data:response.data
        });
    })
    .catch(function (error) {
        dispatcher.dispatch({
            type:"REGISTERED_USER",
            data: error.response.data
        });
    });
    
}

export const resetPasword = (data) =>{
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/api/v1/auth/reset-password',
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
//     dispatcher.dispatch({ type:"FETCHING_BUSINESSES" });
//     axios.get("http://127.0.0.1:5000/api/v1/businesses")
//         .then(res => {
//             console.log('fetched', res.data);
//             dispatcher.dispatch({
//                 type:"LOAD_BUSINESSES",
//                 data:res.data
//             })
//         })
         
// }