import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserStore from '../../stores/UserStore';
import * as UserActions from '../../actions/UserActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import { BusinessStore } from '../../stores/BusinessStore';
import Gifs from '../../utils/gitImage';

export default class ResetPassword extends Component{

    constructor(props){
        super(props);
        this.state = {
            verified: false,
            redirectToForgot: false,
            resetUserEmail: "",
            isReset:false,
            formValidated : "",
            processing : false,
            loaderStyle : {display:"none"},
            password: "",
            passwordClassName: "form-control",
            validPassword : false,
            passwordMessage : "This field is required",
            confirmPassword: "",
            confirmPasswordClassName:"form-control",
            validConfirmPassword : false,
            confirmPasswordMessage : "This field is required",
            alertMessage: "",
            alertClass:""
        }
    }

    componentWillMount = () => {
        UserStore.on('success', this.resetPassword);
        UserStore.on('show', this.showResetPassword);
        UserStore.on('error', this.showFormErrors);
        UserStore.on('redirect', this.redirectUser);
    }

    componentWillUnmount = () => {
        UserStore.removeListener('error', this.showFormErrors);
        UserStore.removeListener('success', this.resetPassword);
        UserStore.removeListener('show', this.showResetPassword);
        UserStore.removeListener('redirect', this.redirectUser);
    }

    componentDidMount = () => {
        UserActions.verifyToken(this.props.match.params.token)
    }

    // display the reset password view on successfully decoding the reset password token
    showResetPassword = () => {
        let email = UserStore.getResetUser();
        this.setState({
            verified: true,
            loaderStyle:{display:"none"},
            resetUserEmail: email,
            alertClass:"alert alert-warning",
            alertMessage: "Account email:"+ email
        });
    }

    // redirect the user to login incase the reset token is invalid
    redirectUser = () => {
        this.setState({
            redirectToForgot:true
        });
    }

    // show success message on successfully reseting the password
    resetPassword = () => {
        this.setState({
            loaderStyle:{display:"none"},
            alertClass: "alert alert-success",
            alertMessage: UserStore.getResponse(),
            isReset: true
        });
    }

    // display form errors from the server
    showFormErrors = () => {
        this.setState({
            loaderStyle:{display:"none"},
            processing:false,
            alertClass: "alert alert-danger",
            alertMessage: UserStore.getResponse()
        });
    }

    validatePassword = password => {
        // eslint-disable-next-line to the line before.
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W]).{6,35}$/);
        if(regExp.test(password)){
            return true;
        }else{
            return false;
        }
    }

    handlePasswordValidation = (password, confirmPassword) => {
        let passwordMatch = false;
        if(!confirmPassword.trim()){
            this.setState({
                confirmPasswordClassName:"form-control is-invalid",
                validConfirmPassword : false,
            });
        }
        else if(password.trim() !== confirmPassword.trim()){
            this.setState({
                confirmPasswordClassName:"form-control is-invalid",
                validConfirmPassword : false,
                confirmPasswordMessage: "Passwords do not match"
            });
        }else{
            this.setState({
                confirmPasswordClassName:"form-control is-valid",
                validConfirmPassword : true
            });
            passwordMatch = true;
        }
        if(!password.trim()){
            this.setState({
                passwordClassName:"form-control is-invalid",
                validPassword : false
            });
        }else if(!this.validatePassword(password)){
            this.setState({
                passwordClassName:"form-control is-invalid",
                validPassword : false,
                passwordMessage: "Password should have 6 - 35 characters. Include alphanumeric characters and upper case letters"
            });
        }else{
            this.setState({
                passwordClassName:"form-control is-valid",
                validPassword : true
            });
            if(passwordMatch){
                return true;
            }
            
        }
        return false;
    }

    handleSubmit = event => {
        event.preventDefault();
        let password =  this.state.password;
        let confirmPassword =  this.state.confirmPassword;
        let passwordRes = this.handlePasswordValidation(password, confirmPassword);
        this.setState({formValidated:"wasValidated"});
        if( passwordRes){
            const data = {
                "email": this.state.resetUserEmail,
                "password": password,
                "confirm_password": confirmPassword
            }
            this.setState({loaderStyle:{display:"inline-block"} , processing:true});
            UserActions.resetPassword(data);
        }
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        })
    }

    handleConfirmPasswordChange = event => {
        this.setState({
            confirmPassword: event.target.value
        })
    }
    
    render(){
        if(this.state.redirectToForgot){
            return(
                <Redirect to='/forgot_password' />
            )
        }
        if(!this.state.verified){
            return(
                <div className="row">
                    <div className="col">
                        <img
                        id="img-loader"
                        // eslint-disable-next-line to the line before.
                        src={Gifs.getImageLoader()} />
                    </div>
                </div>
            )
        }
        let validField = <div className="feedback valid-feedback">Looks good</div>
        let validPassword = validField
        let invalidPassword = <div className="feedback invalid-feedback">{this.state.passwordMessage}</div>
        let passwordFeedback = this.state.validPassword ? validPassword : invalidPassword;
        let disabled = this.state.processing ? true : false;
        let validConfirmPassword = validField
        let invalidConfirmPassword = <div className="feedback invalid-feedback">{this.state.confirmPasswordMessage}</div>
        let confirmPasswordFeedback = this.state.validConfirmPassword ? validConfirmPassword : invalidConfirmPassword;

        if(this.state.isReset){
            return (<Redirect to="/login" />)
        }

        return(
            <div className="container" id="main">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h3 className="text-center">Reset Password</h3>
                    <div className={this.state.alertClass}>
                         {this.state.alertMessage}
                    </div>
                    <form disabled={disabled} onSubmit={this.handleSubmit} className={this.state.formValidated} noValidate>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="">New Password:</label>
                            <input disabled={disabled} type="password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                className={this.state.passwordClassName} name="password" placeholder="Password" />
                            {passwordFeedback}
                        </div>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="confirmPassword">Confirm Password:</label>
                            <input disabled={disabled} type="password"
                                value={this.state.confirmPassword}
                                onChange={this.handleConfirmPasswordChange}
                                className={this.state.confirmPasswordClassName}
                                name="confirmPassword" placeholder="Confirm Password" />
                            {confirmPasswordFeedback}
                        </div>
                        <div className="form-group">
                            <div className="text-center">
                                <img
                                    style={this.state.loaderStyle}
                                    // eslint-disable-next-line to the line before.
                                    src={Gifs.getImageLoader()} />
                            </div>
                            <input type="submit" value="Submit" disabled={disabled} className="btn btn-block btn-primary" />
                            <Link to="/" className="btn btn-default">Cancel</Link>
                        </div>                     
                    </form>
                </div>
            </div>
            </div>
        );
    }
}

            