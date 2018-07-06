import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import BusinessStore from '../stores/BusinessStore';
import UserStore from '../stores/UserStore';
import * as BusinessActions from '../actions/BusinessActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import $ from 'jquery';
import BusinessItem from './businesses/BusinessItem';
import BusinessList from './businesses/BusinessList';
import BusinessRegister from './businesses/BusinessRegister';
import Gifs from '../utils/gitImage';


export default class Dashboard extends Component{
    constructor(){
        super();
        this.state = {
            decodedId: '',
            businessWrap : {
                businesses:[],
                user: {},
                next_page: null,
                prev_page: null,
                total: 0,
                categories: []
            },
            params:{
                limit:5,
                page:1
            },
            fetching: false,
            redirect:false,
        }
    }
    componentWillMount = () => {
        this.setState({
            decodedId: UserStore.getDecodedId()
        })
        BusinessStore.on('change', this.loadUserBusinesses);
        BusinessStore.on('success', this.reloadBusinesses);
        BusinessStore.on('redirect', this.redirectUser);
        BusinessStore.on('failure', this.toastErrors);
        BusinessStore.on('review_posted', this.toastSuccess);
        BusinessStore.on('update', this.updateBusinesses);
        BusinessStore.on('delete', this.removeBusinesses);
    }

    componentWillUnmount = () => {
        BusinessStore.removeListener('change', this.loadUserBusinesses);
        BusinessStore.removeListener('success', this.reloadBusinesses);
        BusinessStore.removeListener('redirect', this.redirectUser);
        BusinessStore.removeListener('review_posted', this.toastSuccess);
        BusinessStore.removeListener('failure', this.toastErrors);
        BusinessStore.removeListener('update', this.updateBusinesses);
        BusinessStore.removeListener('delete', this.removeBusinesses);
    }

    componentDidMount = () => {
        this.setState({fetching: true})
        BusinessActions.getUserBusinesses();
    }

    redirectUser = () => {
        $('.modal').hide();
        $('.modal-backdrop').remove();
        localStorage.setItem('toastMessage', JSON.stringify(BusinessStore.getResponse()));
        this.setState({redirect:true})
    }

    toastErrors = () => {
        toast.error(BusinessStore.getResponse(), {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false,
        });
        this.setState({
            loaderStyle:{display:"none"},
            processing:false
        });
    }

    toastSuccess = () => {
        toast.success(BusinessStore.getResponse(), {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    loadUserBusinesses = () => {
        this.setState({
            businessWrap:BusinessStore.getBusinesses(),
            fetching: false
        });
    }

    reloadBusinesses = () => {
        this.toastSuccess();
        $('#bregisterModal').hide();
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open')
        $('button[data-target="#bregisterModal"]').click();
        this.encodeQueryData();
    }

    updateBusinesses = () => {
        this.toastSuccess();
        let businessWrap = this.state.businessWrap;
        let updatedBusiness = BusinessStore.getUpdatedBusiness();
        let currentBusinesses = this.state.businessWrap.businesses;
        for(let i in currentBusinesses){
            if(currentBusinesses[i].id === updatedBusiness.id){
                currentBusinesses[i] = updatedBusiness;
            }
        }
        businessWrap.businesses = currentBusinesses;
        this.setState({ businessWrap })
    }

    removeBusinesses = () => {
        let businessWrap = this.state.businessWrap;
        let deletedBusinessId = BusinessStore.getDeletedBusiness();
        let currentBusinesses = this.state.businessWrap.businesses;
        let params = this.state.params;
        for(let i in currentBusinesses){
            if(currentBusinesses[i].id === deletedBusinessId){
                currentBusinesses.splice(i, 1)
            }
            
        }
        if(currentBusinesses.length === 0){
            params["page"] -= 1;
            if(params["page"] > 0)
                this.setParams(params);
        }
        this.encodeQueryData();
    }

    setParams = params => {
        if(this.refs.dashboard) this.setState({ params });
    }

    encodeQueryData = () => {
        let params = this.state.params;
        let urlParams = [];
        for (let i in params){
            if(i === 'page' && params[i] !== 1)
                urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
            else if(i === 'limit' && params[i] !== 5)
                urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
        }
        if(this.refs.dashboard){
            BusinessActions.getUserBusinesses("?" + urlParams.join('&'));
        }
    }

    handleLimitChange = event => {
        let params = this.state.params;
        params['limit'] = parseInt(event.target.value);
        this.setParams(params);
        this.encodeQueryData();
    }

    handleSetPage = page => {
        let params = this.state.params;
        params['page'] = page ? page : 1;
        this.setParams(params);
        this.encodeQueryData();
    }

    viewOptionsButtons = () => {
        return true;
    }

    viewPostReviewButton = () => {
        return false;
    }

    render = () => {
        let name = this.state.name === "" ? "User" : this.state.businessWrap.user.name;
        let {prev_page} = this.state.businessWrap;
        let {next_page} = this.state.businessWrap;
        let prev = prev_page
        ? <li className="page-item">
            <a className="page-link" id="prev" onClick={() => this.handleSetPage(prev_page)} href="#">Previous</a>
        </li>
        : <li className="page-item disabled"><span className="page-link off">Previous</span></li>

        let next = next_page
        ? <li className="page-item">
            <a onClick={() =>this.handleSetPage(next_page)} id="next" className="page-link" href="#">Next</a>
        </li>
        : <li className="page-item disabled"><span className="page-link off">Next</span></li>

        let curr = next_page ? next_page-1:prev_page+1;

        let categoryOptions;
        if(this.state.businessWrap.categories)
            categoryOptions = this.state.businessWrap.categories.map(category => {
                return(
                    <option 
                        key={category.id}
                        value={category.id} >
                            {category.category}
                    </option>
                )
            });

        let businessList = <BusinessList
            categoryOptions={categoryOptions}
            businesses={this.state.businessWrap.businesses}
            uid={this.state.decodedId}
            viewOptionsButtons={this.viewOptionsButtons}
        />

        if(this.state.redirect){
            return(
                <Redirect to='/logout' />
            )
        }

        if(this.state.fetching){
            return(
                <div className="container" id="main">
                    <div className="row">
                        <div className="col">
                            <img
                            id="img-loader"
                            // eslint-disable-next-line to the line before.
                            src={Gifs.getImageLoader()} />
                        </div>
                    </div>
                </div>
            )
        }

        return(
            <div className="container" id="main">
            <div ref="dashboard" id="dashboard">
                <div className="row">
                    <ToastContainer />
                    <div className="col">
                        <h4>Account: {name}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="call-action">
                            <div className="text">
                                <h3>
                                    You currently have {' '}
                                    {this.state.businessWrap.total === 0 && 'no'} 
                                    {this.state.businessWrap.businesses.length > 0 &&
                                        this.state.businessWrap.total} 
                                    {' '} businesses registered</h3>
                                <p>
                                    Sieze this opportunity to add your business on our platform to get
                                    access to over 1 million clients.
                                </p>
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
                                    <select value={this.state.params.limit} id="limit" onChange={this.handleLimitChange}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                    </select>
                                </li>
                                {prev}
                                <li className="page-item active"><span className="page-link">{curr}</span></li>
                                {next}
                            </ul>
                        </nav>
                        {businessList}
                    </div>
                </div>
                <BusinessRegister categoryOptions={categoryOptions} />
            </div>
            </div>
        )
    }
}
