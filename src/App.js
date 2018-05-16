import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import "./App.css";
import Navbar from "./components/layout//Navbar";
import Routes from "./routes";
import Footer from "./components/layout/Footer";
import createBrowserHistory from 'history/createBrowserHistory';

export default class App extends Component{
  constructor(){
    super();
    this.state = {
      isLoggedIn : false
    }
    let history;
  }

  componentWillMount(){
    this.history = createBrowserHistory();
  }

  auth(cmd=null){
    console.log('logging in...');
    if(cmd === 'signin') this.setState({ isLoggedIn : true });
    else  this.setState({ isLoggedIn : false });
  }

  render(){
    return (
      <Router>
        <div>
          <Navbar isLoggedIn={this.state.isLoggedIn} />
          <Routes auth={this.auth.bind(this)} />
          <Footer />
        </div>          
      </Router>
    )
  }
}
