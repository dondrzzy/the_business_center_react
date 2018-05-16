import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserStore from '../../stores/UserStore';
import * as UserActions from '../../actions/UserActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';

export default class Register extends Component{

    constructor(){
        super();
        //set defualt state prpoperties
        this.state = {
            isRegistered:false,
            formValidated : "",
            processing : false,
            loaderStyle : {display:"none"},
            nameClassName : "form-control",
            validName : false,
            nameMessage:"This field is required",
            emailClassName : "form-control",
            validEmail : false,
            emailMessage:"This field is required",
            passwordClassName: "form-control",
            validPassword : false,
            passwordMessage : "This field is required",
            confirmPasswordClassName:"form-control",
            validConfirmPassword : false,
            confirmPasswordMessage : "This field is required"
        }
        this.showFormErrors = this.showFormErrors.bind(this);
        this.confirmRegistration = this.confirmRegistration.bind(this);   
    }

    componentWillMount(){//eventemitters to look out for when component mounts
        UserStore.on('error', this.showFormErrors);
        UserStore.on('success', this.confirmRegistration);
    }
    componentWillUnmount(){
        UserStore.removeListener('error', this.showFormErrors);
        UserStore.removeListener('success', this.confirmRegistration);
    }

    // method called after user has successfully registered
    confirmRegistration(){
        this.setState({
            loaderStyle:{display:"none"}
        });
        toast.success(UserStore.get_response(), {
            position: toast.POSITION.TOP_RIGHT,
            onClose: () => (
                this.setState({isRegistered:true})
            )
        });
    }

    // method triggers the error mesage to be displayed to the user
    showFormErrors(){
        toast.error(UserStore.get_response(), {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false,
        });
        this.setState({
            loaderStyle:{display:"none"},
            processing:false
        });
    }

    // method validates the password
    validatePassword(password){
        // eslint-disable-next-line to the line before.
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W]).{6,35}$/);
        if(regExp.test(password)){
            return true;
        }else{
            return false;
        }
    }

    // method handles the validation of password
    handlePasswordValidation(password, confirmPassword){
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
        console.log(password.trim());
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

    // method validates the email
    validateEmail(email){
        // eslint-disable-next-line to the line before.
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if(regExp.test(email)){
            return true;
        }else{
            return false;
        }
    }

    // methods handles email validation
    handleEmailValidation(email){
        if(!email.trim()){
            this.setState({
                emailClassName:"form-control is-invalid",
                validEmail : false
            });
        }
        else if(!this.validateEmail(email)){
            this.setState({
                emailClassName:"form-control is-invalid",
                validEmail : false,
                emailMessage: "Please enter a valid email"
            });
        }else{
           this.setState({
                emailClassName:"form-control is-valid",
                validEmail : true
            });
            return true;
        }
        return false;
    }
    validateName(name){
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
        if (regex.test(name)) {
            return true;
        }else {
            return false;
        }
    }
    handleNameValidation(name){
        console.log(name.trim());
        if(!name.trim()){
            this.setState({
                nameClassName:"form-control is-invalid",
                validName : false
            });
        }else if(!this.validateName(name)){
            this.setState({
                nameClassName:"form-control is-invalid",
                validName : false,
                nameMessage: "Please enter a valid email"
            });
        }else{
            this.setState({
                nameClassName:"form-control is-valid",
                validName : true
            });
            return true;
        }
        return false;
    }
    // validate email and submit form data
    handleSubmit(e){
        e.preventDefault();
        let password =  this.refs.password.value;
        let confirmPassword =  this.refs.confirmPassword.value;
        let nameRes = this.handleNameValidation(this.refs.name.value);
        let emailRes = this.handleEmailValidation(this.refs.email.value);
        let passwordRes = this.handlePasswordValidation(password, confirmPassword);
        this.setState({formValidated:"wasValidated"});
        if( emailRes && passwordRes && nameRes){
            this.setState({loaderStyle:{display:"inline-block"}, processing:true});
            const data = {
                "name": this.refs.name.value,
                "email": this.refs.email.value,
                "password": password,
                "confirm_password": confirmPassword
            }
            UserActions.registerUser(data);
        }
    }

    render(){
        
        let validField = <div className="feedback valid-feedback">Looks good</div>
        let validName = validField
        let invalidName = <div className="feedback invalid-feedback">{this.state.nameMessage}</div>
        let nameFeedback = this.state.validName ? validName : invalidName;
        let validEmail = validField
        let invalidEmail = <div className="feedback invalid-feedback">{this.state.emailMessage}</div>
        let emailFeedback = this.state.validEmail ? validEmail : invalidEmail;
        let validPassword = validField
        let invalidPassword = <div className="feedback invalid-feedback">{this.state.passwordMessage}</div>
        let passwordFeedback = this.state.validPassword ? validPassword : invalidPassword;
        let disabled = this.state.processing ? true : false;
        let validConfirmPassword = validField
        let invalidConfirmPassword = <div className="feedback invalid-feedback">{this.state.confirmPasswordMessage}</div>
        let confirmPasswordFeedback = this.state.validConfirmPassword ? validConfirmPassword : invalidConfirmPassword;

        if(this.state.isRegistered){
            return(
                <Redirect to='/login' />
            )
        }

        return(
            <div className="row justify-content-center">
                <div className="col-md-6 SignUp">
                    <ToastContainer />
                    <h3 className="text-center">Register</h3>
                    <form disabled={disabled} onSubmit={this.handleSubmit.bind(this)} className={this.state.formValidated} noValidate>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="name">Name:</label>
                            <input
                                disabled={disabled}
                                type="text" ref="name" name="name"
                                className={this.state.nameClassName}
                                placeholder="Full name"
                            />
                            {nameFeedback}
                        </div>
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
                            <label className="col-form-label" htmlFor="">Password:</label>
                            <input disabled={disabled} type="password" ref="password" className={this.state.passwordClassName} placeholder="Password" />
                            {passwordFeedback}
                        </div>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="confirmPassword">Confirm Password:</label>
                            <input disabled={disabled} type="password" ref="confirmPassword" className={this.state.confirmPasswordClassName} placeholder="Confirm Password" />
                            {confirmPasswordFeedback}
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
                            <input type="submit" value="Submit" disabled={disabled} className="btn btn-block btn-primary" />
                        </div>                     
                    </form>
                </div>
            </div>
        );
    }
}

            