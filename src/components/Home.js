import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';

export default class extends Component{
  render(){
    return (
        <div className="row Home">
            <div className="col-12">
                <div className="jumbotron">
                    <h2>The Business Center</h2>
                    <p>The Buusiess Center is a company that will exposes you to more than two million users, a market base like no other and environment that will best suit your clients. The Business Center has stood the taste of time and will develop with your business. <b>Register now!!!</b></p>   
                    <hr />     
                    <div>
                        <div className="text-center">
                            <Link to="/login" className="btn btn-primary">Login</Link>
                            <Link to="/register" className="btn btn-success">Register</Link>
                        </div>
                    </div>
                        
                </div>

                
            </div>
        </div>
    )
  }
}