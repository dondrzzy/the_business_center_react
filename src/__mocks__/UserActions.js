import dispatcher from "../dispatcher";
export default {
    authenticateUser:jest.fn((data)=>{
        console.log('dispatching mock get');
        dispatcher.dispatch({
            type:"LOGIN_USER",
            data: {}
        });
    })
}