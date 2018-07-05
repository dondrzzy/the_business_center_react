import React, {Component} from 'react';
import {BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';
import UserStore from '../../stores/UserStore';

export default class Navbar extends Component{
    constructor(){
        super();
        this.state = {
            isAuthenticated:UserStore.isLoggedIn()
        }
        this.changeLoginState = this.changeLoginState.bind(this);
    }
    componentWillMount = () => {
        UserStore.on('change', this.changeLoginState);
    }

    componentWillUnmount = () => {
        UserStore.removeListener("change", this.changeLoginState);
    }

    changeLoginState = () => {
        this.setState({isAuthenticated:UserStore.isLoggedIn()});
    }
    render = () => {
        let defaultNav = <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/login">Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/register">Register</NavLink>
                            </li>
                        </ul>
        let loggedInNav = <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/dashboard">Dashboard</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/logout">Logout</NavLink>
                            </li>
                        </ul>
        const navbarRight = this.state.isAuthenticated ? loggedInNav : defaultNav;
        return (
            <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
                <div className="container">
                    <Link to="/" className="navbar-brand">React Flux App</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/businesses">Businesses</NavLink >
                            </li>
                        </ul>

                        { navbarRight }
                    </div>
                </div>
            </div>
        )
    }
}

