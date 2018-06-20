import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import BusinessStore from '../stores/BusinessStore'; 
import * as BusinessActions from '../actions/BusinessActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import $ from 'jquery';
import BusinessItem from './businesses/BusinessItem';


export default class Dashboard extends Component{
    constructor(){
        super();
        this.state = {
            businessWrap : {
                businesses:[],
                next_page:null,
                prev_page:null
            },
            params:{
                limit:5,
                page:1
            },
            redirect:false,
            formValidated : "",
            processing : false,
            loaderStyle : {display:"none"},
            nameClass : "form-control",
            validName : false,
            nameMessage:"This field is required",
            categoryClass : "form-control",
            validCategory : false,
            categoryMessage:"This field is required",
            locationClass : "form-control",
            validateLocation : false,
            locationMessage:"This field is required"
        }
    }
    componentWillMount = () => {
        BusinessStore.on('change', this.loadUserBusinesses);
        BusinessStore.on('success', this.reloadBusinesses);
        BusinessStore.on('redirect', ()=> {
            $('#bregisterModal').hide();
            $('.modal-backdrop').remove();
            this.setState({redirect:true})
        });
        BusinessStore.on('failure', ()=> this.showErrors);
    }

    componentDidMount(){
        if (localStorage.getItem('toastMessage'))
            toast.success(JSON.parse(localStorage.getItem('toastMessage')), {
                position: toast.POSITION.TOP_RIGHT
            });
        localStorage.removeItem('toastMessage');
        BusinessActions.getUserBusinesses();
    }

    componentWillUnmount = () => {
        BusinessStore.removeListener('success', this.loadUserBusinesses);
        BusinessStore.removeListener('success', this.reloadBusinesses);
        BusinessStore.removeListener('redirect', ()=> this.setState({
            redirect:true
        }));
        BusinessStore.removeListener('failure', ()=> this.showErrors);
    }
    showErrors = ()=>{
        toast.error(BusinessStore.get_response(), {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false,
        });
        this.setState({
            loaderStyle:{display:"none"},
            processing:false
        });
    }
    loadUserBusinesses = () =>{
        this.setState({
            businessWrap:BusinessStore.getBusinesses()
        })
    }
    reloadBusinesses = () =>{
        localStorage.setItem('toastMessage', JSON.stringify(BusinessStore.getResponse()));
        window.location.reload();
    }

    handleBusinessRegister = (e) => {
        let nameRes = this.handleNameValidation(this.refs.name.value);
        let categoryRes = this.handleCategoryValidation(this.refs.category.value);
        let locationRes = this.handleLocationValidation(this.refs.location.value);
        this.setState({formValidated : "wasValidated"})
        if( nameRes && categoryRes && locationRes ){
            this.setState({loaderStyle:{display:"inline-block"}, processing:true});
            const data = {
                "name": this.refs.name.value,
                "category": this.refs.category.value,
                "location": this.refs.location.value
            }
            console.log(data);
            BusinessActions.registerBusiness(data);
        }
        e.preventDefault();
    }
    
    handleNameValidation = (name) =>{
        if(!name.trim()){
            this.setState({
                nameClass:"form-control is-invalid",
                validName : false
            });
        }else if(!this.validateName(name)){
            this.setState({
                nameClass:"form-control is-invalid",
                validName : false,
                nameMessage: "Please enter a valid business name"
            });
        }else{
            this.setState({
                nameClass:"form-control is-valid",
                validName : true
            });
            return true;
        }
        return false;
    }
    validateName = (name) =>{
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
        if (regex.test(name)) {
            return true;
        }else {
            return false;
        }
    }

    handleCategoryValidation = (cat) =>{
        if(!cat.trim()){
            this.setState({
                categoryClass:"form-control is-invalid",
                validCategory : false
            });
        }else if(!this.validateCategory(cat)){
            this.setState({
                categoryClass:"form-control is-invalid",
                validCategory : false,
                categoryMessage: "Please select a valid business category"
            });
        }else{
            this.setState({
                categoryClass:"form-control is-valid",
                validCategory : true
            });
            return true;
        }
        return false;
    }
    validateCategory = (cat) =>{
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
        if (regex.test(cat)) {
            return true;
        }else {
            return false;
        }
    }

    handleLocationValidation = (loc) =>{
        if(!loc.trim()){
            this.setState({
                locationClass:"form-control is-invalid",
                validLocation : false
            });
        }else if(!this.validateLocation(loc)){
            this.setState({
                locationClass:"form-control is-invalid",
                validLocation : false,
                locationMessage: "Please select a valid business location"
            });
        }else{
            this.setState({
                locationClass:"form-control is-valid",
                validLocation : true
            });
            return true;
        }
        return false;
    }
    validateLocation = (loc) =>{
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
        if (regex.test(loc)) {
            return true;
        }else {
            return false;
        }
    }

    handleModalClosed = ()=>{
        this.setState({loaderStyle : {display:"none"}});
    }
    setParams(params){
        if(this.refs.businesses) this.setState({ params });
    }
    encodeQueryData(){
        let params = this.state.params;
        let urlParams = [];
        for (let i in params){
            if(i === 'page' && params[i] !== 1)
                urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
            else if(i === 'limit' && params[i] !== 5)
                urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
        }
        if(this.refs.dashboard){
            window.location.assign(this.props.location.pathname + "?" + urlParams.join('&'));
        }
    }

    handleLimitChange = event => {
        let params = this.state.params;
        params['limit'] = parseInt(event.target.value);
        this.setParams(params);
        this.encodeQueryData();
    }

    render(){
        let {prev_page} = this.state.businessWrap;
        let {next_page} = this.state.businessWrap;
        let prev = prev_page 
        ? <li className="page-item"><a className="page-link" href="#">Previous</a></li> 
        : <li className="page-item disabled"><span className="page-link">Previous</span></li>

        let next = next_page 
        ? <li className="page-item"><a className="page-link" href="#">Next</a></li> 
        : <li className="page-item disabled"><span className="page-link">Next</span></li>

        let curr = next_page ? next_page-1:1;

        let businessItems;
        let {businesses} = this.state.businessWrap;
        console.log(businesses)
        let bgLight = true;
        businessItems = businesses.map(business =>{
                let bg = bgLight;
                bgLight = !bgLight;
                return (<BusinessItem key={business.id} bg={bg} business={business} />)
            })


        let validField = <div className="feedback valid-feedback">Looks good</div>
        let validName = validField
        let invalidName = <div className="feedback invalid-feedback">{this.state.nameMessage}</div>
        let nameFeedback = this.state.validName ? validName : invalidName;
        let validCategory = validField
        let invalidCategory = <div className="feedback invalid-feedback">{this.state.categoryMessage}</div>
        let categoryFeedback = this.state.validCategory ? validCategory : invalidCategory;
        let validLocation = validField
        let invalidLocation = <div className="feedback invalid-feedback">{this.state.locationMessage}</div>
        let locationFeedback = this.state.validLocation ? validLocation : invalidLocation;
        let disabled = this.state.processing ? true : false;

        if(this.state.redirect){
            return(
                <Redirect to='/logout' />
            )
        }

        return(
            <div ref="dashboard" id="dashboard">
                <div className="row">
                    <ToastContainer />
                    <div className="col">
                        <h4>Welcome User</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="call-action">
                            <div className="text">
                                <h3>You currently have no businesses registered</h3>
                                <p>Sieze this opportunity to add your business on our platform to get access to over 1 million clients.</p>
                            </div>
                            <div className="cta">
                                <button type="button" className="btn btn-outline-primary" data-toggle="modal" data-target="#bregisterModal">
                                    Register Business
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        
                        <h4 className="section-heading">
                            My Businesses
                            <span></span>
                        </h4>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">
                                <li className="page-item disabled"><span className="page-link">Per page:</span></li>
                                <li className="page-item">
                                    <select value={this.state.params.limit} ref="limit" id="limit" onChange={this.handleLimitChange}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                    </select>
                                </li>
                                {prev}
                                <li className="page-item active"><a className="page-link" href="#">{curr}</a></li>
                                {next}
                            </ul>
                        </nav>
                        <ul className="my-bs">
                            {businessItems}
                        </ul>
                    </div>
                </div>
                <div className="modal fade" id="bregisterModal" tabIndex="-1" role="dialog" aria-labelledby="bregisterModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="bregisterModalLabel">Register Business</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-10 col-md-offset-1">
                                        
                                        <form  disabled={disabled} className={this.state.formValidated} noValidate>
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="name">Business Name:</label>
                                                <input
                                                    disabled={disabled}
                                                    type="text" ref="name" name="name"
                                                    className={this.state.nameClass} />
                                                {nameFeedback}
                                            </div>
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="location">Location:</label>
                                                <select ref="location" className="form-control">
                                                    <option value="Kampala">Kampala</option>	
                                                </select>
                                                {locationFeedback}
                                            </div>
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="cat">Category:</label>
                                                <select ref="category" className="form-control" >
                                                    <option value="Consultancy">Consultancy</option>
                                                </select>
                                                {categoryFeedback}
                                            </div>
                                        </form>
                                    </div>
                                        
                                </div>
                            </div>
                            <div className="modal-footer">
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
                                <button type="button" onClick={this.handleModalClosed} className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" onClick={this.handleBusinessRegister} className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
