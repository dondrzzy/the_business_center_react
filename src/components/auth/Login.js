import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import UserStore from '../../stores/UserStore';
import * as UserActions from '../../actions/UserActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import Gifs from '../../utils/gitImage';

class Login extends Component{
    static propTypes = {
        auth : PropTypes.func
    }

    constructor(){
        super();
        this.state = {
            email: "",
            password: "",
            redirectToReferrer:false,
            formValidated : "",
            processing : false,
            loaderStyle : {display:"none"},
            emailClassName : "form-control",
            validEmail : false,
            emailMessage:"This field is required",
            passwordClassName: "form-control",
            validPassword : false,
            passwordMessage : "This field is required"
        }
    }

    // life cycle methods
    componentWillMount = () => {
        UserStore.on('change', this.loginUser);
        UserStore.on('error', this.showLoginErrors);
    }
    componentDidMount = () => {
        let report = UserStore.getPendingReport();
        if(report && report.status === "success"){
            toast.success(report.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false,
            });
        }else if(report && report.status === "error") {
            toast.error(report.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false,
            });
        }
    }
    componentWillUnmount = () =>  {
        UserStore.removeListener("change", this.loginUser);
        UserStore.removeListener("error", this.showLoginErrors);
    }

    // redirect a user top the dashboard or previous page
    loginUser = () => {
        this.setState({
            loaderStyle:{display:"none"},
            redirectToReferrer : UserStore.isLoggedIn()
        });
    }

    // toast errors from the API to a user trying to log in
    showLoginErrors = () => {
        toast.error(UserStore.getResponse(), {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false,
        });
        this.setState({
            loaderStyle:{display:"none"},
            processing:false,
            formValidated:"",
            emailMessage: "This field is required",
            passwordMessage: "This field is required"
        });
    }
    
    handlePasswordValidation = password => {
        if(!password.trim()){
            this.setState({
                passwordClassName:"form-control is-invalid",
                validPassword : false,
                formValidated:"wasValidated"
            });
        }else{
            this.setState({
                passwordClassName:"form-control is-valid",
                validPassword : true,
                formValidated:"wasValidated"
            });
            return true;
        }
        return false;
    }

    validateEmail = email => {
        // eslint-disable-next-line to the line before.
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if(regExp.test(email)){
            return true;
        }else{
            return false;
        }
    }
    // validate email and required field
    handleEmailValidation = email => {
        if(!email.trim()){
            this.setState({
                emailClassName:"form-control is-invalid",
                formValidated:"wasValidated",
                validEmail : false
            });
        }
        else if(!this.validateEmail(email)){
            this.setState({
                emailClassName:"form-control is-invalid",
                formValidated:"wasValidated",
                validEmail : false,
                emailMessage: "Please enter a valid email"
            });
        }else{
           this.setState({
                emailClassName:"form-control is-valid",
                formValidated:"wasValidated",
                validEmail : true
            });
            return true;
        }
        return false;
    }

    handleSubmit = event => {
        event.preventDefault();
        let email =  this.state.email;
        let password =  this.state.password;
        let emailRes = this.handleEmailValidation(email);
        let passwordRes = this.handlePasswordValidation(password);
        if(emailRes && passwordRes){
            this.setState({loaderStyle:{display:"inline-block"} , processing:true})
            UserActions.authenticateUser({email:email, password:password});
        }
    }

    handleEmailChange = event => {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        })
    }

    render = () => {
        const { redirectToReferrer } = this.state;
        const { from } = this.props.location.state ? this.props.location.state : { from : {pathname : '/dashboard'}}
        if(redirectToReferrer === true || UserStore.isLoggedIn() === true){
            return(
                <Redirect to={from} />
            )
        }
        let validEmail = <div className="feedback valid-feedback">Looks good</div>
        let invalidEmail = <div className="feedback invalid-feedback">{this.state.emailMessage}</div>
        let emailFeedback = this.state.validEmail ? validEmail : invalidEmail;
        let validPassword = <div className="feedback valid-feedback">Looks good</div>
        let invalidPassword = <div className="feedback invalid-feedback">{this.state.passwordMessage}</div>
        let passwordFeedback = this.state.validPassword ? validPassword : invalidPassword;
        let disabled = this.state.processing ? true : false;


        return(
            <div className="row justify-content-center">
                <div className="col-md-6 SignIn">
                    <ToastContainer />
                    <h3 className="text-center">Login</h3>
                    <form disabled={disabled} onSubmit={this.handleSubmit} className={this.state.formValidated} noValidate>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="email">Email:</label>
                            <input
                                disabled={disabled}
                                type="email" name="email"
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                                className={this.state.emailClassName}
                                placeholder="Email address"
                            />
                            {emailFeedback}
                        </div>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="password">Password:</label>
                            <input 
                                disabled={disabled}
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                className={this.state.passwordClassName}
                                placeholder="Password" />
                            {passwordFeedback}
                        </div>
                        <div className="form-group">
                        <div className="text-center">
                            <img
                                style={this.state.loaderStyle}
                                // eslint-disable-next-line to the line before.
                                src={Gifs.getImageLoader()} />
                        </div>
                            <input type="submit" value="Login" disabled={disabled} className="btn btn-block btn-primary" />
                            <Link to="/forgot_password" className="btn btn-default">Forgot Password*?</Link>
                        </div>                     
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
            