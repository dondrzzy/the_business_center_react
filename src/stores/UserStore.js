import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

export class UserStore extends EventEmitter{
    constructor(){
        super();
        const tokenExists = localStorage.getItem('jwt') ? true: null;
        this.auth = {
            isAuthenticated : tokenExists,
            jwt : null
        }
        this.message = null;
        this.isRegistered = false;
    }

    isLoggedIn(){
        return this.auth.isAuthenticated;
    }

    getJwt(){
        return JSON.parse(localStorage.getItem('jwt'));
    }

    loginUser(res){
        console.log(res);
        if(res.success){
            this.auth.isAuthenticated = true;
            localStorage.setItem('jwt', JSON.stringify(res.token))
            this.emit('change');
        }else{
            this.message = res.message;
            this.emit('error');
        }
        console.log('auth', this.auth.isAuthenticated)
    }
    logout(res){
        this.auth.isAuthenticated = false;
        this.message = res.message;
        localStorage.removeItem('jwt');
        this.emit('change');
    }
    get_response(){
        return this.message;
    }
    registerUser(res){
        console.log(res.message);
        if(res.success){
            this.isRegistered = true;
            this.message = res.message;
            this.emit('success');
        }else{
            this.message = res.message;
            this.emit('error');
        }
    }
    resetPassword(res){
        if(res.success){
            this.message = res.message;
            this.emit('success');
        }else{
            this.message = res.message;
            this.emit('error');
        }
    }

    handleActions(action){
        switch (action.type) {
            case "LOGIN_USER":
                this.loginUser(action.data);
                break;
            case "LOGOUT_USER":
                this.logout(action.data);
                break
            case "REGISTERED_USER":
                this.registerUser(action.data)
                break
            case "RESET_PASSWORD":
                this.resetPassword(action.data)
                break
        }
    }
   

}

const userStore = new UserStore;
dispatcher.register(userStore.handleActions.bind(userStore));
export default userStore;
