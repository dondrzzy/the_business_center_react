import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import jwtDecode from 'jwt-decode';
export class UserStore extends EventEmitter{
    constructor(){
        super();
        this.token = window.localStorage.getItem('jwt');
        const tokenExists = this.token ? true: false;
        this.auth = {
            isAuthenticated : tokenExists,
            jwt : null
        }
        this.message = null;
        this.isRegistered = false;
        this.resetEmail = "";
        this.pendingMessage = false;
        this.pendingStatus = 'error';
    }
    // return the decoded id of a token
    getDecodedId = () => {
        try {
            let decoded = jwtDecode(window.localStorage.getItem('jwt'));
            return decoded.uid;
        } catch(error) {
            return '';
        }
        
    }

    // reset the currently details of the authenticated user
    resetAuth = () => {
        this.token = null;
        this.resetEmail = "";
        this.isRegistered = false;
    }

    // return user if token exists
    // To Do, check if token is not expired
    isLoggedIn = () => {
        return this.auth.isAuthenticated;
    }

    // store the token in local storage
    loginUser = res => {
        if(res.success){
            this.auth.isAuthenticated = true;
            window.localStorage.setItem('jwt', JSON.stringify(res.token))
            this.emit('change');
        }else{
            this.message = res.message;
            this.emit('error');
        }
    }

    // clear storage
    logout = res => {
        this.auth.isAuthenticated = false;
        this.message = res.message;
        window.localStorage.removeItem('jwt');
        this.emit('change');
    }

    // return stored response from the server
    getResponse = () => {
        return this.message;
    }

    // get message to toast when user is redirected to login
    getPendingReport = () => {
        if(this.pendingMessage){
            this.pendingMessage = false;
            return {'status':this.pendingStatus, 'message':this.getResponse()}
        }
        return false
    }

    registerUser = res => {
        if(res.success){
            this.isRegistered = true;
            this.message = res.message;
            this.emit('success');
        }else{
            this.message = res.message;
            this.emit('error');
        }
    }

    // get the email of a user trying to reset and clear it immediately
    getResetUser = () => {
        let email = this.resetEmail;
        this.resetEmail = "";
        return email;
    }

    // handle response, user entered email in forgot password form
    forgotPassword = res => {
        if(res.success){
            this.message = res.message;
            this.emit('success');
        }else{
            this.message = res.message;
            this.emit('error');
        }
    }

    // emit show event if user reset token was successfully decoded else emit error or redirect
    showResetPassword = res => {
        console.log(res)
        if(res.success){
            this.resetEmail = res.user;
            this.emit('show');
        }else{
            this.message = res.message;
            this.pendingMessage = true;
            this.pendingStatus = 'error';
            this.emit('redirect');
        }
    }

    // emit success on password reset success
    resetPassword = res => {
        if(res.success){
            this.message = res.message;
            this.pendingMessage = true;
            this.pendingStatus = 'success';
            this.emit('success');
        }else{
            this.message = res.message;
            this.emit('error');
        }
    }

    handleActions = action => {
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
            case "FORGOT_PASSWORD":
                this.forgotPassword(action.data)
                break
            case "SHOW_RESET_PASSWORD":
                this.showResetPassword(action.data)
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
