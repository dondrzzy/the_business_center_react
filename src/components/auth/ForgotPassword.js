import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserStore from '../../stores/UserStore';
import * as UserActions from '../../actions/UserActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import { BusinessStore } from '../../stores/BusinessStore';
import Gifs from '../../utils/gitImage';

export default class ForgotPassword extends Component{

    constructor(){
        super();
        this.state = {
            email: "",
            formValidated : "",
            processing : false,
            loaderStyle : {display:"none"},
            emailClassName : "form-control",
            validEmail : false,
            emailMessage:"This field is required",
            alertClass: "",
            message: ""
        }
    }

    componentWillMount(){
        UserStore.on('success', this.resetPassword);
        UserStore.on('error', this.showFormErrors);
    }
    componentWillUnmount(){
        UserStore.removeListener('success', this.resetPassword);
        UserStore.removeListener('error', this.showFormErrors);
    }
    
    componentDidMount = () => {
        let report = UserStore.getPendingReport();
        if(report && report.status === "error") {
            toast.error(report.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false,
            });
        }
    }
    
    // display success message to the user
    resetPassword = () => {
        this.setState({
            loaderStyle:{display:"none"},
            processing:false,
            alertClass:"alert alert-success",
            message: UserStore.getResponse()
        });
    }

    showFormErrors = () => {
        this.setState({
            loaderStyle:{display:"none"},
            processing:false,
            alertClass:"alert alert-danger",
            message: UserStore.getResponse()
        });
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

    handleEmailValidation = email => {
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

    handleSubmit = event => {
        event.preventDefault();
        let email =  this.state.email;
        let emailRes = this.handleEmailValidation(email);
        this.setState({formValidated:"wasValidated"});
        if( emailRes ){
            this.setState({loaderStyle:{display:"inline-block"} , processing:true});
            UserActions.forgotPassword(email);
        }
    }

    handleEmailChange = event => {
        this.setState({
            email: event.target.value
        });
    }
    
    render(){
        let validField = <div className="feedback valid-feedback">Looks good</div>
        let validEmail = validField
        let invalidEmail = <div className="feedback invalid-feedback">{this.state.emailMessage}</div>
        let emailFeedback = this.state.validEmail ? validEmail : invalidEmail;
        let disabled = this.state.processing ? true : false;

        return(
            <div className="container" id="main">
            <div className="row justify-content-center">
                <ToastContainer />
                <div className="col-md-6">
                    <h3 className="text-center">Forgot Password</h3>
                    <div className={this.state.alertClass}>
                        {this.state.message}
                    </div>
                    <form disabled={disabled} onSubmit={this.handleSubmit} className={this.state.formValidated} noValidate>
                        <div className="form-group">
                            <label className="col-form-label" htmlFor="email">Enter your email address:</label>
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
                            <div className="text-center">
                                <img
                                    style={this.state.loaderStyle}
                                    // eslint-disable-next-line to the line before.
                                    src={Gifs.getImageLoader()} />
                            </div>
                            <input type="submit" value="Send" disabled={disabled} className="btn btn-block btn-primary" />
                            <Link to="/" className="btn btn-default">Cancel</Link>
                        </div>                     
                    </form>
                </div>
            </div>
            </div>
        );
    }
}

            