import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import UserStore from '../stores/UserStore';
import BusinessCenterImage from '../images/business_center_01.jpg';
import Background_01 from '../images/img_01.jpg';
import Background_02 from '../images/img_04.jpg';
import SS1 from '../images/ss_01.png';


var bgImageStyle01 = {
backgroundImage: `url(${Background_01})`
};
var bgImageStyle02 = {
backgroundImage: `url(${Background_02})`
};

export default class Home extends Component{
    constructor(){
        super();
        this.state = {
            isAuthenticated: UserStore.isLoggedIn()
        }
    }
    componentWillMount = () => {
        this.setState({isAuthenticated:UserStore.isLoggedIn()});
    }
    componentWillUnmount = () => {
        
    }
    render = () => {
        let unAuthBtns = this.state.isAuthenticated
        ? ""
        :<div className="text-center">
            <Link id="loginBtn" to="/login" className="btn btn-primary">Login</Link>
            <Link id="registerBtn" to="/register" className="btn btn-success">Register</Link>
        </div>
        
        return (
            <div className="row Home">
                <div className="col-12">
                    <div id="demo" className="carousel slide" data-ride="carousel">

                        <ul className="carousel-indicators">
                            <li data-target="#demo" data-slide-to="0" className="active"></li>
                            {/* <li data-target="#demo" data-slide-to="1"></li>*/}
                        </ul>

                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img className="img-responsive" src={BusinessCenterImage} alt="Business Center Image" />
                                <div className="carousel-caption">
                                    <div className="jumbotron">
                                        <p className="description">The Buusiess Center is a company that will exposes you to more than two million users, a market base like no other and environment that will best suit your clients. The Business Center has stood the taste of time and will develop with your business. <b>Register now!!!</b></p>   
                                        <hr /> 
                                        <div className="text-center">
                                            <Link id="registerBtn" to="/register" className="btn btn-success">TRY IT NOW</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="carousel-item">
                                <img src="chicago.jpg" alt="Chicago" />
                            </div>*/}
                        </div>
                        <a className="carousel-control-prev" href="#demo" data-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </a>
                        <a className="carousel-control-next" href="#demo" data-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </a>

                    </div>
                    <div className="parallax" style={ bgImageStyle01 }>
                        <div className="parallax-inner">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-md-12">
                                        <div className="jumbotron">
                                            <h1>Manage Your Business
                                            </h1>
                                            <h2>We Market Your Business</h2>
                                            <h4>Register, update and delete your business!!!</h4>
                                            <div className="intro-body">
                                                <p>
                                                Lorem Ipsum is simply dummy text of the printing and 
                                                typesetting industry. Lorem Ipsum has been the industry
                                                's standard dummy text ever since the 1500s, when an 
                                                unknown printer took a galley of type and scrambled it
                                                to make a type specimen book. It has survived not only
                                                five centuries
                                                </p>
                                            </div>
                                        </div>
                                        {/* <img className="img-responsive" src={SS1} alt="Business Center Image" /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="parallax" style={ bgImageStyle02 }>
                        <div className="parallax-inner">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-md-12">
                                        <div className="jumbotron clear">
                                            <h1>
                                                We rely on you
                                            </h1>
                                            <h3>Don't forget to review!!!</h3>
                                            <div className="intro-body">
                                                <p>
                                                Lorem Ipsum is simply dummy text of the printing and 
                                                typesetting industry. Lorem Ipsum has been the industry
                                                's standard dummy text ever since the 1500s, when an 
                                                unknown printer took a galley of type and scrambled it
                                                to make a type specimen book. It has survived not only
                                                five centuries
                                                </p>
                                            </div>
                                        </div>
                                        {/* <img className="img-responsive" src={SS1} alt="Business Center Image" /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}