import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link,Redirect } from 'react-router-dom';
import UserStore from '../../stores/UserStore';
import * as UserActions from '../../actions/UserActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';

class Login extends Component{
    static propTypes = {
        auth : PropTypes.func
    }

    constructor(){
        super();
        this.state = {
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
        this.loginUser = this.loginUser.bind(this);
        this.showLoginErrors = this.showLoginErrors.bind(this);
    }

    componentWillMount(){
        UserStore.on('change', this.loginUser);
        UserStore.on('error', this.showLoginErrors);
    }
    componentWillUnmount() {
        UserStore.removeListener("change", this.loginUser);
        UserStore.removeListener("error", this.showLoginErrors);
    }

    loginUser() {
        this.setState({
            loaderStyle:{display:"none"},
            redirectToReferrer : UserStore.isLoggedIn()
        });
    }

    showLoginErrors(){
        toast.error(UserStore.get_response(), {
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
    
    handlePasswordValidation(password){
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
    validateEmail(email){
        // eslint-disable-next-line to the line before.
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if(regExp.test(email)){
            return true;
        }else{
            return false;
        }
    }
    handleEmailValidation(email){
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

    handleSubmit(e) {
        e.preventDefault();
        let email =  this.refs.email.value;
        let password =  this.refs.password.value;
        let emailRes = this.handleEmailValidation(email);
        let passwordRes = this.handlePasswordValidation(password);
        if(emailRes && passwordRes){
            console.log('submitting');
            this.setState({loaderStyle:{display:"inline-block"} , processing:true})
            UserActions.authenticateUser({email:email, password:password});
        }
    }


    render(){
        const { redirectToReferrer } = this.state;
        const { from } = this.props.location.state ? this.props.location.state : { from : {pathname : '/dashboard'}}
        if(redirectToReferrer === true){
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
                    <form disabled={disabled} onSubmit={this.handleSubmit.bind(this)} className={this.state.formValidated} noValidate>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="email">Email:</label>
                            <input
                                disabled={disabled}
                                type="email" ref="email" name="email"
                                className={this.state.emailClassName}
                                placeholder="Email address"
                            />
                            {emailFeedback}
                        </div>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="password">Password:</label>
                            <input disabled={disabled} type="password" name="password" ref="password" className={this.state.passwordClassName} placeholder="Password" />
                            {passwordFeedback}
                        </div>
                        <div className="form-group">
                        <div className="text-center">
                            <img
                                style={this.state.loaderStyle}
                                // eslint-disable-next-line to the line before.
                                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWph
                                eGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAA
                                AEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBo
                                VjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DY
                                lJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAA
                                ACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFV
                                dmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYR
                                gHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
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
            