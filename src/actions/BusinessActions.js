import dispatcher from "../dispatcher";
import axios from "axios";

export const getBusinesses = (searchStr) =>{
    console.log('gettting Businesses')
    axios.get('http://127.0.0.1:5000/api/v1/businesses'+searchStr,
    {
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then(response=> 
        dispatcher.dispatch({
            type:"LOAD_BUSINESSES",
            data:response.data
        })
    )
    .catch(function (error) {
        console.log(error);
        // dispatcher.dispatch({
        //     type:"LOAD_BUSINESSES",
        //     data: error.response.data
        // });
    });
}

export const getUserBusinesses = () =>{
    const token = localStorage.getItem('jwt') 
    ? JSON.parse(localStorage.getItem('jwt')) 
    : null;
    axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/api/v1/users/businesses',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token':token
        }
    })
    .then(response=> 
        dispatcher.dispatch({
            type:"LOAD_BUSINESSES",
            data:response.data
        })
    )
    .catch(function (error) {
        // dispatcher.dispatch({
        //     type:"LOAD_BUSINESSES",
        //     data: error.response.data
        // });
    });
}

export const registerBusiness = (data) =>{
    const token = localStorage.getItem('jwt') 
    ? JSON.parse(localStorage.getItem('jwt')) 
    : null;
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/api/v1/businesses',
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token':token
        }
    })
    .then(response=>
        dispatcher.dispatch({
            type:"REGISTER_BUSINESSES",
            data:response.data
        })
    )
}

export const getReviews = (id) =>{
    axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/api/v1/businesses/'+id+'/reviews',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=>
        dispatcher.dispatch({
            type:"GET_REVIEWS",
            data:{
                res:response.data,
                id: id
            }
        })
    )
    .catch(function (error) {
        // console.log(error);
        // dispatcher.dispatch({
        //     type:"LOAD_BUSINESSES",
        //     data: error.response.data
        // });
    });
}
export const postReview = (id, data) =>{
    console.log(id);
    const token = localStorage.getItem('jwt') 
    ? JSON.parse(localStorage.getItem('jwt')) 
    : null;
    axios({
        method: 'post',
        data:data,
        url: 'http://127.0.0.1:5000/api/v1/businesses/'+id+'/reviews',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token':token
        }
    })
    .then(response=>
        dispatcher.dispatch({
            type:"ADD_REVIEW",
            data:{
                id:id,
                res:response.data
            }
        })
    )
    .catch(function (error) {
        dispatcher.dispatch({
            type:"ADD_REVIEW",
            data: {
                id:id,
                res:error.response.data
            }
        });
    });
}
