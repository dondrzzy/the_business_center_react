import React, {Component} from 'react';
import UserStore from '../../stores/UserStore';
import * as UserActions from '../../actions/UserActions';
import { Redirect } from 'react-router-dom';
class Logout extends Component{

    constructor(){
        super();
        this.state = {
            redirectToLogin:false
        }
    }

    logout = () => {
        this.setState({redirectToLogin:true});
    }
    componentWillMount = () => {
        UserStore.resetAuth();
        UserStore.on('change', this.logout);
    }
    componentDidMount = () => {
        UserActions.logout();
    }
    componentWillUnmount = () => {
        UserStore.removeListener("change", this.logout);
    }

    render(){
        if(this.state.redirectToLogin === true)
            return <Redirect to="/login" />
        return(
            <div className="signout">
                <h3>Logging out ...</h3>
            </div>
            
        )
    }
}


export default Logout