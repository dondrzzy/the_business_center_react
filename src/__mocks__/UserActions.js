import dispatcher from "../dispatcher";
export default {
    authenticate_user:jest.fn((data)=>{
        console.log('dispatching mock get');
        dispatcher.dispatch({
            type:"LOGIN_USER",
            data: {}
        });
    })
}